import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  StatusBar,
} from "react-native";
import {
  PanGestureHandler,
  GestureHandlerRootView,
  State,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  interpolate,
} from "react-native-reanimated";

const WordDragDropGame = () => {
  // Dữ liệu game
  const sentence = ["Tôi", "...", "sáng", "...", "7", "giờ"];
  const availableWords = ["ăn", "lúc"];
  const correctAnswers = [1, 3]; // Vị trí các ô cần điền (index 1 và 3)

  // State quản lý game
  const [sentenceState, setSentenceState] = useState([...sentence]);
  const [wordsState, setWordsState] = useState([...availableWords]);
  const [dropZones, setDropZones] = useState({});

  // Refs cho các vị trí
  const wordRefs = useRef({});
  const dropZoneRefs = useRef({});

  // Animated values
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  // Hàm xử lý khi thả từ
  const handleDrop = (wordIndex, dropZoneIndex) => {
    const word = wordsState[wordIndex];
    if (!word) return;

    // Cập nhật câu
    const newSentence = [...sentenceState];
    newSentence[dropZoneIndex] = word;
    setSentenceState(newSentence);

    // Xóa từ khỏi danh sách từ có sẵn
    const newWords = [...wordsState];
    newWords[wordIndex] = null;
    setWordsState(newWords);
  };

  // Hàm xử lý khi click vào từ đã điền
  const handleWordClick = (sentenceIndex) => {
    const word = sentenceState[sentenceIndex];
    if (word === "..." || !correctAnswers.includes(sentenceIndex)) return;

    // Trả từ về danh sách từ có sẵn
    const newWords = [...wordsState];
    const emptyIndex = newWords.findIndex((w) => w === null);
    if (emptyIndex !== -1) {
      newWords[emptyIndex] = word;
    } else {
      newWords.push(word);
    }
    setWordsState(newWords);

    // Đặt lại ô trống
    const newSentence = [...sentenceState];
    newSentence[sentenceIndex] = "...";
    setSentenceState(newSentence);
  };

  // Gesture handler cho kéo thả
  const createGestureHandler = (wordIndex) => {
    return useAnimatedGestureHandler({
      onStart: () => {
        scale.value = withSpring(1.1);
        opacity.value = 0.8;
      },
      onActive: (event) => {
        translateX.value = event.translationX;
        translateY.value = event.translationY;
      },
      onEnd: (event) => {
        scale.value = withSpring(1);
        opacity.value = 1;

        // Kiểm tra xem có thả vào drop zone nào không
        const dropZoneKeys = Object.keys(dropZones);
        let dropped = false;

        for (let key of dropZoneKeys) {
          const zone = dropZones[key];
          if (
            event.absoluteX >= zone.x &&
            event.absoluteX <= zone.x + zone.width &&
            event.absoluteY >= zone.y &&
            event.absoluteY <= zone.y + zone.height
          ) {
            runOnJS(handleDrop)(wordIndex, parseInt(key));
            dropped = true;
            break;
          }
        }

        // Reset vị trí
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      },
    });
  };

  // Animated style cho từ đang kéo
  const createAnimatedStyle = () => {
    return useAnimatedStyle(() => ({
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
      opacity: opacity.value,
      zIndex: scale.value > 1 ? 1000 : 1,
    }));
  };

  // Hàm đo vị trí drop zone
  const measureDropZone = (index) => {
    return (event) => {
      const { x, y, width, height } = event.nativeEvent.layout;
      setDropZones((prev) => ({
        ...prev,
        [index]: { x, y, width, height },
      }));
    };
  };

  // Component từ có thể kéo
  const DraggableWord = ({ word, index }) => {
    if (!word) return null;

    return (
      <PanGestureHandler onGestureEvent={createGestureHandler(index)}>
        <Animated.View style={[styles.wordChip, createAnimatedStyle()]}>
          <Text style={styles.wordText}>{word}</Text>
        </Animated.View>
      </PanGestureHandler>
    );
  };

  // Component ô trong câu
  const SentenceWord = ({ word, index }) => {
    const isDropZone = correctAnswers.includes(index);
    const isEmpty = word === "...";

    return (
      <TouchableOpacity
        onLayout={isDropZone ? measureDropZone(index) : undefined}
        onPress={() => (!isEmpty ? handleWordClick(index) : null)}
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
          {word}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B6B" />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.heartContainer}>
            <Text style={styles.heartText}>❤️ 300</Text>
          </View>
          <Text style={styles.headerTitle}>Xếp hàng</Text>
          <Text style={styles.headerSubtitle}>Gọi ý</Text>
          <View style={styles.coinContainer}>
            <Text style={styles.coinText}>⚡ 605</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
        </View>

        {/* Game Area */}
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400",
          }}
          style={styles.gameArea}
          imageStyle={styles.backgroundImage}
        >
          {/* Audio Button */}
          <TouchableOpacity style={styles.audioButton}>
            <Text style={styles.audioIcon}>🔊</Text>
            <Text style={styles.audioText}>Tôi ăn sáng lúc 7 giờ</Text>
          </TouchableOpacity>

          {/* Sentence Container */}
          <View style={styles.sentenceContainer}>
            <View style={styles.sentenceRow}>
              {sentenceState.map((word, index) => (
                <SentenceWord key={index} word={word} index={index} />
              ))}
            </View>
          </View>

          {/* Available Words */}
          <View style={styles.wordsContainer}>
            {wordsState.map((word, index) => (
              <DraggableWord key={index} word={word} index={index} />
            ))}
          </View>
        </ImageBackground>

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          <TouchableOpacity style={styles.controlButton}>
            <Text style={styles.controlIcon}>💡</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton}>
            <Text style={styles.controlIcon}>⏸️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton}>
            <Text style={styles.controlIcon}>↻</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton}>
            <Text style={styles.controlIcon}>🔊</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FF6B6B",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FF6B6B",
  },
  heartContainer: {
    backgroundColor: "#FF4757",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  heartText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "white",
    fontSize: 14,
  },
  coinContainer: {
    backgroundColor: "#FFA502",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  coinText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: "#FF6B6B",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#FF4757",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    width: "75%",
    backgroundColor: "#2ED573",
  },
  gameArea: {
    flex: 1,
    padding: 20,
  },
  backgroundImage: {
    opacity: 0.7,
  },
  audioButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    marginBottom: 30,
    alignSelf: "flex-start",
  },
  audioIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  audioText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  sentenceContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 15,
    padding: 20,
    marginBottom: 40,
    minHeight: 120,
    justifyContent: "center",
  },
  sentenceRow: {
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
  wordChip: {
    backgroundColor: "#FFB8B8",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginHorizontal: 8,
    marginVertical: 4,
    borderWidth: 2,
    borderColor: "#FF6B6B",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  wordText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
    textAlign: "center",
  },
  bottomControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 40,
    paddingVertical: 20,
    backgroundColor: "#FF6B6B",
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFA502",
    justifyContent: "center",
    alignItems: "center",
  },
  controlIcon: {
    fontSize: 20,
  },
});

export default WordDragDropGame;
