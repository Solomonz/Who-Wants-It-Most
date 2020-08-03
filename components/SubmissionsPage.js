import React, { useEffect } from "react";
import {
    ActivityIndicator,
    SectionList,
    StyleSheet,
    Switch,
    Text,
    TouchableHighlight,
    View,
} from "react-native";
import { DefaultTheme } from "@react-navigation/native";

import { useSubmissionsPageState } from "../hooks";
import constants from "../constants.json";

export default function SubmissionsPage({ route, navigation }) {
    const isVIP = route.params.VIP;
    const roomCode = route.params.roomCode;
    const name = route.params.name;
    const [
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
    ] = useSubmissionsPageState(route.params, navigation);

    useEffect(() => {
        console.log(roomState);
    }, [roomState]);

    useEffect(() => {
        requestRoomStateUpdate();
        const timerId = setInterval(requestRoomStateUpdate, 5000);
        navigation.addListener("beforeRemove", () => {
            fetch(constants.server_address + "/room/" + roomCode + "/vote", {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "DELETE",
                body: JSON.stringify({
                    name: name,
                }),
            });
            clearInterval(timerId);
        });
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.paramTextContainer}>
                <Text style={styles.paramText}>{name}</Text>
                <View style={styles.closeComponentContainer}>
                    <Text style={[styles.paramText, styles.roomCodeText]}>
                        {roomCode}
                    </Text>
                    <View style={styles.closeComponentTextContainer}>
                        {isVIP ? (
                            <>
                                <Text style={styles.closeComponentText}>
                                    Closed:{" "}
                                </Text>
                                {waitingForCloseRequest ? (
                                    <ActivityIndicator size="large" />
                                ) : (
                                    <Switch
                                        onValueChange={toggleClosed}
                                        value={roomState.closed}
                                    />
                                )}
                            </>
                        ) : (
                            <Text
                                style={[
                                    styles.closeComponentText,
                                    { fontWeight: "bold" },
                                ]}
                            >
                                ({roomState.closed ? "CLOSED" : "OPEN"})
                            </Text>
                        )}
                    </View>
                </View>
            </View>
            <SectionList
                style={styles.votesStatus}
                keyExtractor={(item, index) => item + index}
                sections={roomState.sectionData}
                renderItem={({ item, section }) => (
                    <Text
                        style={[
                            styles.voterText,
                            section.title == "VOTED"
                                ? styles.votedText
                                : styles.stillWaitingText,
                        ]}
                    >
                        {item}
                    </Text>
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <View style={styles.columnNameContainer}>
                        <Text style={styles.columnNameText}>{title}</Text>
                    </View>
                )}
            />
            {isVIP &&
                (requestingReveal ? (
                    <ActivityIndicator size="large" />
                ) : (
                    <TouchableHighlight
                        disabled={revealButtonDisabled}
                        style={
                            revealButtonDisabled
                                ? [
                                      styles.revealButton,
                                      styles.revealButtonDisabled,
                                  ]
                                : styles.revealButton
                        }
                        onPress={onReveal}
                        underlayColor="orange"
                    >
                        <Text
                            style={
                                revealButtonDisabled
                                    ? [
                                          styles.revealButtonText,
                                          styles.revealButtonTextDisabled,
                                      ]
                                    : styles.revealButtonText
                            }
                        >
                            Who Wants It Most?
                        </Text>
                    </TouchableHighlight>
                ))}
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
        textAlign: "center",
    },
    paramText: {
        fontSize: 30,
    },
    roomCodeText: {
        fontWeight: "bold",
        textAlign: "right",
        textAlignVertical: "center",
    },
    votesStatus: {
        flex: 1,
        padding: 10,
    },
    votesStatusColumn: {
        flex: 1,
        flexDirection: "column",
        padding: 10,
    },
    columnNameContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    columnNameText: {
        flex: 1,
        fontSize: 40,
        backgroundColor: DefaultTheme.colors.background,
    },
    voterTextWrapper: {
        flexDirection: "row",
    },
    voterText: {
        fontSize: 18,
    },
    votedText: {
        color: "green",
    },
    stillWaitingText: {
        color: "red",
    },
    revealButton: {
        margin: 10,
        padding: 10,
        borderWidth: 2,
        borderRadius: 5,
        flexDirection: "row",
        alignSelf: "center",
    },
    revealButtonDisabled: {
        backgroundColor: "lightgrey",
    },
    revealButtonText: {
        flex: 1,
        fontSize: 30,
        textAlign: "center",
        color: "blue",
    },
    revealButtonTextDisabled: {
        color: "grey",
    },
});
