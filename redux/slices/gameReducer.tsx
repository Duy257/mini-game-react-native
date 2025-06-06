import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GameState {
  gem: number;
  totalLives: number;
  currentLives: number;
  isGameOver: boolean;
  time: number;
  messageGameOver: string;
  isRunTime: boolean;
}

interface GameStateItem {
  stateName: keyof GameState;
  value: GameState[keyof GameState];
}

const initialState: GameState = {
  gem: 0,
  totalLives: 3,
  currentLives: 3,
  isGameOver: false,
  time: 10,
  messageGameOver: "Rất tiếc!",
  isRunTime: false,
};

export const GameSlice = createSlice({
  name: "Game",
  initialState,
  reducers: {
    setData: {
      reducer: (
        state: GameState,
        action: PayloadAction<GameStateItem | GameStateItem[]>
      ) => {
        const updateState = (item: GameStateItem) => {
          if (initialState[item.stateName] === undefined) {
            console.warn(
              `Attempting to set unknown state property: ${item.stateName}`
            );
            return;
          }
          // Explicit type assertion for each property
          switch (item.stateName) {
            case "gem":
              state.gem = item.value as number;
              break;
            case "totalLives":
              state.totalLives = item.value as number;
              break;
            case "currentLives":
              state.currentLives = item.value as number;
              break;
            case "isGameOver":
              state.isGameOver = item.value as boolean;
              break;
            case "time":
              state.time = item.value as number;
              break;
            case "messageGameOver":
              state.messageGameOver = item.value as string;
              break;
            case "isRunTime":
              state.isRunTime = item.value as boolean;
              break;
          }
        };

        if (Array.isArray(action.payload)) {
          action.payload.forEach(updateState);
        } else {
          updateState(action.payload);
        }
      },
      prepare: (payload: GameStateItem | GameStateItem[]) => ({
        payload,
      }),
    },
    restartGame: (state: GameState) => {
      state.currentLives = initialState.currentLives;
      state.isGameOver = false;
      state.time = 10;
      state.isRunTime = true;
    },
    gameOver: (state: GameState, action: PayloadAction<string>) => {
      state.messageGameOver = action.payload;
      state.isGameOver = true;
      state.isRunTime = false;
    },
    reset: (state: GameState) => {
      state.currentLives = initialState.currentLives;
      state.isGameOver = false;
      state.time = 10;
      state.isRunTime = true;
    },
  },
});

export const { setData, reset, restartGame, gameOver } = GameSlice.actions;

export default GameSlice.reducer;
