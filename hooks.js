import { useState, useEffect } from "react";

import constants from "./constants.json";

export const useDecimalInputState = (tieParams = null) => {
    const [value, setValue] = useState("");
    const [legal, setLegal] = useState(false);

    const lowerBound = tieParams === null ? 1 : tieParams.lowerBound;
    const upperBound = tieParams === null ? 10 : tieParams.upperBound;

    const onChangeValue = (newValue) => {
        if (newValue === "") {
            setValue(newValue);
            return;
        }
        let cleanedNewValue = newValue.replace(/[^\d.]/g, "");
        const firstPointIndex = cleanedNewValue.indexOf(".");
        if (firstPointIndex !== -1) {
            let betweenTheDots = cleanedNewValue.split(".");
            cleanedNewValue =
                betweenTheDots[0] + "." + betweenTheDots.slice(1).join("");
        }
        if (cleanedNewValue > upperBound || cleanedNewValue < lowerBound) {
            setLegal(false);
        } else {
            setLegal(true);
        }
        setValue(cleanedNewValue + "");
    };

    return [value, legal, onChangeValue];
};

const transformRoomState = (roomState) => {
    return {
        state: roomState.state,
        sectionData: [
            {
                title: "VOTED",
                data: Object.keys(roomState.votes).filter(
                    (name) => roomState.votes[name] !== null
                ),
            },
            {
                title: "JOINED",
                data: Object.keys(roomState.votes).filter(
                    (name) => roomState.votes[name] === null
                ),
            },
        ],
    };
};

export const useSubmissionsScreenState = (params, navigation) => {
    const roomCode = params.roomCode;
    const [closingErrorMessage, setClosingErrorMessage] = useState(null);
    const [waitingForCloseRequest, setWaitingForCloseRequest] = useState(false);
    const [requestingRoomStateUpdate, setRequestingRoomStateUpdate] = useState(
        false
    );
    const [roomState, setRoomState] = useState(
        transformRoomState({ state: 0, votes: {} })
    );
    const [roomStateErrorMessage, setRoomStateErrorMessage] = useState(null);

    const requestRoomStateUpdate = async () => {
        setRequestingRoomStateUpdate(true);

        const res = await fetch(
            constants.server_address +
                "/room/" +
                roomCode +
                "/vote/" +
                params.name
        );
        const returnValue = await res.json();
        if (res.status == 200) {
            setRoomStateErrorMessage(null);
            const parsedReturnValue = JSON.parse(returnValue);
            const newRoomState = transformRoomState(parsedReturnValue);
            if (newRoomState.state == 2) {
                navigation.reset({
                    index: 1,
                    routes: [
                        { name: "Home" },
                        { name: "TieScreen", params: params },
                    ],
                });
            } else if (newRoomState.state == 4) {
                navigation.reset({
                    index: 1,
                    routes: [
                        { name: "Home" },
                        {
                            name: "ResultsScreen",
                            params: {
                                winner: parsedReturnValue.winner,
                                ...params,
                            },
                        },
                    ],
                });
            }
            setRoomState(newRoomState);
        } else {
            setRoomStateErrorMessage(returnValue);
        }
        setRequestingRoomStateUpdate(false);
    };

    useEffect(() => {
        const timerId = setInterval(requestRoomStateUpdate, 5000);
        requestRoomStateUpdate();
        navigation.addListener("beforeRemove", () => {
            fetch(
                constants.server_address +
                    "/room/" +
                    roomCode +
                    "/vote/" +
                    params.name,
                {
                    method: "DELETE",
                }
            );
        });
        return () => clearInterval(timerId);
    }, []);

    const toggleClosed = async () => {
        setWaitingForCloseRequest(true);
        const res = await fetch(
            constants.server_address + "/room/" + roomCode,
            { method: "PUT" }
        );
        const returnedErrorMessage = await res.json();
        if (res.status == 200) {
            setClosingErrorMessage(null);
        } else {
            setClosingErrorMessage(returnedErrorMessage);
        }
        await requestRoomStateUpdate();
        setWaitingForCloseRequest(false);
    };

    const [requestingReveal, setRequestingReveal] = useState(false);
    const [revealButtonDisabled, setRevealButtonDisabled] = useState(true);
    useEffect(() => {
        setRevealButtonDisabled(roomState.sectionData[1].data.length !== 0);
    }, [roomState]);

    const onReveal = async () => {
        setRequestingReveal(true);
        const res = await fetch(
            constants.server_address + "/room/" + roomCode + "/reveal",
            { method: "POST" }
        );
        const returnedErrorMessage = await res.json();
        if (res.status === 201) {
            setRoomStateErrorMessage(null);
        } else {
            setRoomStateErrorMessage(returnedErrorMessage);
        }
        await requestRoomStateUpdate();
        setRequestingReveal(false);
    };

    return [
        roomState,
        toggleClosed,
        waitingForCloseRequest,
        requestingRoomStateUpdate,
        closingErrorMessage,
        roomStateErrorMessage,
        revealButtonDisabled,
        requestingReveal,
        onReveal,
    ];
};
