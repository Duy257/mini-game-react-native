import { useDispatch } from "react-redux";
import { reset, restartGame, setData } from "../slices/MGHHReducer";

export const useMghhHook = () => {
  const dispatch = useDispatch();

  const action = {
    setData: (data: any) => {
      dispatch(setData(data));
    },
    restartGame: () => {
      dispatch(restartGame());
    },
    reset: () => {
      dispatch(reset());
    },
  };

  return action;
};
