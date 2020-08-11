import React from "react";
import MainMenu from "./components/MainMenu";
import CreateRoom from "./components/CreateRoom";
import JoinRoom from "./components/JoinRoom";
import RankingScreen from "./components/RankingScreen";
import SubmissionsScreen from "./components/SubmissionsScreen";
import ResultsScreen from "./components/ResultsScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const { Navigator, Screen } = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Navigator>
                <Screen
                    name="Home"
                    options={{ title: "Who Wants It Most?" }}
                    component={MainMenu}
                />
                <Screen
                    name="CreateRoom"
                    options={{ title: "Create a new room" }}
                    component={CreateRoom}
                />
                <Screen
                    name="JoinRoom"
                    options={{ title: "Join an existing room" }}
                    component={JoinRoom}
                />
                <Screen
                    name="RankingScreen"
                    options={{ title: "How much do you want it?" }}
                    component={RankingScreen}
                />
                <Screen
                    name="SubmissionsScreen"
                    options={{ title: "Submissions" }}
                    component={SubmissionsScreen}
                />
                <Screen
                    name="ResultsScreen"
                    options={{
                        title: "Results",
                        headerLeft: () => null,
                    }}
                    component={ResultsScreen}
                />
            </Navigator>
        </NavigationContainer>
    );
}
