import React, { useState, useEffect } from "react";
import { Keyboard, StyleSheet, Text, View } from "react-native";
import RankingButtonColumn from "./RankingButtonColumn";
import RankingDecimalInput from "./RankingDecimalInput";
import RankingConfirmationModal from "./RankingConfirmationModal";

import constants from "../constants.json";

export default function RankingScreen({ route, navigation }) {
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
                    selection: selection,
                }),
            }
        );
        const returnedErrorMessage = await res.json();
        if (res.status == 201) {
            setErrorMessage(null);
            navigation.navigate("SubmissionsScreen", {
                selection: selection,
                ...route.params,
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
                <Text style={[styles.paramText, { fontWeight: "bold" }]}>
                    {route.params.roomCode}
                </Text>
            </View>
            <Text style={styles.infoText}>1 = I don't want it</Text>
            <Text style={styles.infoText}>10 = I want it</Text>
            <RankingDecimalInput
                onConfirm={onPress}
                focused={keyboardVisible}
            />
            {!keyboardVisible && (
                <View style={styles.columnsContainer}>
                    <RankingButtonColumn
                        numbers={[1, 2, 3, 4, 5]}
                        onPress={onPress}
                    />
                    <RankingButtonColumn
                        numbers={[6, 7, 8, 9, 10]}
                        onPress={onPress}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        paddingBottom: 20,
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
    infoText: {
        alignSelf: "center",
        fontSize: 30,
    },
});
