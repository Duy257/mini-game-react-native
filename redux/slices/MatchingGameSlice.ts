import { createSlice } from "@reduxjs/toolkit";

function shuffleArray(array: Item[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export interface Item {
  id: string;
  text: string;
  matchId: string;
  type: "audio" | "image" | "text";
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

const initialState = {
  listItemsLeft: [],
  listItemsRight: [],
  selectedLeft: null,
  selectedRight: null,
  matchedPairs: [],
  errorPairs: [],
  listItemsDone: [],
  questionDone: 0,
  totalQuestion: 5,
};

export const MatchingGameSlice = createSlice({
  name: "MatchingGame",
  initialState,
  reducers: {
    setData(state, action) {
      state[action.payload.stateName] = action.payload.value;
    },
    reset: (state) => {
      console.log("reset");

      state.listItemsLeft = shuffleArray(itemsLeft);
      state.listItemsRight = shuffleArray(itemsRight);
      state.selectedLeft = null;
      state.selectedRight = null;
      state.matchedPairs = [];
      state.errorPairs = [];
      state.listItemsDone = [];
    },
  },
});

export const { setData, reset } = MatchingGameSlice.actions;

// Export reducer
export default MatchingGameSlice.reducer;
