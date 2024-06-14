import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  role: localStorage.getItem("role") || "DEFAULT",
  type: localStorage.getItem("type") || "DEFAULT",
};

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload;
      localStorage.setItem("role", action.payload);
    },
    setType: (state, action) => {
      state.type = action.payload;
      localStorage.setItem("type", action.payload);
    },
  },
});

export const { setRole, setType } = roleSlice.actions;

export default roleSlice.reducer;
