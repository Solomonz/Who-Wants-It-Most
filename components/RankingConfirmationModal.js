import React from "react";
import {
    ActivityIndicator,
    Button,
    Modal,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function RankingConfirmationModal({
    waitingForSelectionToSend,
    errorMessage,
    visible,
    dismissModal,
    selection,
    onConfirm,
}) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={dismissModal}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    {waitingForSelectionToSend && (
                        <ActivityIndicator size="large" />
                    )}
                    <Text style={styles.modalText}>
                        On a scale of 1 to 10, I want it {selection}
                    </Text>
                    {errorMessage != null && (
                        <Text style={styles.errorMessage}>{errorMessage}</Text>
                    )}
                    <View style={styles.optionsArea}>
                        <View style={styles.buttonView}>
                            <Button
                                style={styles.optionButton}
                                onPress={dismissModal}
                                title="Actually..."
                            />
                        </View>
                        {/* <View style={{flex: 1}} /> */}
                        <View style={styles.buttonView}>
                            <Button
                                style={styles.optionButton}
                                onPress={onConfirm}
                                title="That's right!"
                            />
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalText: {
        alignSelf: "center",
        fontSize: 30,
    },
    errorMessage: {
        fontSize: 20,
        color: "red",
    },
    optionsArea: {
        flexDirection: "row",
        marginTop: 10,
        margin: 0,
        padding: 0,
    },
    buttonView: {
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        flex: 1,
    },
});
