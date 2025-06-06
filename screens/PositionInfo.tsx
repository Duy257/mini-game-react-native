import React, { useRef, useState, useCallback } from "react";
import { View, TouchableOpacity, Text } from "react-native";

const PositionInfo = () => {
  const wordsState = [
    { id: 1, text: "Tôi" },
    { id: 2, text: "ăn" },
    { id: 3, text: "sáng" },
    { id: 4, text: "lúc" },
    { id: 5, text: "7" },
    { id: 6, text: "giờ" },
  ];
  const wordRefs = useRef({});
  const [wordPositions, setWordPositions] = useState({});

  const measureAllWords = useCallback(() => {
    const positions = {};
    let measuredCount = 0;
    const totalWords = wordsState.length;

    wordsState.forEach((word) => {
      const ref = wordRefs.current[word.id];
      if (ref) {
        ref.measureInWindow((x, y, width, height) => {
          positions[word.id] = { x, y, width, height };
          measuredCount++;

          // Khi đã đo xong tất cả, update state
          if (measuredCount === totalWords) {
            setWordPositions(positions);
          }
        });
      }
    });
  }, [wordsState]);

  return (
    <View>
      <TouchableOpacity onPress={measureAllWords} style={{ padding: 20 }}>
        <Text>Đo vị trí tất cả từ</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: "row" }}>
        {wordsState.map((word) => (
          <View
            key={`word-container-${word.id}`}
            ref={(ref) => {
              wordRefs.current[word.id] = ref;
            }}
            style={{ marginHorizontal: 8 }}
          >
            <Text>{word.text}</Text>
          </View>
        ))}
      </View>

      {/* Hiển thị positions để debug */}
      {Object.keys(wordPositions).length > 0 && (
        <View style={{ padding: 20 }}>
          <Text>Positions:</Text>
          {Object.entries(wordPositions).map(([id, pos]) => (
            <Text key={id}>
              Word {id}: x={pos.x.toFixed(0)}, y={pos.y.toFixed(0)}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

export default PositionInfo;
