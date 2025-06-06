import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageBackground,
} from "react-native";

const { width, height } = Dimensions.get("window");

interface GameOverModalProps {
  visible: boolean;
  onClose: () => void;
  restartGame: () => void;
  message: string;
  isTimeOut?: boolean;
}

const GameOverModal = ({
  visible,
  onClose,
  restartGame,
  message,
  isTimeOut = false,
}: GameOverModalProps) => {
  const handleRestart = () => {
    // Đóng modal trước
    onClose();
    restartGame();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Hiển thị icon thời gian hoặc icon thua cuộc */}
          <View style={styles.iconContainer}>
            <Image
              source={require("../assets/time-icon.png")}
              style={styles.timeIcon}
            />
            <Text style={styles.timerText}>
              {isTimeOut ? "00s" : "Rất tiếc!"}
            </Text>
          </View>

          {/* Hình ảnh con chim buồn */}
          <View style={styles.birdContainer}>
            <Image
              source={require("../assets/lose-icon.png")}
              style={styles.birdImage}
            />
            <ImageBackground
              source={require("../assets/speech-bubble.png")}
              style={styles.speechBubble}
            >
              <Text style={styles.messageText}>{message}</Text>
            </ImageBackground>
          </View>
          {/* Nút restart */}
          {/* thêm background image cho nút start */}
          <TouchableOpacity
            style={styles.restartButton}
            onPress={handleRestart}
          >
            <Image
              source={require("../assets/restart_button.png")}
              style={styles.restartButton}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.69)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    width: width * 0.93,
    height: height * 0.76,
    backgroundColor: "rgba(112, 90, 64, 0.96)", // Màu nền nâu như trong ảnh
    padding: 20,
    marginBottom: 20,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "space-between",
  },

  iconContainer: {
    alignItems: "center",
    marginTop: 20,
    flexDirection: "row",
  },
  timeIcon: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  sadIcon: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  timerText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
  },
  birdContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginTop: 150,
    marginRight: 120,
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    height: "100%",
  },
  birdImage: {
    resizeMode: "contain",
  },
  speechBubble: {
    position: "absolute",
    top: -100,
    right: -80,
    borderRadius: 20,
    padding: 15,
    width: 210,
    height: 159,
  },
  messageText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    fontWeight: "bold",
    lineHeight: 20,
    maxWidth: 180,
    fontFamily: "BagelFatOne-Regular",
    marginTop: 35,
  },
  restartButton: {
    // backgroundColor: '#8CC63F', // Màu xanh lá như trong ảnh
    width: 230,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  restartText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  rankingContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    minHeight: 50,
  },
  rankingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 5,
  },
  rankUpText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50", // Màu xanh lá cây
    textAlign: "center",
  },
});

export default GameOverModal;
