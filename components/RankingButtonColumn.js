import React from "react";
import { FlatList, StyleSheet } from "react-native";
import RankingButton from "./RankingButton";

export default function rankingButtonColumn({ numbers, onPress }) {
    return (
        <FlatList
            style={styles.rankingButtonColumn}
            data={numbers}
            keyExtractor={(item) => item.toString()}
            renderItem={({ item }) => {
                return (
                    <RankingButton
                        number={item}
                        onPress={() => onPress(item)}
                    />
                );
            }}
        />
    );
}

const styles = StyleSheet.create({
    rankingButtonColumn: {
        flexDirection: "column",
    },
});
