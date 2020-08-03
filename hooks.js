import { useState } from "react";

import constants from "./constants.json";

export const useDecimalInputState = () => {
    const [value, setValue] = useState("");

    const onChangeValue = (newValue) => {
        if (
            newValue === "" ||
            (newValue !== "10." && newValue[newValue.length - 1] === ".")
        ) {
            setValue(newValue);
        } else {
            setValue(
                Math.max(
                    1,
                    Math.min(10, newValue.replace(/[^\d.]/g, ""))
                ).toString()
            );
        }
    };

    return [value, onChangeValue];
};

export const useClosingState = (roomCode) => {
    const [closed, setClosed] = useState(false);
    const [closingErrorMessage, setClosingErrorMessage] = useState(null);
    const [waitingForCloseRequest, setWaitingForCloseRequest] = useState(false);

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
    };

    return [
        toggleClosed,
        waitingForCloseRequest,
        setWaitingForCloseRequest,
        closingErrorMessage,
    ];
};

const transformRoomState = (roomState) => {
    return {
        closed: roomState.closed,
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

export const useRoomState = (roomCode, setWaitingForCloseRequest) => {
    const [requestingRoomStateUpdate, setRequestingRoomStateUpdate] = useState(
        false
    );
    const [roomState, setRoomState] = useState({ closed: false, votes: {} });
    const [roomStateErrorMessage, setRoomStateErrorMessage] = useState(null);

    const requestRoomStateUpdate = async () => {
        setRequestingRoomStateUpdate(true);

        const res = await fetch(
            constants.server_address + "/room/" + roomCode + "/vote"
        );
        const returnValue = await res.json();
        if (res.status == 200) {
            setRoomStateErrorMessage(null);
            setRoomState(transformRoomState(JSON.parse(returnValue)));
        } else {
            setRoomStateErrorMessage(returnValue);
        }

        setRequestingRoomStateUpdate(false);
        setWaitingForCloseRequest(false);
    };

    return [
        roomState,
        requestingRoomStateUpdate,
        roomStateErrorMessage,
        requestRoomStateUpdate,
    ];
};
