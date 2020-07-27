import React from "react";
import { Button, Modal, StyleSheet, Text, View } from "react-native";

export default function RankingConfirmationModal({
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
                    <Text style={styles.modalText}>
                        On a scale of 1 to 10, I want it {selection}
                    </Text>
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
        paddingBottom: 0,
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
        padding: 20,
        alignSelf: "center",
        fontSize: 30,
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
        margin: 10,
        padding: 0,
        flex: 1,
    },
});
