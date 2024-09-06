import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { io } from "socket.io-client";

import { initSocket, cleanup } from "../../redux/features/socket-slice";
import { toast, ToastContainer } from "react-toastify";
// import sound from "../sounds/beep.mp3";
import {
  newNotification,
  newMessage,
} from "../../redux/features/notification-slice";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "react-query";
import { notifyUser } from "../../util/PopUpNotification";

export default function Socket() {
  const navigate = useNavigate(); // Utilise le hook useNavigate de React Router

  const queryClient = useQueryClient();
  const [searchQuery] = useSearchParams();
  const id = searchQuery.get("id");
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
      newSocket.on("notification", (data) => {
        // alert("nofitication recevied");
        // Play the audio file when a new notification is received
        // audio.play();
        const { notification } = data;

        dispatch(newNotification(notification));
        toast.info(
          notification.expediteur.username + " " + notification.notifText,
          {
            position: "top-left",
          }
        );
        notifyUser(
          `${notification.expediteur.username}  ${notification.notifText}`,
          `/dashboard${notification.redirect_url}`
        );
      });

      // Add event listener for 'newNotification' event
      newSocket.on("newMessage", async ({ message, conversationId }) => {
        // alert("nofitication recevied");
        // Play the audio file when a new notification is received
        // audio.play();
        if (!id) {
          console.log("newMessage");

          console.log(message);
          dispatch(newMessage());
          toast.info("Vous avez resu une noveaux messsage", {
            position: "top-left",
            onClick: () => {
              // Vérifie la taille de la fenêtre avant la redirection
              if (window.innerWidth < 990) {
                // Si la fenêtre est petite, redirige vers /conversation
                navigate(`/conversation/${conversationId}`);
              } else {
                // Sinon, redirige vers /chat avec l'ID de la conversation
                navigate(`/chat?id=${conversationId}`);
              }
            },
          });
          notifyUser("Vous avez resu une noveaux messsage");
        } else if (id === conversationId) {
          let data = await queryClient.getQueryData([
            "conversation",
            conversationId,
          ]);
          console.log(data);
          data = {
            ...data,
            messages: [...data.messages, message],
          };

          queryClient.setQueryData(["conversation", conversationId], {
            ...data,
          });
        }
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

  return <ToastContainer />;
}
