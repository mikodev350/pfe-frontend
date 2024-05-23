import { createSlice } from "@reduxjs/toolkit";
// import { RootState } from "../store";

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
export const sidebarState = (state) => state.sidebar;

export default sidebarSlice.reducer;
