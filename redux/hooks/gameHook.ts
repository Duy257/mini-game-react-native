import { useDispatch } from "react-redux";
import { setData } from "../slices/MatchingGameSlice";
import { gameOver, restartGame } from "../slices/gameReducer";

export const useGameHook = () => {
  const dispatch = useDispatch();

  const action = {
    setData: (data: any) => {
      dispatch(setData(data));
    },
    pauseGame: () => {
      dispatch(setData({ stateName: "isRunTime", value: false }));
    },
    continueGame: () => {
      dispatch(setData({ stateName: "isRunTime", value: true }));
    },
    resetGame: () => {
      dispatch(resetGame());
    },
    gameOver: (message: string) => {
      dispatch(gameOver(message));
    },
    restartGame: () => {
      dispatch(restartGame());
    },
  };

  return action;
};
function resetGame(): any {
  throw new Error("Function not implemented.");
}
