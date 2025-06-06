import { createSlice } from "@reduxjs/toolkit";

interface State {
  listWords: Word[];
  dropZones: DropZone[];
}

export interface Item {
  id: string;
  text: string;
  matchId: string;
  type: "audio" | "image" | "text";
}

export interface Word {
  id: string;
  position?: number;
  text: string;
  isAnswer?: boolean;
}
export interface DropZone {
  id: string;
  wordId: string | null;
  x: number;
  y: number;
  width: number;
  height: number;
}

const data = [
  { id: "1", position: 1, text: "Tôi", isAnswer: true },
  { id: "2", position: 2, text: "đã", isAnswer: true },
  { id: "3", position: 3, text: "ăn", isAnswer: true },
  { id: "4", position: 4, text: "sáng", isAnswer: true },
];

const initialState: State = {
  listWords: data,
  dropZones: [],
};

export const MGHHReducer = createSlice({
  name: "MGHHReducer",
  initialState,
  reducers: {
    setData(state, action) {
      state[action.payload.stateName] = action.payload.value;
    },
    restartGame: (state) => {
      state.listWords = data;
      state.dropZones = data.map((item: Word) => ({
        id: Math.random().toString(),
        wordId: null,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      }));
    },
    reset: (state) => {
      state.listWords = [];
    },
  },
});

export const { setData, reset, restartGame } = MGHHReducer.actions;

export default MGHHReducer.reducer;
