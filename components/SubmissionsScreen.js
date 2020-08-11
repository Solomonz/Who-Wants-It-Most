import React from "react";
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

import { useSubmissionsScreenState } from "../hooks";

export default function SubmissionsScreen({ route, navigation }) {
    const isVIP = route.params.VIP;
    const roomCode = route.params.roomCode;
    const name = route.params.name;
    const [
        roomState,
        toggleClosed,
        waitingForCloseRequest,
        requestingRoomStateUpdate,
        closingErrorMessage,
        roomStateErrorMessage,
        revealButtonDisabled,
        requestingReveal,
        onReveal,
    ] = useSubmissionsScreenState(route.params, navigation);

    return (
        <View style={styles.container}>
            <View style={styles.paramTextContainer}>
                <Text style={styles.paramText}>{name}</Text>
                <View style={styles.closeComponentContainer}>
                    <Text style={[styles.paramText, styles.roomCodeText]}>
                        {roomCode}
                    </Text>
                    <View style={styles.closeComponentTextContainer}>
                        {isVIP && roomState.state < 2 ? (
                            <>
                                <Text style={styles.closeComponentText}>
                                    Closed:{" "}
                                </Text>
                                {waitingForCloseRequest ? (
                                    <ActivityIndicator size="large" />
                                ) : (
                                    <Switch
                                        onValueChange={toggleClosed}
                                        value={roomState.state !== 0}
                                    />
                                )}
                            </>
                        ) : (
                            <Text
                                style={[
                                    styles.closeComponentText,
                                    styles.closeComponentValueText,
                                ]}
                            >
                                ({roomState.state === 0 ? "OPEN" : "CLOSED"})
                            </Text>
                        )}
                    </View>
                </View>
            </View>
            {requestingRoomStateUpdate && (
                <View style={styles.roomStateUpdateActivityIndicator}>
                    <ActivityIndicator size="large" />
                </View>
            )}
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
                        style={styles.revealButton}
                        onPress={onReveal}
                        underlayColor="grey"
                    >
                        <View
                            style={[
                                styles.revealButtonWrapper,
                                revealButtonDisabled
                                    ? styles.revealButtonWrapperDisabled
                                    : {},
                            ]}
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
                        </View>
                    </TouchableHighlight>
                ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        paddingBottom: 30,
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
    closeComponentValueText: {
        fontWeight: "bold",
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
        borderRadius: 10,
    },
    revealButtonWrapper: {
        borderRadius: 10,
        flexDirection: "row",
        alignSelf: "center",
        backgroundColor: "rgba(168, 168, 255, 1)",
    },
    revealButtonWrapperDisabled: {
        backgroundColor: "lightgrey",
    },
    revealButtonText: {
        flex: 1,
        margin: 10,
        fontSize: 30,
        textAlign: "center",
    },
    revealButtonTextDisabled: {
        color: "grey",
    },
});
