import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import HeadGame from "./MatchingGameTest/HeadGame";
import LineProgressBar from "./MatchingGameTest/LineProgressBar";
import { CardTitleGame } from "../modules/game/CardTitleGame";
import { CardText } from "../componentTest/CardText";

interface Word {
  id: string;
  text: string;
}

const WordDragDropGame = () => {
  // Dữ liệu game
  const sentence = [
    { id: "1", text: "Tôi" },
    { id: "2", text: "..." },
    { id: "3", text: "sáng" },
    { id: "4", text: "..." },
    { id: "5", text: "7" },
    { id: "6", text: "giờ" },
  ];
  const availableWords = [
    { id: "12", text: "ăn" },
    { id: "22", text: "lúc" },
  ];
  const correctAnswers = ["2", "4"]; // Id của các ô cần điền

  // State quản lý game
  const [sentenceState, setSentenceState] = useState([...sentence]);
  const [wordsState, setWordsState] = useState([...availableWords]);
  const [dropZones, setDropZones] = useState([]);

  // Hàm xử lý khi thả từ
  const handleDrop = (dropZoneId: string, word: Word) => {
    // Update the sentence
    const newSentence = [...sentenceState];
    const dropZoneIndex = newSentence.findIndex((w) => w.id === dropZoneId);
    if (dropZoneIndex >= 0) {
      newSentence[dropZoneIndex] = { id: dropZoneId, text: word.text };
      setSentenceState(newSentence);

      // Remove the word from the available words list
      const newWords = [...wordsState];
      const wordIndex = newWords.findIndex((w) => w.id === word.id);
      if (wordIndex >= 0) {
        newWords.splice(wordIndex, 1);
        setWordsState(newWords);
      }
    }
  };

  const handleWordClick = (dropZoneId: string) => {
    // Tìm từ trong danh sách từ có sẵn
    const word = wordsState[0]; // Lấy từ đầu tiên trong danh sách
    if (!word) return;

    // Update câu
    const newSentence = [...sentenceState];
    const dropZoneIndex = newSentence.findIndex((w) => w.id === dropZoneId);
    if (dropZoneIndex >= 0) {
      newSentence[dropZoneIndex] = { id: dropZoneId, text: "..." };
      setSentenceState(newSentence);

      // Trả từ về danh sách
      const newWords = [...wordsState];
      newWords.push(word);
      setWordsState(newWords);
    }
  };

  // Component từ có thể kéo
  const DraggableWord = ({ word }) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const scale = useSharedValue(1);
    const zIndex = useSharedValue(0);

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
        scale.value = withSpring(1);
        const wordY = event.absoluteY;
        // Kiểm tra xem có thả vào drop zone nào không
        for (let zone of dropZones) {
          const dropZoneTop = zone.y;
          const dropZoneBottom = zone.y + zone.height;
          if (
            wordY >= dropZoneTop &&
            wordY <= dropZoneBottom &&
            event.absoluteX >= zone.x &&
            event.absoluteX <= zone.x + zone.width
          ) {
            runOnJS(handleDrop)(zone.id, word);
            break;
          }
        }

        // Reset vị trí
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
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

    return (
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[animatedStyle]}>
          <CardText text={word.text} />
        </Animated.View>
      </PanGestureHandler>
    );
  };

  // Component ô trong câu
  const SentenceWord = ({ word }) => {
    const isDropZone = correctAnswers.includes(word.id);
    const isEmpty = word.text === "...";

    return isDropZone ? (
      <TouchableOpacity
        onLayout={(event) => {
          const { x, y, width, height } = event.nativeEvent.layout;
          console.log("Text layout:", { x, y, width, height });
          setDropZones((prev) => [
            ...prev,
            { id: word.id, x, y, width, height },
          ]);
        }}
        onPress={() => (!isEmpty ? handleWordClick(word.id) : null)}
        style={[
          styles.sentenceWord,
          isDropZone && styles.dropZone,
          !isEmpty && isDropZone && styles.filledDropZone,
        ]}
      >
        <Text
          style={[
            styles.sentenceText,
            isEmpty && isDropZone && styles.placeholderText,
          ]}
        >
          {word.text}
        </Text>
      </TouchableOpacity>
    ) : (
      <View style={styles.sentenceWord}>
        <Text
          style={[
            styles.sentenceText,
            isEmpty && isDropZone && styles.placeholderText,
          ]}
        >
          {word.text}
        </Text>
      </View>
    );
  };

  return (
    <ImageBackground
      style={{ flex: 1 }}
      source={require("../assets/background.png")}
      resizeMode="cover"
    >
      <View style={{ flex: 1, marginVertical: 16, marginHorizontal: 12 }}>
        <HeadGame />
        <LineProgressBar progress={50}></LineProgressBar>
        <View style={{ marginTop: 16 }}>
          <CardTitleGame></CardTitleGame>
        </View>
        <View style={{ marginTop: 60 }}>
          {/* Sentence Container */}
          <View>
            <View style={styles.sentenceRow}>
              {React.useMemo(() => {
                return sentenceState.map((word) => (
                  <SentenceWord word={word} />
                ));
              }, [sentenceState])}
            </View>
            {/* Available Words */}
            <View style={styles.wordsContainer}>
              {wordsState.map((word) => (
                <View
                  key={`word-container-${word.id}`}
                  style={{ marginHorizontal: 8 }}
                >
                  <DraggableWord key={word.id} word={word} />
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  sentenceContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 15,
    padding: 20,
    marginBottom: 40,
    minHeight: 120,
    justifyContent: "center",
  },
  sentenceRow: {
    backgroundColor: "red",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  sentenceWord: {
    marginHorizontal: 4,
    marginVertical: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  dropZone: {
    backgroundColor: "#F8F8F8",
    borderWidth: 2,
    borderColor: "#DDD",
    borderStyle: "dashed",
    minWidth: 60,
    minHeight: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  filledDropZone: {
    backgroundColor: "#E8F5E8",
    borderColor: "#4CAF50",
    borderStyle: "solid",
  },
  sentenceText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "600",
    textAlign: "center",
  },
  placeholderText: {
    color: "#999",
    fontSize: 16,
  },
  wordsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
  },
});

export default WordDragDropGame;
