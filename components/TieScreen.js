import React, { useState, useEffect } from "react";
import { Keyboard, StyleSheet, Text, View } from "react-native";
import RankingDecimalInput from "./RankingDecimalInput";
import RankingConfirmationModal from "./RankingConfirmationModal";

import constants from "../constants.json";

export default function TieScreen({ route, navigation }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [selection, setSelection] = useState(-1);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [waitingForSelectionToSend, setWaitingForSelectionToSend] = useState(
        false
    );
    const [errorMessage, setErrorMessage] = useState(null);

    const onPress = (number) => {
        setSelection(number);
        setModalVisible(true);
    };

    const _keyboardShowing = () => setKeyboardVisible(true);
    const _keyboardHiding = () => setKeyboardVisible(false);

    useEffect(() => {
        Keyboard.addListener("keyboardWillShow", _keyboardShowing);
        Keyboard.addListener("keyboardWillHide", _keyboardHiding);
        Keyboard.addListener("keyboardDidShow", _keyboardShowing);
        Keyboard.addListener("keyboardDidHide", _keyboardHiding);

        return () => {
            Keyboard.removeListener("keyboardWillShow", _keyboardShowing);
            Keyboard.removeListener("keyboardWillHide", _keyboardHiding);
            Keyboard.removeListener("keyboardDidShow", _keyboardShowing);
            Keyboard.removeListener("keyboardDidHide", _keyboardHiding);
        };
    }, []);

    const onConfirm = async () => {
        setWaitingForSelectionToSend(true);
        const res = await fetch(
            constants.server_address +
                "/room/" +
                route.params.roomCode +
                "/vote/" +
                route.params.name,
            {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    name: route.params.name,
                    selection: selection,
                }),
            }
        );
        const returnedErrorMessage = await res.json();
        if (res.status == 201) {
            setErrorMessage(null);
            navigation.navigate("SubmissionsScreen", {
                ...route.params,
                selection: selection,
            });
            setModalVisible(false);
        } else {
            setErrorMessage(returnedErrorMessage);
        }
        setWaitingForSelectionToSend(false);
    };

    useEffect(() => {
        navigation.addListener("beforeRemove", (event) => {
            fetch(
                constants.server_address +
                    "/room/" +
                    route.params.roomCode +
                    "/attend",
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "DELETE",
                    body: JSON.stringify({
                        name: route.params.name,
                    }),
                }
            );
        });
    }, []);

    const lowerBound = +route.params.selection - 0.25;
    const upperBound = +route.params.selection + 0.25;

    return (
        <View style={styles.container}>
            <RankingConfirmationModal
                waitingForSelectionToSend={waitingForSelectionToSend}
                errorMessage={errorMessage}
                visible={modalVisible}
                dismissModal={() => {
                    setModalVisible(false);
                    setErrorMessage(null);
                }}
                selection={selection}
                onConfirm={onConfirm}
            />
            <View style={styles.paramTextContainer}>
                <Text style={styles.paramText}>{route.params.name}</Text>
                <Text style={[styles.paramText, styles.roomCodeText]}>
                    {route.params.roomCode}
                </Text>
            </View>
            <Text style={styles.infoText}>
                It's a tie! Enter a number between
            </Text>
            <Text style={styles.infoText}>
                <Text style={styles.boundaryText}>
                    {+route.params.selection - 0.25}
                </Text>{" "}
                and{" "}
                <Text style={styles.boundaryText}>
                    {+route.params.selection + 0.25}
                </Text>
            </Text>
            <RankingDecimalInput
                onConfirm={onPress}
                focused={keyboardVisible}
                tieParams={{ lowerBound: lowerBound, upperBound: upperBound }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    columnsContainer: {
        flexDirection: "row",
        flex: 1,
    },
    paramTextContainer: {
        padding: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    paramText: {
        fontSize: 30,
    },
    roomCodeText: {
        fontWeight: "bold",
    },
    boundaryText: {
        fontWeight: "bold",
    },
    infoText: {
        alignSelf: "center",
        fontSize: 25,
    },
});
