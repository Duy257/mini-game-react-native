import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

const BOX_SIZE = 100;

const DraggableReanimated = () => {
  // 1. Shared values để lưu vị trí (x, y)
  // Shared values có thể được truy cập và thay đổi từ cả UI thread và JS thread
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Hàm callback khi vị trí thay đổi (chạy trên JS thread)
  const onPositionChange = (x, y) => {
    console.log(`Vị trí mới (JS Thread): x=${x.toFixed(2)}, y=${y.toFixed(2)}`);
  };

  // 2. Xử lý cử chỉ kéo
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (event, context) => {
      // Lưu vị trí ban đầu vào context để tính toán delta
      // context là một đối tượng bạn có thể dùng để chia sẻ state giữa các callback của gesture
      context.startX = translateX.value;
      context.startY = translateY.value;
      console.log("Kéo bắt đầu");
    },
    onActive: (event, context) => {
      // event.translationX/Y là khoảng cách di chuyển từ điểm bắt đầu cử chỉ
      translateX.value = context.startX + event.translationX;
      translateY.value = context.startY + event.translationY;

      // Nếu bạn muốn gọi một hàm JS từ worklet (hàm chạy trên UI thread)
      // runOnJS(onPositionChange)(translateX.value, translateY.value);
    },
    onEnd: (event, context) => {
      console.log("Kéo kết thúc");
      // Ví dụ: Làm cho component nảy về vị trí (0,0) khi thả ra
      // translateX.value = withSpring(0);
      // translateY.value = withSpring(0);

      // Hoặc chỉ đơn giản là log vị trí cuối cùng trên JS thread
      runOnJS(onPositionChange)(translateX.value, translateY.value);
    },
  });

  // 3. Tạo style động cho component
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.draggableBox, animatedStyle]}>
          <Text style={styles.text}>Kéo tôi!</Text>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  draggableBox: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    backgroundColor: "tomato",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  text: {
    color: "white",
    fontWeight: "bold",
  },
});

export default DraggableReanimated;
