import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { io } from "socket.io-client";

import { initSocket, cleanup } from "../../redux/features/socket-slice";

// import sound from "../sounds/beep.mp3";
import { newNotification } from "../../redux/features/notification-slice";
import { toast } from "react-toastify";

export default function Socket() {
  // const dispatch = useSelector(state => state.socket);
  const dispatch = useDispatch();
  const initSock = async () => {
    // Create a socket connection
    if (localStorage.getItem("token")) {
      const newSocket = io("http://localhost:1337", {
        transports: ["websocket"],
        query: {
          token: `${localStorage.getItem("token")}`,
        },
      });

      newSocket.emit("connection", () => {
        console.log("Connected to the server!");
      });
      dispatch(
        initSocket({
          socket: newSocket,
        })
      );
      // Load the audio file for playing notifications
      //const audio = new Audio(sound);

      // Add event listener for 'newNotification' event
      newSocket.on("newNotification", (data) => {
        // alert("nofitication recevied");
        // Play the audio file when a new notification is received
        // audio.play();
        dispatch(newNotification(data));
        toast.info(data.notify_text, {
          position: "top-left",
        });
      });

      return () => {
        newSocket.close();
        dispatch(
          cleanup({
            socket: null,
          })
        );
      };
    }
  };
  useEffect(() => {
    initSock();
  }, []);

  return <>n</>;
}
