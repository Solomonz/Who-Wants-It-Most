import React from "react";
import { StyleSheet, View } from "react-native";
import RankingButton from "./RankingButton";

export default function rankingButtonColumn({ numbers, onPress }) {
    return (
        <View style={styles.rankingButtonColumn}>
            {numbers.map((number) => (
                <RankingButton
                    key={number.toString()}
                    number={number}
                    onPress={() => onPress(number)}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    rankingButtonColumn: {
        flexDirection: "column",
        flex: 0.5,
    },
});
