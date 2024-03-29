import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Text,
    StyleSheet,
    TextInput,
    TouchableHighlight,
    View,
} from "react-native";

import constants from "../constants.json";

export default function JoinRoom({ navigation }) {
    const [joiningRoom, setJoiningRoom] = useState(false);
    const [roomCode, setRoomCode] = useState("");
    const [name, setName] = useState("");
    const [okButtonDisabled, setOkButtonDisabled] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const nameInput = useRef();
    const roomCodeInput = useRef();

    useEffect(() => {
        setOkButtonDisabled(joiningRoom || name == "" || roomCode.length != 4);
    }, [joiningRoom, name, roomCode]);

    const onOkButtonPress = async () => {
        setJoiningRoom(true);
        nameInput.current.blur();
        roomCodeInput.current.blur();

        const res = await fetch(
            constants.server_address + "/room/" + roomCode + "/attend",
            {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    name: name,
                }),
            }
        );
        const returnedErrorMessage = await res.json();
        if (res.status == 201) {
            setErrorMessage(null);
            navigation.navigate("RankingScreen", {
                name: name,
                roomCode: roomCode,
                VIP: false,
            });
        } else {
            setErrorMessage(returnedErrorMessage);
        }
        setJoiningRoom(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.buffer} />
            <Text style={[styles.infoText, styles.roomCodeExplainingText]}>
                Enter Room Code
            </Text>
            <View style={styles.inputContainer}>
                <TextInput
                    ref={roomCodeInput}
                    autoCapitalize="characters"
                    autoCompleteType="off"
                    autoCorrect={false}
                    maxLength={4}
                    textAlign="center"
                    value={roomCode}
                    onChangeText={setRoomCode}
                    style={styles.textInput}
                />
            </View>
            <Text style={[styles.infoText, styles.nameText]}>Your Name</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    ref={nameInput}
                    autoCapitalize="characters"
                    autoCompleteType="off"
                    autoCorrect={false}
                    maxLength={15}
                    textAlign="center"
                    value={name}
                    onChangeText={setName}
                    style={styles.textInput}
                />
            </View>
            {errorMessage != null && (
                <Text style={styles.errorMessage}>{errorMessage}</Text>
            )}
            {joiningRoom ? (
                <ActivityIndicator size="large" />
            ) : (
                <TouchableHighlight
                    disabled={okButtonDisabled}
                    style={
                        okButtonDisabled
                            ? [styles.okButton, styles.okButtonDisabled]
                            : styles.okButton
                    }
                    onPress={onOkButtonPress}
                    underlayColor="orange"
                >
                    <Text
                        style={
                            okButtonDisabled
                                ? [
                                      styles.okButtonText,
                                      styles.okButtonTextDisabled,
                                  ]
                                : styles.okButtonText
                        }
                    >
                        OK
                    </Text>
                </TouchableHighlight>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
    buffer: {
        flex: 0.2,
    },
    infoText: {
        fontSize: 30,
    },
    roomCodeExplainingText: {
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: "row",
    },
    errorMessage: {
        fontSize: 20,
        color: "red",
    },
    nameText: {
        marginTop: 30,
    },
    textInput: {
        flex: 1,
        borderWidth: 2,
        fontSize: 20,
        margin: 20,
        borderRadius: 5,
        padding: 5,
    },
    okButton: {
        margin: 10,
        padding: 10,
        borderWidth: 2,
        borderRadius: 1000,
        alignSelf: "center",
    },
    okButtonDisabled: {
        backgroundColor: "lightgrey",
    },
    okButtonText: {
        fontSize: 30,
        textAlign: "center",
        color: "red",
    },
    okButtonTextDisabled: {
        color: "grey",
    },
});
