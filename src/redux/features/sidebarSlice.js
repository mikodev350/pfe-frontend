import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpenSideBar: false,
};

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    onUpdateSidebarStatus: (state) => {
      state.isOpenSideBar = !state.isOpenSideBar;
    },
  },
});

// Action creators are generated for each case reducer function
export const { onUpdateSidebarStatus } = sidebarSlice.actions;

// This selector function accesses the sidebar part of the state
export const sidebarState = (state) => state.sidebar;

export default sidebarSlice.reducer;
