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
        setWaitingForCloseRequest(false);
    };

    return [closed, toggleClosed, waitingForCloseRequest, closingErrorMessage];
};