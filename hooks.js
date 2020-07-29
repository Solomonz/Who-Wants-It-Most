import { useState } from "react";

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
