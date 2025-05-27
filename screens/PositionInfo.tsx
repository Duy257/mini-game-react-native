import React, { useRef, useCallback } from "react";
import { View, Text } from "react-native";

const PositionInfo = () => {
  const wordsState = [
    { id: 1, text: "Tôi" },
    { id: 2, text: "ăn" },
    { id: 3, text: "sáng" },
    { id: 4, text: "lúc" },
    { id: 5, text: "7" },
    { id: 6, text: "giờ" },
  ];
  // Tạo ref object để lưu trữ ref của từng word
  const wordRefs = useRef({});

  // Hàm để đo vị trí của một word cụ thể
  const measureWord = useCallback((wordId: number) => {
    const ref = wordRefs.current[wordId];
    if (ref) {
      ref.measureInWindow(
        (x: number, y: number, width: number, height: number) => {
          console.log(`Word ${wordId} position:`, { x, y, width, height });
        }
      );
    }
  }, []);

  // Hàm để đo vị trí tất cả words
  const measureAllWords = useCallback(() => {
    wordsState.forEach((word) => {
      measureWord(word.id);
    });
  }, [wordsState, measureWord]);

  return (
    <View style={{ flexDirection: "row" }}>
      {wordsState.map((word) => (
        <View
          key={`word-container-${word.id}`}
          ref={(ref) => {
            if (ref) {
              wordRefs.current[word.id] = ref;
            } else {
              delete wordRefs.current[word.id];
            }
          }}
          style={{ marginHorizontal: 8 }}
        >
          <Text>{word.text}</Text>
        </View>
      ))}
    </View>
  );
};

export default PositionInfo;
