import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { initSocket, cleanup } from "../../redux/features/socket-slice";
import Swal from "sweetalert2"; // Importation de SweetAlert2

import beepSound from "./song/notification.mp3";

// import sound from "../sounds/beep.mp3";
import {
  newNotification,
  newMessage,
} from "../../redux/features/notification-slice";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "react-query";
import { notifyUser } from "../../util/PopUpNotification";

export default function Socket() {
  const playNotificationSound = () => {
    const audio = new Audio(beepSound);
    audio.play();
  };
  const navigate = useNavigate(); // Utilise le hook useNavigate de React Router
  const queryClient = useQueryClient();
  const [searchQuery] = useSearchParams();
  const id = searchQuery.get("id");
  const dispatch = useDispatch();

  const initSock = async () => {
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

      // Gestion des notifications de type 'notification'
      newSocket.on("notification", (data) => {
        const { notification } = data;

        dispatch(newNotification(notification));

        // Utilisation de SweetAlert2 pour afficher les notifications
        Swal.fire({
          title: "Nouvelle Notification",
          text: `${notification.expediteur.username} ${notification.notifText}`,
          icon: "info",
          timer: 5000,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          didOpen: () => {
            Swal.getPopup().addEventListener("click", () => {
              // Redirection lors du clic sur la notification
              navigate(`/dashboard${notification.redirect_url}`);
            });
          },
        });
        playNotificationSound();

        notifyUser(
          `${notification.expediteur.username}  ${notification.notifText}`,
          `/dashboard${notification.redirect_url}`
        );
      });

      // Gestion des messages de type 'newMessage'
      newSocket.on("newMessage", async ({ message, conversationId }) => {
        if (!id) {
          dispatch(newMessage());
          Swal.fire({
            title: "Nouveau message",
            text: "Vous avez reçu un nouveau message",
            icon: "info",
            timer: 5000,
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            didOpen: () => {
              Swal.getPopup().addEventListener("click", () => {
                // Redirection en fonction de la taille de la fenêtre
                if (window.innerWidth < 990) {
                  navigate(`/conversation/${conversationId}`);
                } else {
                  navigate(`/chat?id=${conversationId}`);
                }
              });
            },
          });

          playNotificationSound();

          notifyUser("Vous avez reçu un nouveau message");
        } else if (id === conversationId) {
          let data = await queryClient.getQueryData([
            "conversation",
            conversationId,
          ]);
          data = {
            ...data,
            messages: [...data.messages, message],
          };

          queryClient.setQueryData(["conversation", conversationId], data);
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

  return null; // Pas besoin de ToastContainer avec SweetAlert2
}
