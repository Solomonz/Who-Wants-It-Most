import React, { useState, useEffect } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

import { useClosingState } from "../hooks";
import constants from "../constants.json";

export default function SubmissionsPage({ route, navigation }) {
    const [
        closed,
        toggleClosed,
        waitingForCloseRequest,
        closingErrorMessage,
    ] = useClosingState(route.params.roomCode);
    const [errorMessage, setErrorMessage] = useState(null);
    const isVIP = route.params.VIP;

    useEffect(() => {
        navigation.addListener("beforeRemove", (event) => {
            fetch(
                constants.server_address +
                    "/room/" +
                    route.params.roomCode +
                    "/vote",
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
            <View style={styles.paramTextContainer}>
                <Text style={styles.paramText}>{route.params.name}</Text>
                <View style={styles.closeComponentContainer}>
                    <Text style={[styles.paramText, styles.roomCodeText]}>
                        {route.params.roomCode}
                    </Text>
                    {isVIP && (
                        <View style={styles.closeComponentTextContainer}>
                            <Text style={styles.closeComponentText}>
                                Closed:{" "}
                            </Text>
                            <Switch
                                onValueChange={toggleClosed}
                                value={closed}
                            />
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    paramTextContainer: {
        padding: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    closeComponentContainer: {
        flexDirection: "column",
    },
    closeComponentTextContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    closeComponentText: {
        fontSize: 14,
    },
    paramText: {
        fontSize: 30,
    },
    roomCodeText: {
        fontWeight: "bold",
        textAlign: "center",
        textAlignVertical: "center",
    },
});
