import { Text, View, StyleSheet } from "react-native";

export const CardTitleGame = () => {
  return (
    <View style={styles.header}>
      <View style={styles.instruction}>
        <Text style={styles.wordText}>🔊 Tôi ăn sáng lúc 7 giờ</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  instruction: {
    backgroundColor: "#FCF8E8",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  wordText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
    textAlign: "center",
  },
});
