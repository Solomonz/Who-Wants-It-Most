import React from "react";
import {
  Text,
  StyleSheet,
  TouchableHighlight
} from "react-native";

export default function CreateRoom({navigation}) {
  return (
    <>
      <Text>
        Your room code is:
      </Text>
      <Text style={styles.roomCodeText}>
        (some code)
      </Text>
      <TouchableHighlight
        style={styles.okButton}
        onPress={() => navigation.navigate('InputName')}
        underlayColor="orange"
      >
        <Text style={styles.okButtonText}>
          OK
        </Text>
      </TouchableHighlight>
    </>
  );
}

const styles = StyleSheet.create({
  okButton: {
    margin: 10,
    padding: 10,
    borderWidth: 2,
    borderRadius: 1000,
    alignSelf: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)"
  },
  okButtonText: {
    fontSize: 30,
    textAlign: "center",
    color: "red",
  },
  roomCodeText: {
    fontSize: 30,
    textAlign: "center"
  },
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
});
