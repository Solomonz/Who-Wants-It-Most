import React from "react";
import { StyleSheet, Text, TouchableHighlight } from "react-native";

export default function RankingButton({ number, onPress }) {
    return (
        <TouchableHighlight
            style={styles.button}
            onPress={onPress}
            underlayColor="orange"
        >
            <Text style={styles.buttonText}>{number}</Text>
        </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    button: {
        justifyContent: "center",
        flex: 1,
        margin: 10,
        borderWidth: 2,
        borderRadius: 10,
    },
    buttonText: {
        fontSize: 30,
        textAlign: "center",
    },
});
