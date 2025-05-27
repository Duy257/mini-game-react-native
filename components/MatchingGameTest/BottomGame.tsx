import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

export const BottomGame = ({ backGame, pauseGame, resetGame, volumeGame }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={backGame}>
        <Image source={require("../../assets/back.png")}></Image>
      </TouchableOpacity>
      <TouchableOpacity style={styles.pause} onPress={pauseGame}>
        <Image source={require("../../assets/pause.png")}></Image>
      </TouchableOpacity>
      <TouchableOpacity style={styles.restart} onPress={resetGame}>
        <Image source={require("../../assets/restart.png")}></Image>
      </TouchableOpacity>
      <TouchableOpacity style={styles.volume} onPress={volumeGame}>
        <Image source={require("../../assets/volume.png")}></Image>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "red",
    height: 65,
    borderRadius: 25,
  },
  back: {
    marginLeft: 12,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  pause: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  restart: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  volume: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
});
