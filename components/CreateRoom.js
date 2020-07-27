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

export default function CreateRoom({ navigation }) {
    const [requestingRoomCode, setRequestingRoomCode] = useState(true);
    const [joiningRoom, setJoiningRoom] = useState(false);
    const [roomCode, setRoomCode] = useState("");
    const [name, setName] = useState("");
    const [okButtonDisabled, setOkButtonDisabled] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const input = useRef();

    useEffect(() => {
        setOkButtonDisabled(requestingRoomCode || joiningRoom || name == "");
    }, [requestingRoomCode, joiningRoom, name]);

    const getRoomCode = async () => {
        const res = await fetch(constants.server_address + "/room", {
            method: "POST",
        });
        const roomCode = await res.json();
        setRoomCode(roomCode);
        navigation.addListener("beforeRemove", (event) => {
            fetch(constants.server_address + "/room/" + roomCode + "/delete", {
                method: "DELETE",
            });
        });
        setRequestingRoomCode(false);
    };

    useEffect(() => {
        getRoomCode();
    }, []);

    const onOkButtonPress = async () => {
        setJoiningRoom(true);
        input.current.blur();

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
                VIP: true,
            });
        } else {
            setErrorMessage(returnedErrorMessage);
        }
        setJoiningRoom(false);
    };

    return (
        <View style={styles.container}>
            <Text>Your room code is:</Text>
            {requestingRoomCode ? (
                <ActivityIndicator size="large" />
            ) : (
                <Text style={styles.roomCodeText}>{roomCode}</Text>
            )}
            <Text>Your Name</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    ref={input}
                    value={name}
                    onChangeText={setName}
                    style={styles.nameTextInput}
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
        alignItems: "center",
    },
    inputContainer: {
        flexDirection: "row",
    },
    errorMessage: {
        fontSize: 20,
        color: "red",
    },
    nameTextInput: {
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
    roomCodeText: {
        fontSize: 30,
        textAlign: "center",
    },
});
