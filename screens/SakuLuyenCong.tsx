import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import {
  PanGestureHandler,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { BottomGame } from "../components/sakutimban/BottomGame";
import HeadGame from "../components/sakutimban/HeadGame";
import LineProgressBar from "../components/sakutimban/LineProgressBar";
import Lives from "../components/sakutimban/Lives";
import CountBadge from "../components/sakutimban/CountQuestions";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const SakuLuyenCong = () => {
  const [wordsInDropZone, setWordsInDropZone] = useState([]);
  const [isError, setIsError] = useState(false);
  const [availableWords, setAvailableWords] = useState([
    { id: 1, text: "I", isInDropZone: false },
    { id: 2, text: "eat", isInDropZone: false },
    { id: 3, text: "breakfast", isInDropZone: false },
    { id: 4, text: "at", isInDropZone: false },
    { id: 5, text: "7", isInDropZone: false },
    { id: 6, text: "o'clock", isInDropZone: false },
  ]);

  const [dropZoneLayout, setDropZoneLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 120,
  });

  const dropZoneRef = useRef(null);

  const DraggableWord = ({ word }) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const scale = useSharedValue(1);
    const zIndex = useSharedValue(0);

    const addWordToDropZone = (wordToAdd: { id: number; text: string }) => {
      setWordsInDropZone((prev) => {
        if (!prev.find((w) => w.id === wordToAdd.id)) {
          return [...prev, wordToAdd];
        }
        return prev;
      });
    };

    const gestureHandler = useAnimatedGestureHandler({
      onStart: () => {
        scale.value = withSpring(1.1);
        zIndex.value = 1000;
      },
      onActive: (event) => {
        translateX.value = event.translationX;
        translateY.value = event.translationY;
      },
      onEnd: (event) => {
        const dropZoneTop = dropZoneLayout.y;
        const dropZoneBottom = dropZoneLayout.y + dropZoneLayout.height;
        const wordY = event.absoluteY;

        // Check if word is dropped in drop zone
        if (
          wordY >= dropZoneTop &&
          wordY <= dropZoneBottom &&
          event.absoluteX >= 20 &&
          event.absoluteX <= SCREEN_WIDTH - 20
        ) {
          runOnJS(addWordToDropZone)(word);
        }

        // Reset position and scale
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        scale.value = withSpring(1);
        zIndex.value = 0;
      },
    });

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
      zIndex: zIndex.value,
    }));

    // Don't render if word is already in drop zone
    if (wordsInDropZone.find((w) => w.id === word.id)) {
      return null;
    }

    return (
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.wordContainer, animatedStyle]}>
          <Text style={styles.wordText}>{word.text}</Text>
        </Animated.View>
      </PanGestureHandler>
    );
  };

  const removeWordFromDropZone = (wordId: number) => {
    setWordsInDropZone((prev) => prev.filter((w) => w.id !== wordId));
  };

  const renderWordsInDropZone = () => {
    return wordsInDropZone.map((word, index) => (
      <TouchableOpacity
        key={word.id}
        style={styles.wordContainer}
        onPress={() => removeWordFromDropZone(word.id)}
      >
        <Text style={styles.wordText}>{word.text}</Text>
      </TouchableOpacity>
    ));
  };

  const resetGame = () => {
    setAvailableWords([
      { id: 1, text: "I", isInDropZone: false },
      { id: 2, text: "eat", isInDropZone: false },
      { id: 3, text: "breakfast", isInDropZone: false },
      { id: 4, text: "at", isInDropZone: false },
      { id: 5, text: "7", isInDropZone: false },
      { id: 6, text: "o'clock", isInDropZone: false },
    ]);
    setIsError(false);
    setWordsInDropZone([]);
  };

  const checkAnswer = () => {
    const sentence = wordsInDropZone
      .sort((a, b) => a.position - b.position)
      .map((w) => w.text)
      .join(" ");
    if (sentence !== "I eat breakfast at 7 o'clock") {
      setIsError(true);
    } else {
      setIsError(false);
    }

    Alert.alert("Câu trả lời", sentence || "Chưa có từ nào trong khung!");
  };

  return (
    <GestureHandlerRootView>
      <ImageBackground
        style={{ flex: 1 }}
        source={require("../assets/background.png")}
        resizeMode="cover"
      >
        <View style={{ flex: 1, marginVertical: 16, marginHorizontal: 12 }}>
          {/* Header */}
          <HeadGame />
          <LineProgressBar progress={50}></LineProgressBar>
          <View
            style={{
              width: "100%",
              marginBottom: 16,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Lives></Lives>
            <CountBadge current={7} total={15}></CountBadge>
          </View>

          {/* title question */}
          <View style={styles.header}>
            <View style={styles.instruction}>
              <Text style={styles.wordText}>🔊 Tôi ăn sáng lúc 7 giờ</Text>
            </View>
          </View>

          {/* Drop Zone */}
          <View
            style={styles.dropZone}
            ref={dropZoneRef}
            onLayout={(event) => {
              console.log(event.nativeEvent.layout);

              const { x, y, width, height } = event.nativeEvent.layout;
              setDropZoneLayout({ x, y: y + 40, width, height });
            }}
          >
            <View style={styles.dropZoneContent}>
              {renderWordsInDropZone()}
            </View>
            {wordsInDropZone.length === 0 && (
              <Text style={styles.dropZoneHint}>Kéo các từ vào đây</Text>
            )}
            {isError && (
              <View
                style={{ alignItems: "flex-start", justifyContent: "flex-end" }}
              >
                <Text style={styles.errorText}>
                  Đáp án sai rồi, hãy thử lại
                </Text>
              </View>
            )}
          </View>

          {/* Check Answer Button */}
          <TouchableOpacity style={styles.checkButton} onPress={checkAnswer}>
            <Text style={styles.checkButtonText}>Kiểm tra đáp án</Text>
          </TouchableOpacity>

          {/* Available Words */}
          <View style={styles.wordsContainer}>
            {availableWords.map((word) => (
              <DraggableWord key={word.id} word={word} />
            ))}
          </View>

          {/* Control Buttons */}
          <View style={{ position: "absolute", bottom: 0, left: 0 }}>
            <BottomGame
              resetGame={() => resetGame()}
              backGame={() => {}}
              pauseGame={() => {}}
              volumeGame={() => {}}
            />
          </View>
        </View>
      </ImageBackground>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  gameInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },
  lives: {
    fontSize: 16,
  },
  score: {
    backgroundColor: "#4CAF50",
    color: "white",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "bold",
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
  dropZone: {
    backgroundColor: "white",
    borderRadius: 10,
    minHeight: 80,
    marginBottom: 20,
    padding: 15,
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
  },
  dropZoneContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  dropZoneHint: {
    color: "#999",
    textAlign: "center",
    fontSize: 14,
    fontStyle: "italic",
    marginTop: 10,
  },
  checkButton: {
    backgroundColor: "#D32F2F",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignSelf: "center",
    marginBottom: 30,
  },
  checkButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  wordsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 30,
  },
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
  controlButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  controlButton: {
    backgroundColor: "#FF6B35",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  controlButtonText: {
    fontSize: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
    fontStyle: "italic",
  },
});
