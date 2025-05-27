import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const HeadGame = ({ isShowSuggest = false }) => {
  return (
    <View style={styles.container}>
      <View style={styles.gem}>
        <View
          style={{
            position: "absolute",
            zIndex: 1,
            top: 0,
            left: 0,
            transform: [{ translateX: -10 }, { translateY: -3 }],
            alignItems: "center",
            justifyContent: "center",
            width: 25,
            height: 25,
          }}
        >
          <Image source={require("../../assets/gem.png")}></Image>
        </View>
        <Text style={{ fontSize: 12 }}>300</Text>
      </View>
      <View style={styles.cup}>
        <Image source={require("../../assets/cup.png")}></Image>
        <Text style={{ fontSize: 12, color: "white", fontWeight: "bold" }}>
          Xếp hạng
        </Text>
      </View>
      {isShowSuggest && (
        <View style={styles.cup}>
          <Image source={require("../../assets/suggest.png")}></Image>
          <Text style={{ fontSize: 12, color: "white", fontWeight: "bold" }}>
            Gợi ý
          </Text>
        </View>
      )}
      <View style={styles.time}>
        <Image source={require("../../assets/lightning.png")}></Image>
        <Text
          style={{
            fontSize: 15,
            color: "white",
            fontWeight: "bold",
            marginLeft: 5,
          }}
        >
          610s
        </Text>
      </View>
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
    height: 50,
    borderRadius: 25,
  },
  gem: {
    position: "relative",
    backgroundColor: "white",
    width: 52,
    marginLeft: 24,
    height: 18,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  cup: {
    width: 60,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
  },
  time: {
    flexDirection: "row",
    marginRight: 12,
    width: 62,
    height: 25,
    borderRadius: 25,
  },
});

export default HeadGame;
