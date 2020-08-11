import React, { useState, useEffect, useRef } from "react";
import {
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
                        placeholder={focused ? "" : "Enter your own number"}
                        keyboardType="decimal-pad"
                    />
                </View>
                {focused && (
                    <View style={{ flexDirection: "row" }}>
                        <TouchableHighlight
                            style={styles.button}
                            onPress={() => onConfirm(value)}
                            underlayColor="grey"
                            disabled={confirmButtonDisabled}
                        >
                            <View
                                style={[
                                    styles.buttonWrapper,
                                    styles.confirmButtonWrapper,
                                    confirmButtonDisabled
                                        ? {}
                                        : styles.confirmButtonWrapperDisabled,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.confirmButtonText,
                                        !confirmButtonDisabled
                                            ? {}
                                            : styles.confirmButtonTextDisabled,
                                    ]}
                                >
                                    Confirm
                                </Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={styles.button}
                            onPress={() => inputRef.current.blur()}
                            underlayColor="grey"
                        >
                            <View
                                style={[
                                    styles.buttonWrapper,
                                    styles.backButtonWrapper,
                                ]}
                            >
                                <Text style={styles.confirmButtonText}>
                                    Go Back
                                </Text>
                            </View>
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
    button: {
        margin: 10,
        flex: 1,
        borderRadius: 10,
    },
    confirmButtonWrapperDisabled: {
        backgroundColor: "lightgrey",
    },
    confirmButtonText: {
        margin: 10,
        fontSize: 30,
        textAlign: "center",
    },
    confirmButtonTextDisabled: {
        color: "grey",
    },
    buttonWrapper: {
        borderRadius: 10,
    },
    confirmButtonWrapper: {
        backgroundColor: "rgba(125, 196, 232, 1)",
    },
    backButtonWrapper: {
        backgroundColor: "rgba(242, 194, 90, 1)",
    },
});
