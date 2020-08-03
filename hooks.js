import { useState, useEffect } from "react";

import constants from "./constants.json";

export const useDecimalInputState = () => {
    const [value, setValue] = useState("");

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
        if (cleanedNewValue > 10) {
            cleanedNewValue = "10";
        }
        if (cleanedNewValue < 1) {
            cleanedNewValue = "1";
        }
        setValue(cleanedNewValue);
    };

    return [value, onChangeValue];
};

const transformRoomState = (roomState) => {
    return {
        closed: roomState.closed,
        revealed: roomState.revealed,
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

export const useSubmissionsPageState = (params, navigation) => {
    const roomCode = params.roomCode;
    const [closed, setClosed] = useState(false);
    const [closingErrorMessage, setClosingErrorMessage] = useState(null);
    const [waitingForCloseRequest, setWaitingForCloseRequest] = useState(false);
    const [requestingRoomStateUpdate, setRequestingRoomStateUpdate] = useState(
        false
    );
    const [roomState, setRoomState] = useState(
        transformRoomState({ closed: false, revealed: false, votes: {} })
    );
    const [roomStateErrorMessage, setRoomStateErrorMessage] = useState(null);

    const requestRoomStateUpdate = async () => {
        setRequestingRoomStateUpdate(true);

        const res = await fetch(
            constants.server_address + "/room/" + roomCode + "/vote"
        );
        const returnValue = await res.json();
        if (res.status == 200) {
            setRoomStateErrorMessage(null);
            const newRoomState = transformRoomState(JSON.parse(returnValue));
            if (newRoomState.revealed) {
                navigation.navigate("ResultsPage", params);
            }
            setRoomState(newRoomState);
        } else {
            setRoomStateErrorMessage(returnValue);
        }
        setRequestingRoomStateUpdate(false);
    };

    const toggleClosed = async () => {
        setWaitingForCloseRequest(true);
        const newClosed = !closed;
        const res = await fetch(
            constants.server_address + "/room/" + roomCode,
            {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "PUT",
                body: JSON.stringify({
                    closed: newClosed,
                }),
            }
        );
        const returnedErrorMessage = await res.json();
        if (res.status == 200) {
            setClosingErrorMessage(null);
            setClosed(newClosed);
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
        requestRoomStateUpdate();
        setRequestingReveal(false);
    };

    return [
        roomState,
        toggleClosed,
        requestRoomStateUpdate,
        waitingForCloseRequest,
        requestingRoomStateUpdate,
        closingErrorMessage,
        roomStateErrorMessage,
        revealButtonDisabled,
        requestingReveal,
        onReveal,
    ];
};
