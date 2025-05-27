import React from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { SentenceRearrangementGame } from "./components/SentenceRearrangementGame";
import DragDropWordsReorder from "./components/TestGesture";
import WordDragDropGame from "./components/WordDragDropGame";
import TestGesture from "./components/TestGesture";
import DraggableReanimated from "./components/DraggableReanimated";
import PositionInfo from "./screens/PositionInfo";

function App() {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <Provider store={store}>
      <SafeAreaView style={{ flex: 1 }}>
        <GestureHandlerRootView>
          <PositionInfo />
        </GestureHandlerRootView>
      </SafeAreaView>
    </Provider>
  );
}

export default App;
