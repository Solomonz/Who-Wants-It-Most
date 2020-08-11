import React from "react";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";

export default function ResultsScreen({ route, navigation }) {
    return (
        <View style={styles.container}>
            <View style={styles.paramTextContainer}>
                <Text style={styles.paramText}>{route.params.name}</Text>
                <Text style={[styles.paramText, styles.roomCodeText]}>
                    {route.params.roomCode}
                </Text>
            </View>
            <View style={styles.resultsTextContainer}>
                <View style={styles.winnerTextContainer}>
                    <Text style={styles.winnerText}>{route.params.winner}</Text>
                </View>
                <View style={styles.wantsItMostTextContainer}>
                    <Text style={styles.wantsItMostText}>wants it most!</Text>
                </View>
            </View>
            <View style={styles.goBackContainer}>
                <TouchableHighlight
                    style={styles.goBackButton}
                    onPress={() => {
                        navigation.popToTop();
                    }}
                    underlayColor="grey"
                >
                    <View style={styles.goBackWrapper}>
                        <Text style={styles.goBackText}>START AGAIN</Text>
                    </View>
                </TouchableHighlight>
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
    paramText: {
        fontSize: 30,
    },
    roomCodeText: {
        fontWeight: "bold",
    },
    resultsTextContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    winnerTextContainer: {
        margin: 10,
        padding: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        backgroundColor: "rgba(125, 196, 232, 1)",
    },
    winnerText: {
        flex: 1,
        textAlign: "center",
        fontSize: 30,
        fontWeight: "bold",
    },
    wantsItMostTextContainer: {},
    wantsItMostText: {
        fontSize: 25,
    },
    goBackContainer: {
        flexDirection: "row",
        marginBottom: 20,
    },
    goBackButton: {
        flex: 1,
        margin: 10,
        borderRadius: 10,
    },
    goBackWrapper: {
        borderRadius: 10,
        backgroundColor: "lightgrey",
    },
    goBackText: {
        fontSize: 30,
        margin: 10,
        textAlign: "center",
    },
});
