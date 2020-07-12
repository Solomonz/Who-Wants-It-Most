import React from "react";
import MainMenu from "./components/MainMenu";
import CreateRoom from "./components/CreateRoom";
import JoinRoom from "./components/JoinRoom";
import InputName from "./components/InputName";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const { Navigator, Screen } = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Navigator>
        <Screen name="Home" options={{title: "Who Wants It Most?"}} component={MainMenu} />
        <Screen name="CreateRoom" options={{title: "Create a new room"}} component={CreateRoom} />
        <Screen name="JoinRoom" options={{title: "Join an existing room"}} component={JoinRoom} />
        <Screen name="InputName" options={{title: "Input your name"}} component={InputName} />
      </Navigator>
    </NavigationContainer>
  );
}
