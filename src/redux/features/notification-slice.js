import { createSlice } from "@reduxjs/toolkit";
// import { toast } from "react-toastify";

const initialState = {
  total_count: 0,
  notifications: [],
  totalPages: 0,
  currentPage: 0,
  total_new_messages: 0,
  isLoading: true,
  error: null,
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotifications: (state, { payload }) => {
      state.notifications = [...state.notifications, ...payload.notifications];
      state.total_count = payload.total_count;
      state.total_new_messages = payload.total_new_messages;
      state.currentPage = payload.currentPage;
      state.isLoading = false;
    },
    newNotification: (state, { payload }) => {
      state.notifications = [payload, ...state.notifications];

      state.total_count = state.total_count + 1;
    },
    newMessage: (state, { payload }) => {
      state.total_new_messages = state.total_new_messages + 1;
    },
    setSeenStatusNotification: (state, { payload }) => {
      state.notifications = state.notifications.map((item) => {
        if (item.id == payload.notif_id && item.seen_status === false) {
          item.seen_status = true;
          state.total_count = state.total_count - 1;
        }
        return item;
      });
    },
    cleanup: (state, { payload }) => {
      state.notifications = {
        total_count: 0,
        notifications: [],
        isLoading: true,
        error: null,
      };
    },
  },
});

export const {
  setNotifications,
  newNotification,
  setSeenStatusNotification,
  cleanup,
  newMessage,
} = notificationSlice.actions;

export const notification = (state) => state.notification;
export default notificationSlice.reducer;
