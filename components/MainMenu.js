import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight
} from "react-native";

export default function MainMenu({navigation}) {
  return (
    <View style={styles.container}>
      <Text>
        Who Wants It Most?
      </Text>
      <TouchableHighlight
        style={styles.button}
        onPress={() => navigation.navigate('CreateRoom')}
        underlayColor="orange"
      >
        <Text style={styles.buttonText}>
          CREATE ROOM
        </Text>
      </TouchableHighlight>
      <TouchableHighlight
        style={styles.button}
        onPress={() => navigation.navigate('JoinRoom')}
        underlayColor="orange"
      >
        <Text style={styles.buttonText}>
          JOIN ROOM
        </Text>
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
  button: {
    margin: 10,
    padding: 10,
    borderWidth: 2,
    borderRadius: 10,
    alignSelf: "stretch",
    backgroundColor: "rgba(255, 255, 255, 0.8)"
  },
  buttonText: {
    fontSize: 30,
    textAlign: "center"
  },
});
