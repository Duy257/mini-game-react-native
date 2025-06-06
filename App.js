import React from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { SentenceRearrangementGame } from "./screens/SakuLuyenCong";
import DragDropWordsReorder from "./screens/StartMGHH";
import StartMGHH from "./screens/StartMGHH";

function App() {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <Provider store={store}>
      <GestureHandlerRootView>
        <StartMGHH />
      </GestureHandlerRootView>
    </Provider>
  );
}

export default App;
