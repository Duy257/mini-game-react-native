import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
  loading: false,
  error: null,
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      // Redux Toolkit sử dụng Immer bên trong, cho phép "mutate" state
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    reset: (state) => {
      state.value = 0;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

// Export actions
export const {
  increment,
  decrement,
  incrementByAmount,
  reset,
  setLoading,
  setError,
} = counterSlice.actions;

// Export reducer
export default counterSlice.reducer;
