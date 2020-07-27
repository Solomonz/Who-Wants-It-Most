import React from "react";
import { Text, StyleSheet, TouchableHighlight } from "react-native";

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
        margin: 10,
        padding: 10,
        borderWidth: 2,
        borderRadius: 10,
        alignSelf: "stretch",
    },
    buttonText: {
        fontSize: 30,
        textAlign: "center",
    },
});
