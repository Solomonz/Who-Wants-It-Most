import React from "react";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";

export default function RankingButton({ number, onPress }) {
    const buttonColors = {
        1: "rgba(242, 130, 142, 1)",
        2: "rgba(245, 149, 97, 1)",
        3: "rgba(242, 194, 90, 1)",
        4: "rgba(207, 210, 85, 1)",
        5: "rgba(132, 210, 127, 1)",
        6: "rgba(124, 223, 207, 1)",
        7: "rgba(125, 196, 232, 1)",
        8: "rgba(168, 168, 255, 1)",
        9: "rgba(195, 138, 219, 1)",
        10: "rgba(240, 152, 204, 1)",
    };
    const buttonColors2 = {
        1: "hsl(0, 60%, 70%)",
        2: "hsl(36, 60%, 70%)",
        3: "hsl(72, 60%, 70%)",
        4: "hsl(108, 60%, 70%)",
        5: "hsl(144, 60%, 70%)",
        6: "hsl(180, 60%, 70%)",
        7: "hsl(216, 60%, 70%)",
        8: "hsl(252, 60%, 70%)",
        9: "hsl(288, 60%, 70%)",
        10: "hsl(324, 60%, 70%)",
    };
    return (
        <TouchableHighlight
            style={styles.button}
            activeOpacity={0.9}
            onPress={onPress}
            underlayColor="grey"
        >
            <View
                style={[
                    styles.buttonContainer,
                    { backgroundColor: buttonColors[number] },
                ]}
            >
                <Text style={styles.buttonText}>{number}</Text>
            </View>
        </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    button: {
        flex: 1,
        borderRadius: 10,
        margin: 10,
    },
    buttonContainer: {
        justifyContent: "center",
        borderRadius: 10,
        flex: 1,
    },
    buttonText: {
        fontSize: 30,
        textAlign: "center",
    },
});
