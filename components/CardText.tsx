import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const CardText = ({ text }: { text: string }) => {
  return (
    <View style={[styles.card]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    minWidth: 50,
    minHeight: 40,
    backgroundColor: "#FCF8E8",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    padding: 8,
    fontSize: 16,
    fontWeight: "bold",
    color: "#112164",
  },
});
