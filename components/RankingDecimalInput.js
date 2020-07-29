import React, { useState, useEffect, useRef } from "react";
import {
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    View,
} from "react-native";

import { useDecimalInputState } from "../hooks";

export default function RankingDecimalInput({ onConfirm, focused }) {
    const [value, onChangeValue] = useDecimalInputState();
    const [confirmButtonDisabled, setConfirmButtonDisabled] = useState(true);
    const inputRef = useRef();
    useEffect(() => setConfirmButtonDisabled(value === ""), [value]);
    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.decimalComponetsContainer,
                    focused
                        ? styles.decimalComponetsContainerFocused
                        : styles.decimalComponetsContainerUnfocused,
                ]}
            >
                <View
                    style={[
                        styles.decimalInputContainer,
                        focused ? {} : styles.decimalInputContainerUnfocused,
                    ]}
                >
                    <TextInput
                        ref={inputRef}
                        style={[
                            styles.decimalInput,
                            focused
                                ? styles.decimalInputFocused
                                : styles.decimalInputUnfocused,
                        ]}
                        onChangeText={onChangeValue}
                        value={value}
                        placeholder={focused ? "" : "Enter a decimal"}
                        keyboardType="decimal-pad"
                    />
                </View>
                {focused && (
                    <View style={{ flexDirection: "row" }}>
                        <TouchableHighlight
                            style={[
                                styles.confirmButton,
                                ...(confirmButtonDisabled
                                    ? [styles.confirmButtonDisabled]
                                    : []),
                            ]}
                            onPress={onConfirm}
                            underlayColor="orange"
                            disabled={confirmButtonDisabled}
                        >
                            <Text
                                style={[
                                    styles.confirmButtonText,
                                    ...(confirmButtonDisabled
                                        ? [styles.confirmButtonTextDisabled]
                                        : []),
                                ]}
                            >
                                Confirm
                            </Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={styles.confirmButton}
                            onPress={() => inputRef.current.blur()}
                            underlayColor="orange"
                        >
                            <Text style={styles.confirmButtonText}>
                                Go Back
                            </Text>
                        </TouchableHighlight>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
    },
    decimalComponetsContainer: {
        flex: 1,
    },
    decimalComponetsContainerUnfocused: {
        flexDirection: "row",
    },
    decimalComponetsContainerFocused: {
        flexDirection: "column",
        alignItems: "center",
    },
    decimalInputContainer: {
        flexDirection: "row",
    },
    decimalInputContainerUnfocused: {
        flex: 1,
    },
    decimalInput: {
        flex: 1,
        borderWidth: 2,
        margin: 10,
        textAlign: "center",
        borderRadius: 5,
        padding: 5,
    },
    decimalInputFocused: {
        fontSize: 80,
    },
    decimalInputUnfocused: {
        fontSize: 20,
        backgroundColor: "lightgrey",
    },
    confirmButton: {
        margin: 10,
        padding: 10,
        borderWidth: 2,
        borderRadius: 10,
        // alignSelf: "stretch",
    },
    confirmButtonDisabled: {
        backgroundColor: "lightgrey",
    },
    confirmButtonText: {
        fontSize: 30,
        textAlign: "center",
    },
    confirmButtonTextDisabled: {
        color: "grey",
    },
});
