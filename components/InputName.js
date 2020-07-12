import React, {useState, useRef} from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} from "react-native";

export default function InputName({route, navigation}) {
  const {name, setName} = useState("");
  const input = useRef();
  return (
    <View style={styles.container}>
      <Text>
        Your Name
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          ref={input}
          value={name}
          onChangeText={setName}
          style={styles.nameTextInput} 
        />
      </View>
      <TouchableHighlight
        style={styles.okButton}
        onPress={() => {
          input.current.blur();
          // TODO: navigate to Ranking Selection screen
          // navigation.navigate('');
        }}
        underlayColor="orange"
      >
        <Text style={styles.okButtonText}>
          OK
        </Text>
      </TouchableHighlight>
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
  nameTextInput: {
    flex: 1,
    borderWidth: 2,
    fontSize: 20,
    margin: 20,
    borderRadius: 5,
    padding: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
});
