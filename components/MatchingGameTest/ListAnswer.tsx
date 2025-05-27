import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Animated, {
  Layout,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Audio } from "expo-av";

export const playSound = async (url: string) => {
  await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

  const soundObject = await Audio.Sound.createAsync(
    { uri: url },
    { shouldPlay: true }
  );
  return soundObject.sound;
};

interface Item {
  id: string;
  text: string;
  matchId: string;
  type: "audio" | "image" | "text";
}
interface ItemDone {
  listItems: Item[];
}

function shuffleArray(array: Item[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const itemsLeft: Item[] = [
  {
    id: "l1",
    text: "Compare",
    matchId: "m1",
    type: "text",
  },
  {
    id: "l2",
    text: "Market",
    matchId: "m2",
    type: "text",
  },
  {
    id: "l3",
    text: "Promise",
    matchId: "m3",
    type: "text",
  },
  {
    id: "l4",
    text: "Dog",
    matchId: "m4",
    type: "text",
  },
  {
    id: "l5",
    text: "Warning",
    matchId: "m5",
    type: "text",
  },
];
const itemsRight: Item[] = [
  {
    id: "r1",
    text: "So sánh",
    matchId: "m1",
    type: "text",
  },
  {
    id: "r2",
    text: "https://api.dictionaryapi.dev/media/pronunciations/en/market-us.mp3",
    matchId: "m2",
    type: "audio",
  },
  {
    id: "r3",
    text: "https://api.dictionaryapi.dev/media/pronunciations/en/promise-us.mp3",
    matchId: "m3",
    type: "audio",
  },
  {
    id: "r4",
    text: "https://cdn.shopify.com/s/files/1/0086/0795/7054/files/Golden-Retriever.jpg?v=1645179525",
    matchId: "m4",
    type: "image",
  },
  {
    id: "r5",
    text: "Cảnh báo",
    matchId: "m5",
    type: "text",
  },
];

const ListAnswer = () => {
  const [listItemsLeft, setListItemsLeft] = useState<Item[]>([]);
  const [listItemsRight, setListItemsRight] = useState<Item[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<Item | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [errorPairs, setErrorPairs] = useState<string[]>([]);
  const [selectedRight, setSelectedRight] = useState<Item | null>(null);
  const [listItemsDone, setListItemsDone] = useState<ItemDone[]>([]);

  useEffect(() => {
    setListItemsLeft(shuffleArray(itemsLeft));
    setListItemsRight(shuffleArray(itemsRight));
  }, []);

  const isSelected = (item: Item, side: string) => {
    if (side === "left") {
      return selectedLeft?.id === item.id;
    } else {
      return selectedRight?.id === item.id;
    }
  };

  const handleLeftSelect = (item: Item) => {
    if (matchedPairs.includes(item.id)) return;

    setSelectedLeft(item);
    if (selectedRight) {
      checkMatch(item, selectedRight);
    }
  };
  const handleRightSelect = (item: Item) => {
    if (matchedPairs.includes(item.id)) return;
    if (item.type === "audio") {
      playSound(item.text);
    }

    setSelectedRight(item);
    if (selectedLeft) {
      checkMatch(selectedLeft, item);
    }
  };

  const isMatched = (id: string) => {
    return matchedPairs.includes(id);
  };
  const isError = (id: string) => {
    return errorPairs.includes(id);
  };

  const checkMatch = (leftItem: Item, rightItem: Item) => {
    if (leftItem.matchId === rightItem.matchId) {
      // Correct match
      setMatchedPairs([...matchedPairs, leftItem.id, rightItem.id]);
      setTimeout(() => {
        deleteItemLeft(leftItem.id);
        deleteItemRight(rightItem.id);
        setListItemsDone((prev) => [
          ...prev,
          { listItems: [leftItem, rightItem] },
        ]);
      }, 1000);
    } else {
      setErrorPairs([...errorPairs, leftItem.id, rightItem.id]);
    }
    setTimeout(() => {
      setSelectedLeft(null);
      setSelectedRight(null);
      setErrorPairs([]);
    }, 500);
  };

  const deleteItemLeft = (id: string) => {
    setListItemsLeft((prev) => prev.filter((item) => item.id !== id));
  };

  const deleteItemRight = (id: string) => {
    setListItemsRight((prev) => prev.filter((item) => item.id !== id));
  };

  const AnimatedItem = ({ item, onSelected, side }) => {
    const opacity = useSharedValue(1);
    const height = useSharedValue(65);
    // const handleDelete = (item: Item, side: string) => {
    //   opacity.value = withTiming(0, { duration: 300 });
    //   height.value = withTiming(0, { duration: 400 }, () => {
    //     if (side === "left") {
    //       deleteItemLeft(item.id);
    //     } else {
    //       deleteItemRight(item.id);
    //     }
    //   });
    // };
    const animatedStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
      height: height.value,
      marginVertical: 12,
    }));

    const getItem = () => {
      if (item.type === "image") {
        return (
          <Image
            source={{ uri: item.text }}
            style={{ width: 50, height: 50 }}
          ></Image>
        );
      } else if (item.type === "audio") {
        return <Image source={require("../../assets/audio.png")}></Image>;
      } else {
        return (
          <Text key={item.id} style={styles.textAnswer}>
            {item.text}
          </Text>
        );
      }
    };

    return (
      <Animated.View
        style={[animatedStyle]}
        layout={Layout.springify().damping(20)}
      >
        <View>
          <TouchableOpacity
            style={[
              styles.answer,
              isSelected(item, side) && styles.selectedItem,
              isMatched(item.id) && styles.matchedItem,
              isError(item.id) && styles.errorItem,
            ]}
            onPress={() => onSelected(item)}
          >
            {getItem()}
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  const getItemDone = (item: Item) => {
    if (item.type === "image") {
      return (
        <Image
          style={{ width: 65, height: 65 }}
          source={{ uri: item.text }}
        ></Image>
      );
    } else if (item.type === "audio") {
      return <Image source={require("../../assets/audio.png")}></Image>;
    } else {
      return (
        <Text key={item.id} style={styles.textAnswer}>
          {item.text}
        </Text>
      );
    }
  };

  return (
    <View>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <View style={styles.container}>
          <Image source={require("../../assets/female_bird.png")}></Image>
          <ScrollView>
            {listItemsLeft.map((item) => (
              <AnimatedItem
                item={item}
                key={item.id}
                onSelected={handleLeftSelect}
                side="left"
              ></AnimatedItem>
            ))}
          </ScrollView>
        </View>
        <View style={styles.container}>
          <Image source={require("../../assets/male_bird.png")}></Image>
          <ScrollView>
            {listItemsRight.map((item) => (
              <AnimatedItem
                item={item}
                key={item.id}
                onSelected={handleRightSelect}
                side="right"
              ></AnimatedItem>
            ))}
          </ScrollView>
        </View>
      </View>
      <View>
        {listItemsDone.map((item, index) => (
          <View style={styles.doneItem} key={index}>
            <View style={{ width: 70 }}>
              <Image source={require("../../assets/2_bird.png")}></Image>
            </View>
            {item.listItems.map((item) => (
              <View key={item.id} style={{ flex: 1, marginLeft: 12 }}>
                {getItemDone(item)}
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "45%",
    alignItems: "center",
    justifyContent: "center",
  },
  answer: {
    width: 140,
    height: 65,
    backgroundColor: "#FCF8E8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  textAnswer: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#112164",
  },
  selectedItem: {
    backgroundColor: "#2196F3",
    borderColor: "#0d8aee",
  },
  matchedItem: {
    backgroundColor: "#4CAF50",
    borderColor: "#3d8b40",
  },
  errorItem: {
    backgroundColor: "#FF5722",
    borderColor: "#3d8b40",
  },
  doneItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
});

export default ListAnswer;
