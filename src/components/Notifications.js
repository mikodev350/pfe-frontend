import { useEffect } from "react";
import { useDispatch } from "react-redux";

import axios from "axios";
import {
  setNotifications,
  setSeenStatusNotification,
} from "../redux/features/notification-slice";
import { useSearchParams } from "react-router-dom";
// import { notifyUser } from "../util/PopUpNotification";

export default function Notification() {
  // const dispatch = useSelector(state => state.socket);
  const dispatch = useDispatch();
  const [search] = useSearchParams();
  useEffect(() => {
    if (!!search.get("notif_id")) {
      setTimeout(() => {
        dispatch(
          setSeenStatusNotification({
            notif_id: search.get("notif_id"),
          })
        );
      }, 1000);
    }
  }, [search.get("notif_id")]);

  useEffect(async () => {
    if (localStorage.getItem("token")) {
      const result = await fetchNotifications(1);
      console.log("fetchNotifications");
      dispatch(
        setNotifications({
          notifications: result.notifications,
          total_count: result.total_count_Not_seen,
          total_new_messages: result.total_new_messages,
          currentPage: result.currentPage,
        })
      );
    }
  }, [dispatch]);
  return null;
}

export const fetchNotifications = async (page) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Attach the token as a Bearer token
    },
  };
  const response = await axios.get(
    `${process.env.REACT_APP_API_BASE_URL}/notifications`,
    config
  );
  return response.data;
};
