import React from "react";
import { View } from "react-native";
import { Image } from "react-native";

const Lives = ({
  totalLives,
  currentLives,
}: {
  totalLives: number;
  currentLives: number;
}) => {
  return (
    <View style={{ flexDirection: "row" }}>
      {Array.from({ length: totalLives }, (_, i) =>
        i < currentLives ? (
          <Image source={require("../../assets/heart.png")}></Image>
        ) : (
          <Image source={require("../../assets/heart_empty.png")}></Image>
        )
      )}
    </View>
  );
};

export default Lives;
