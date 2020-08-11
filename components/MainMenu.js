import React from "react";
import { Text, View, StyleSheet, TouchableHighlight } from "react-native";

export default function MainMenu({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Who Wants It Most?</Text>
            <TouchableHighlight
                activeOpacity={0.7}
                style={styles.button}
                onPress={() => navigation.navigate("CreateRoom")}
                underlayColor="grey"
            >
                <View
                    style={[
                        styles.buttonTextWrapper,
                        styles.createButtonTextWrapper,
                    ]}
                >
                    <Text style={styles.buttonText}>CREATE ROOM</Text>
                </View>
            </TouchableHighlight>
            <TouchableHighlight
                activeOpacity={0.7}
                style={styles.button}
                onPress={() => navigation.navigate("JoinRoom")}
                underlayColor="grey"
            >
                <View
                    style={[
                        styles.buttonTextWrapper,
                        styles.joinButtonTextWrapper,
                    ]}
                >
                    <Text style={styles.buttonText}>JOIN ROOM</Text>
                </View>
            </TouchableHighlight>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: 25,
    },
    button: {
        borderRadius: 10,
        margin: 10,
        alignSelf: "stretch",
    },
    buttonTextWrapper: {
        padding: 10,
        borderRadius: 10,
    },
    createButtonTextWrapper: {
        backgroundColor: "rgba(242, 194, 90, 1)",
    },
    joinButtonTextWrapper: {
        backgroundColor: "rgba(124, 223, 207, 1)",
    },
    buttonText: {
        fontSize: 30,
        textAlign: "center",
    },
});
