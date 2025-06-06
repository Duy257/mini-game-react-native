// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import MatchingGame from "./slices/MatchingGameSlice";
import userReducer from "./slices/userSlice";
import MGHHReducer from "./slices/MGHHReducer";
import Game from "./slices/gameReducer";

export const store = configureStore({
  reducer: {
    MatchingGame: MatchingGame,
    user: userReducer,
    MGHHReducer: MGHHReducer,
    Game: Game,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
