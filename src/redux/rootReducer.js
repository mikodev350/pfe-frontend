import { combineReducers } from "@reduxjs/toolkit";

// import userSlice from "./features/user-slice";
import socketSlice from "./features/socket-slice.js";

import recorderSlice from "./features/recorder-slice";
import uploadFilesSlice from "./features/upload-slice";
import imageSlice from "./features/image-slice";
import sidebarState from "./features/sidebarSlice";
import logoutState from "./features/logoutSlice";
import searchSlice from "./features/search-slice.js";
const rootReducer = combineReducers({
  //user: userSlice,
  socket: socketSlice,
  // notification: notificationSlice,
  recorder: recorderSlice,
  upload: uploadFilesSlice,
  image: imageSlice,
  sidebar: sidebarState,
  logout: logoutState,
  search: searchSlice, // Add the search slice
  // tickets: ticketSlice,
});

export default rootReducer;
