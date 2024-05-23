import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  recording: false,
  audiolocalURL: "",
  blob: "",
  stop: false,
};

const recorderSlice = createSlice({
  name: "recorder",
  initialState,
  reducers: {
    onRec: (state, action) => {
      state.recording = action.payload.recording;
      state.audiolocalURL = "";
    },
    onStop: (state) => {
      state.stop = true;
    },
    onRestStop: (state) => {
      state.stop = false;
    },
    getAudioURL: (state, action) => {
      state.audiolocalURL = action.payload.audiolocalURL;
      state.recording = false;
      state.blob = action.payload.blob;
    },
    onClearRecorder: (state) => {
      state.audiolocalURL = "";
      state.recording = false;
      state.blob = "";
    },
  },
});

// Action creators are generated for each case reducer function
export const { onRec, getAudioURL, onClearRecorder, onStop, onRestStop } =
  recorderSlice.actions;

// Selector for the recorder state
export const recorder = (state) => state.recorder;

// Export the reducer
export default recorderSlice.reducer;
