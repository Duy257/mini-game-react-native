import { Text, View, StyleSheet } from "react-native";

const CardText = ({ text }: { text: string }) => {
  return (
    <View style={styles.wordContainer}>
      <Text style={styles.wordText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wordContainer: {
    margin: 6,
    backgroundColor: "#FCF8E8",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  wordText: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    fontWeight: "bold",
    color: "#112164",
  },
});

export default CardText;
