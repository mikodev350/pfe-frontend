import { configureStore } from "@reduxjs/toolkit";
import sidebarState from "./features/sidebarSlice";
import logoutState from "./features/logoutSlice";
// import examReducer from "./features/examSlices";
// import examStartReducer from "./features/examStartSlice";
// import selectedAnswersReducer from "./features/selectedAnswersSlice";

// import examDataReducer from "./features/examDataSlice";

// import counterReducer from "./reducers/testReducers";
// import productsReducer from "./reducers/productsReducers";

export const store = configureStore({
  devTools: true,
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware({
  //   serializableCheck: false
  // }) ,
  reducer: {
    sidebar: sidebarState,
    logout: logoutState,
    // exam: examReducer,
    // examStart: examStartReducer,
    // selectedAnswers: selectedAnswersReducer,
  },
});

export const AppDispatch = store.dispatch;
export const RootState = () => store.getState();
export const AppThunk = (action, type) => ({
  action: action,
  type: type,
});
