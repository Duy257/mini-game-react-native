import React from "react";
import { View, StyleSheet } from "react-native";
import HeadGame from "./MatchingGameTest/HeadGame";
import LineProgressBar from "./MatchingGameTest/LineProgressBar";
import Lives from "./MatchingGameTest/Lives";
import CountBadge from "./MatchingGameTest/CountQuestions";
import ListAnswer from "./MatchingGameTest/ListAnswer";
import { BottomGame } from "./MatchingGameTest/BottomGame";

const MatchingGameTest = () => {
  return (
    <View
      style={{
        backgroundColor: "#F1D1A6",
        alignItems: "center",
        height: "100%",
      }}
    >
      <View style={styles.container}>
        <HeadGame></HeadGame>
        <LineProgressBar progress={50}></LineProgressBar>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Lives></Lives>
          <CountBadge current={7} total={15}></CountBadge>
        </View>
        <View style={{ marginTop: 16 }}>
          <ListAnswer></ListAnswer>
        </View>
        <BottomGame
          resetGame={() => {}}
          backGame={() => {}}
          pauseGame={() => {}}
          volumeGame={() => {}}
        ></BottomGame>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    height: "100%",
    marginHorizontal: 16,
    marginTop: 12,
    alignItems: "center",
  },
});

export default MatchingGameTest;
