import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import RankingButtonColumn from "./RankingButtonColumn";
import RankingConfirmationModal from "./RankingConfirmationModal";

import constants from "../constants.json";

export default function RankingScreen({ route, navigation }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [selection, setSelection] = useState(-1);
    const [waitingForSelectionToSend, setWaitingForSelectionToSend] = useState(
        false
    );
    const [errorMessage, setErrorMessage] = useState(null);

    const onPress = (number) => {
        setSelection(number);
        setModalVisible(true);
    };

    const onConfirm = async () => {
        setWaitingForSelectionToSend(true);
        const res = await fetch(
            constants.server_address +
                "/room/" +
                route.params.roomCode +
                "/vote",
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
            navigation.navigate("SubmissionsPage", {
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
    });

    return (
        <>
            <RankingConfirmationModal
                visible={modalVisible}
                dismissModal={() => {
                    setModalVisible(false);
                }}
                selection={selection}
                onConfirm={onConfirm}
            />
            <Text style={styles.infoText}>1 = I don't want it</Text>
            <Text style={styles.infoText}>10 = I want it</Text>
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
        </>
    );
}

const styles = StyleSheet.create({
    columnsContainer: {
        flexDirection: "row",
    },
    infoText: {
        alignSelf: "center",
        fontSize: 30,
    },
});
