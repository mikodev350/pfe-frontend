import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  image: null,
};

export const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    openViewer: (state, { payload }) => {
      state.isOpen = true;
      state.image = payload.url;
    },
    closeViewer: (state) => {
      state.isOpen = false;
      state.image = null;
    },
  },
});

export const { openViewer, closeViewer } = imageSlice.actions;
export const image = (state) => state.image;

export default imageSlice.reducer;
