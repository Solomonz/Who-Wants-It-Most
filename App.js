import React from "react";
import MainMenu from "./components/MainMenu";
import CreateRoom from "./components/CreateRoom";
import JoinRoom from "./components/JoinRoom";
import RankingScreen from "./components/RankingScreen";
import SubmissionsPage from "./components/SubmissionsPage";
import ResultsPage from "./components/ResultsPage";
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
                    name="SubmissionsPage"
                    options={{ title: "Submissions Page" }}
                    component={SubmissionsPage}
                />
                <Screen
                    name="ResultsPage"
                    options={{ title: "Results Page" }}
                    component={ResultsPage}
                />
            </Navigator>
        </NavigationContainer>
    );
}
