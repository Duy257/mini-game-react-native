import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import HeadGame from "../components/sakutimban/HeadGame";
import LineProgressBar from "../components/sakutimban/LineProgressBar";
import Lives from "../components/sakutimban/Lives";
import CountBadge from "../components/sakutimban/CountQuestions";
import ListAnswer from "../components/sakutimban/ListAnswer";
import { BottomGame } from "../components/sakutimban/BottomGame";
import { useDispatch } from "react-redux";
import { reset } from "../redux/slices/MatchingGameSlice";
import { useSelector } from "react-redux";

const MatchingGame = () => {
  const { questionDone, totalQuestion } = useSelector(
    (state: any) => state.MatchingGame
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(reset());
  }, []);

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
        <LineProgressBar
          progress={(questionDone / totalQuestion) * 100}
        ></LineProgressBar>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Lives></Lives>
          <CountBadge current={questionDone} total={totalQuestion}></CountBadge>
        </View>
        <View style={{ marginTop: 16 }}>
          <ListAnswer></ListAnswer>
        </View>
        <View style={{ position: "absolute", bottom: 20 }}>
          <BottomGame
            resetGame={() => dispatch(reset())}
            backGame={() => {}}
            pauseGame={() => {}}
            volumeGame={() => {}}
          ></BottomGame>
        </View>
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

export default MatchingGame;
