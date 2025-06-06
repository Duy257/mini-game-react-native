import React from "react";

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
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { Audio } from "expo-av";
import { useSelector } from "react-redux";
import { Item, setData } from "../../redux/slices/MatchingGameSlice";
import { useDispatch } from "react-redux";

export const playSound = async (url: string) => {
  await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

  const soundObject = await Audio.Sound.createAsync(
    { uri: url },
    { shouldPlay: true }
  );
  return soundObject.sound;
};

const ListAnswer = () => {
  const dispatch = useDispatch();
  const {
    listItemsLeft,
    listItemsRight,
    selectedLeft,
    selectedRight,
    matchedPairs,
    errorPairs,
    questionDone,
    listItemsDone,
  } = useSelector((state: any) => state.MatchingGame);

  const handleLeftSelect = (item: Item) => {
    if (matchedPairs.includes(item.id)) return;

    dispatch(setData({ stateName: "selectedLeft", value: item }));
    if (selectedRight) {
      checkMatch(item, selectedRight);
    }
  };
  const handleRightSelect = (item: Item) => {
    if (matchedPairs.includes(item.id)) return;
    if (item.type === "audio") {
      playSound(item.text);
    }

    dispatch(setData({ stateName: "selectedRight", value: item }));
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
      dispatch(
        setData({
          stateName: "matchedPairs",
          value: [...matchedPairs, leftItem.id, rightItem.id],
        })
      );
      setTimeout(() => {
        deleteItemLeft(leftItem.id);
        deleteItemRight(rightItem.id);
        dispatch(
          setData({
            stateName: "listItemsDone",
            value: [...listItemsDone, { listItems: [leftItem, rightItem] }],
          })
        );
        dispatch(
          setData({ stateName: "questionDone", value: questionDone + 1 })
        );
      }, 1000);
    } else {
      dispatch(
        setData({
          stateName: "errorPairs",
          value: [...errorPairs, leftItem.id, rightItem.id],
        })
      );
    }
    setTimeout(() => {
      dispatch(setData({ stateName: "selectedLeft", value: null }));
      dispatch(setData({ stateName: "selectedRight", value: null }));
      dispatch(setData({ stateName: "errorPairs", value: [] }));
    }, 500);
  };

  const deleteItemLeft = (id: string) => {
    dispatch(
      setData({
        stateName: "listItemsLeft",
        value: listItemsLeft.filter((item: { id: string }) => item.id !== id),
      })
    );
  };

  const deleteItemRight = (id: string) => {
    dispatch(
      setData({
        stateName: "listItemsRight",
        value: listItemsRight.filter((item: { id: string }) => item.id !== id),
      })
    );
  };

  const isSelected = (item: Item, side: string) => {
    if (side === "left") return selectedLeft?.id === item.id;
    else return selectedRight?.id === item.id;
  };

  const AnimatedItem = ({ item, onSelected, side }) => {
    const opacity = useSharedValue(1);
    const height = useSharedValue(65);
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
