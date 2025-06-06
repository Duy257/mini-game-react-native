import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import GameOverModal from "../components/GameOverModel";
import UseSupportModel from "../components/UseSupportModel";
import { Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CardText } from "../components/CardText";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { DropZone, Word } from "../redux/slices/MGHHReducer";
import { useGameHook } from "../redux/hooks/gameHook";
import { useMghhHook } from "../redux/hooks/mghhHook";
import HeadGame from "../components/sakutimban/HeadGame";
import LineProgressBar from "../components/sakutimban/LineProgressBar";
import { CardTitleGame } from "../modules/game/CardTitleGame";
import { BottomGame } from "../components/sakutimban/BottomGame";

const StartMGHH = () => {
  const { isGameOver, messageGameOver } = useSelector(
    (state: RootState) => state.Game
  );
  const { listWords, dropZones } = useSelector(
    (state: RootState) => state.MGHHReducer
  );

  const [showModelSupport, setShowModelSupport] = useState(false);
  const [answersState, setAnswersState] = useState<Word[]>([]);
  const [defaultWords, setDefaultWords] = useState<Word[]>([]);

  const gameHook = useGameHook();
  const mghhHook = useMghhHook();
  const refDropZone = useRef<{ [key: string]: View | null }>({});

  useEffect(() => {
    restartGame();

    return () => {
      refDropZone.current = {};
    };
  }, []);
  useEffect(() => {
    findPositionDropZone();
  }, [defaultWords]);

  const gameOver = (message: string) => {};

  const restartGame = () => {
    mghhHook.restartGame();
    gameHook.restartGame();
    setAnswersState(listWords);
    setDefaultWords(
      listWords.map((word: Word) => ({
        id: Math.random().toString(),
        text: "...",
        isAnswer: false,
      }))
    );
  };

  const useSupport = () => {
    gameHook.pauseGame();
  };

  const cancelUseSupport = () => {
    gameHook.continueGame();
    setShowModelSupport(false);
  };

  const confirmUseSupport = () => {
    gameHook.continueGame();
    setShowModelSupport(false);
  };

  const checkAnswer = () => {
    // Kiểm tra nếu câu chưa hoàn thiện
    if (answersState.length === 0 || answersState.some((word: any) => !word)) {
      Alert.alert("Thông báo", "Vui lòng điền đầy đủ các từ vào câu!");
      return;
    }

    // Sắp xếp câu theo thứ tự position
    const sortedSentence = [...answersState].sort(
      (a: any, b: any) => a.position - b.position
    );

    // Tạo câu từ các từ đã sắp xếp
    const userAnswer = sortedSentence.map((word: any) => word.text).join(" ");

    // Tạo đáp án đúng từ dữ liệu gốc
    const correctAnswer = listWords
      .sort((a: any, b: any) => a.position - b.position)
      .map((word: Word) => word.text)
      .join(" ");

    // So sánh kết quả
    const isCorrect = userAnswer === correctAnswer;

    // Hiển thị kết quả
    Alert.alert(
      isCorrect ? "Chính xác!" : "Sai rồi!",
      isCorrect
        ? "Bạn đã sắp xếp đúng thứ tự các từ!"
        : `Đáp án đúng là: ${correctAnswer}`,
      [{ text: "OK" }]
    );

    // Trả về kết quả kiểm tra (có thể dùng cho mục đích khác nếu cần)
    return isCorrect;
  };

  const findPositionDropZone = () => {
    const newZones = [];
    defaultWords.forEach((word: Word) => {
      const ref = refDropZone.current[word.id];
      ref?.measureInWindow((x, y, width, height) => {
        newZones.push({
          id: Math.random().toString(),
          wordId: word.id,
          x: x + 23,
          y: y + 23,
          width,
          height,
        });
      });
    });
    mghhHook.setData({ stateName: "dropZones", value: newZones });
  };

  // Hàm xử lý khi thả từ vào drop zone
  const handleDrop = useCallback(
    (dropZone: DropZone, word: Word) => {
      if (!word) return;

      // Đưa từ vào drop zone
      setDefaultWords((prevDefaultWords) => {
        const updatedWords = [...prevDefaultWords];
        const indexToUpdate = updatedWords.findIndex(
          (w) => w.id === dropZone.wordId
        );

        if (indexToUpdate >= 0) {
          updatedWords[indexToUpdate] = word;
        }
        return updatedWords;
      });

      // Xoá từ ra khỏi danh sách answer
      setAnswersState((prevAnswers) => {
        const newDefaultWords = [...defaultWords];
        const answerWords = [...prevAnswers];
        const wordReplaced = newDefaultWords.find(
          (w) => w.id === dropZone.wordId
        );
        // Nếu từ bị thay thế là từ trong answer thì đưa nó về answer
        if (wordReplaced && wordReplaced.isAnswer) {
          answerWords.push(wordReplaced);
        }

        return answerWords.filter((w) => w.id !== word.id);
      });
    },
    [mghhHook]
  );

  // Hàm xử lý khi click vào từ trong drop zone
  const handleWordClick = (word: Word) => {
    if (!word) return;

    // Trả answer về danh sách
    const newWords = [...answersState];
    newWords.push(word);
    setAnswersState(newWords);

    // Xoá answer khỏi zone
    const defaultWordsClone = [...defaultWords];
    const indexToUpdate = defaultWordsClone.findIndex((w) => w.id === word.id);
    if (indexToUpdate >= 0) {
      defaultWordsClone[indexToUpdate] = {
        id: Math.random().toString(),
        text: "...",
        isAnswer: false,
      };
    }
    setDefaultWords(defaultWordsClone);
  };

  // Component từ dưới câu trả lời
  const DraggableWord = ({ word }: { word: Word }) => {
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
        const wordX = event.absoluteX;
        // Kiểm tra xem có thả vào drop zone nào không
        for (let zone of dropZones) {
          const dropZoneX = zone.x;
          const dropZoneY = zone.y;
          const dropZoneWidth = dropZoneX + zone.width;
          const dropZoneHeight = dropZoneY + zone.height;
          if (
            wordY >= dropZoneY &&
            wordY <= dropZoneHeight &&
            wordX >= dropZoneX &&
            wordX <= dropZoneWidth
          ) {
            runOnJS(handleDrop)(zone, word);
            break;
          }
        }

        // Reset vị trí
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
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

    return (
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[animatedStyle]}>
          <CardText text={word.text} />
        </Animated.View>
      </PanGestureHandler>
    );
  };

  // Component ô trong drop zone
  const SentenceWord = ({ word }: { word: Word }) => {
    const isAnswer = word.isAnswer;

    return (
      <TouchableOpacity
        ref={(ref) => {
          refDropZone.current[word.id] = ref;
        }}
        onPress={() => (isAnswer ? handleWordClick(word) : null)}
        style={[
          styles.sentenceWord,
          styles.dropZone,
          isAnswer && styles.filledDropZone,
        ]}
      >
        <Text
          style={[styles.sentenceText, !isAnswer && styles.placeholderText]}
        >
          {word.text}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        style={{ flex: 1 }}
        source={require("../assets/background.png")}
        resizeMode="cover"
      >
        <View style={{ flex: 1, marginVertical: 16, marginHorizontal: 12 }}>
          <HeadGame
            isShowSuggest
            useSupport={useSupport}
            timeOut={() => gameOver("Hết giờ rồi, làm lại nào")}
          />
          <LineProgressBar progress={50}></LineProgressBar>

          <View style={{ marginTop: 16 }}>
            <CardTitleGame></CardTitleGame>
          </View>

          <View style={{ marginTop: 60 }}>
            <View>
              <View style={styles.sentenceRow}>
                {React.useMemo(() => {
                  return defaultWords.map((word) => (
                    <SentenceWord key={word.id} word={word} />
                  ));
                }, [defaultWords])}
              </View>
              <View style={styles.wordsContainer}>
                {answersState.map((word) => (
                  <View key={word.id} style={{ margin: 4 }}>
                    <DraggableWord word={word} />
                  </View>
                ))}
              </View>
              <TouchableOpacity
                onPress={checkAnswer}
                style={{
                  backgroundColor: "#4CAF50",
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                  borderRadius: 8,
                  marginTop: 20,
                  alignSelf: "center",
                  elevation: 3,
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Kiểm tra kết quả
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ position: "absolute", bottom: 20 }}>
            <BottomGame
              resetGame={restartGame}
              backGame={() => {}}
              pauseGame={() => {}}
              volumeGame={() => {}}
            ></BottomGame>
          </View>
        </View>
      </ImageBackground>
      <View style={{ zIndex: 1000 }}>
        <GameOverModal
          visible={isGameOver}
          onClose={() => {}}
          restartGame={restartGame}
          message={messageGameOver}
          isTimeOut={false}
        />
        <UseSupportModel
          visible={showModelSupport}
          title={""}
          message="Bạn sẽ bị trừ 10 điểm khi sử dụng trợ giúp này"
          onCancel={cancelUseSupport}
          onConfirm={confirmUseSupport}
        />
      </View>
    </SafeAreaView>
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
    paddingVertical: 20,
    borderRadius: 12,
    backgroundColor: "white",
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

export default StartMGHH;
