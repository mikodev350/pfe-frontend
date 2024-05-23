import { createSlice } from "@reduxjs/toolkit";
// import { toast } from "react-toastify";

const initialState = {
  socket: null,
};

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    initSocket: (state, { payload }) => {
      state.socket = payload.socket;
    },
    cleanup: (state, { payload }) => {
      state.socket = null;
    },
  },
});

export const { initSocket, cleanup } = socketSlice.actions;

export const socket = (state) => state.socket;
export default socketSlice.reducer;
