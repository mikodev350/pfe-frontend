import React, { useState, useEffect, useRef, useCallback } from "react";
import { Container, Card, Image, Modal, Form, Button } from "react-bootstrap";
import { CiClock1 } from "react-icons/ci";
import { FiCheck } from "react-icons/fi";
import Moment from "react-moment";
import { v4 as uuidv4 } from "uuid";
import WriterMessage from "../../components/common/conversation/WriterMessage";
import styled from "styled-components";
import { useQuery, useQueryClient } from "react-query";
import {
  addMessage,
  fetchConversation,
  removeParticipant,
  fetchFriends,
} from "../../api/apiConversation";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import UploadedImage from "../../components/common/conversation/UploadedImage";
import UploadedFile from "../../components/common/conversation/UploadedFile";
import { getToken } from "../../util/authUtils";
import { useAppDispatch } from "../../hooks/hooks";
import { onClearFile, onClearImages } from "../../redux/features/upload-slice";
import { useSelector } from "react-redux";
import Select from "react-select";
import AddParticipantModal from "../../components/add-participant-modal/AddParticipantModal";
import { FaUserPlus, FaUserMinus } from "react-icons/fa";
import { notifyUser } from "../../util/PopUpNotification";

const API_BASE_URL = "http://localhost:1337";

const ItemCard = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const AvatarWithName = (participants, type, id, title, imageUrl) => {
  let displayName = title || "";
  let displayImage = imageUrl || "https://avatars.hsoubcdn.com/default?s=128";

  if (type === "PRIVATE") {
    const usersFiltered = participants.filter((item) => item.id !== id);
    const { username, profil: { photoProfil: { url } = {} } = {} } =
      usersFiltered[0];
    displayName = username;
    displayImage = url ? API_BASE_URL + url : displayImage;
  }

  return (
    <ItemCard>
      <Image
        style={{ width: "40px", height: "40px", borderRadius: "100%" }}
        src={displayImage}
      />
      <div>{displayName}</div>
    </ItemCard>
  );
};

const ChatWindow = ({
  id,
}) => {
  const [searchParams] = useSearchParams();
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAddParticipantModal, setShowAddParticipantModal] = useState(false);
  const [showRemoveParticipantModal, setShowRemoveParticipantModal] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [friendsOptions, setFriendsOptions] = useState([]);
  const messageEndRef = useRef(null);
  const scrollableContainerRef = useRef(null);

  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (scrollableContainerRef.current) {
      scrollableContainerRef.current.scrollTo({
        top: scrollableContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  const toggleImageModal = (image) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  useEffect(() => {
    const loadFriends = async () => {
      try {
        const friends = await fetchFriends();
        const options = friends.map((friend) => ({
          value: friend.id,
          label: friend.username,
        }));
        setFriendsOptions(options);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };
    loadFriends();
  }, []);

  const { isLoading, data, error } = useQuery(["conversation", id], () =>
    fetchConversation({ id: id })
  );

  const handleRemoveParticipant = async () => {
    try {
      await removeParticipant({
        conversationId: id,
        userId: selectedUser.value,
      });
      queryClient.invalidateQueries(["conversation", id]);
      setShowRemoveParticipantModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error removing participant:", error);
    }
  };

  const handleSubmit = async (body) => {
    if (scrollableContainerRef.current) {
      scrollableContainerRef.current.scrollTo({
        top: scrollableContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
    if (body.type === "TEXT") {
      const form = {
        message: body.message,
        type: body.type,
      };
      const uuid = uuidv4();
      const newMessages = {
        id: uuid,
        type: body.type,
        contenu: body.message,
        member: {
          id: localStorage.getItem("id") || "default",
          fullname: localStorage.getItem("fullname") || "default",
          avatar: localStorage.getItem("avatar") || "default",
        },
        createdAt: new Date(),
        status: "PENDING",
      };

      let data = await queryClient.getQueryData(["conversation", id]);
      data = {
        ...data,
        messages: [...data.messages, newMessages],
      };
      queryClient.setQueryData(["conversation", id], {
        ...data,
      });

      const result = await addMessage({
        data: {
          ...form,
          id: id,
          fakeId: newMessages.id,
        },
      });
      data.messages = data?.messages?.map((item) => {
        if (item.id === result.fakeId) {
          item.status = "success";
        }
        return item;
      });

      queryClient.setQueryData(["conversation", id], {
        ...data,
      });
    } else if (body.type === "IMAGES" || body.type === "FILES") {
      dispatch(onClearImages());
      dispatch(onClearFile());
      const newMessages = body.message.map((file) => ({
        id: uuidv4(),
        type: body.type,
        contenu: null,
        attachement: file.file,
        file: file.file,
        blobURL: body.type === "IMAGES" ? file.blobURL : null,
        member: {
          id: localStorage.getItem("id"),
          fullname: localStorage.getItem("fullname"),
          avatar: localStorage.getItem("avatar"),
        },
        createdAt: new Date(),
        status: "PENDING",
      }));

      let data = await queryClient.getQueryData(["conversation", id]);
      data = {
        ...data,
        messages: [...data.messages, ...newMessages],
      };
      queryClient.setQueryData(["conversation", id], {
        ...data,
      });
    } else if (body.type === "VOICE") {
      const newMessages = {
        id: uuidv4(),
        type: body.type,
        message: null,
        file: body.message,
        member: {
          id: localStorage.getItem("id"),
          fullname: localStorage.getItem("fullname"),
          avatar: localStorage.getItem("avatar"),
        },
        createdAt: new Date(),
        status: "PENDING",
      };
      let data = await queryClient.getQueryData(["conversation", id]);
      data = {
        ...data,
        messages: [...data.messages, newMessages],
      };
      queryClient.setQueryData(["conversation", id], {
        ...data,
      });
    }
  };

  const setUploaded = useCallback(
    async (targetItem) => {
      let data = await queryClient.getQueryData(["conversation", id]);
      if (!data) {
        console.error("No data found for conversation");
        return;
      }
      data = {
        ...data,
        messages: data.messages.map((item) => {
          if (item.id === targetItem.id) {
            item.status = "success";
            item.attachement = targetItem.attachement;
          }
          return item;
        }),
      };
      queryClient.setQueryData(["conversation", id], {
        ...data,
      });
    },
    [queryClient, searchParams]
  );

  const { socket } = useSelector((state) => state.socket);

  const init = useCallback(async () => {
    // Implementation of init function
  }, []);

  useEffect(() => {
    if (socket) {
      socket?.on("newMessage", async ({ message }) => {
        let data = await queryClient.getQueryData(["conversation", id]);
        if (!data) {
          console.error("No data found for conversation");
          return;
        }
        data = {
          ...data,
          messages: [...data.messages, message],
        };

        queryClient.setQueryData(["conversation", id], {
          ...data,
        });
        if (scrollableContainerRef.current) {
          scrollableContainerRef.current.scrollTo({
            top: scrollableContainerRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      });
      return () => {
        socket?.off("newMessage");
      };
    }
  }, [socket, queryClient, searchParams]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error...</div>;

  const isAdmin =
    data?.type === "GROUP" && data?.admin?.id === data?.currentUserId;

  return (
    <Container>
      <StyledCard>
        <StyledCardHeader>
          {AvatarWithName(
            data?.participants,
            data?.type,
            data?.currentUserId,
            data?.titre,
            data?.imageUrl
          )}
          {data?.type === "GROUP" && isAdmin && (
            <IconContainer>
              <FaUserPlus
                style={{ cursor: "pointer" }}
                onClick={() => setShowAddParticipantModal(true)}
              />
              <FaUserMinus
                style={{ cursor: "pointer", marginLeft: "10px" }}
                onClick={() => setShowRemoveParticipantModal(true)}
              />
            </IconContainer>
          )}
        </StyledCardHeader>
        <StyledCardBody>
          <div
            ref={scrollableContainerRef}
            style={{
              minHeight: "350px",
              overflowY: "auto",
              maxHeight: window.innerWidth > 900 ? "400px" : "80vh",
            }}
          >
            {data?.messages?.map((message, index) => (
              <div key={index}>
                <ItemMessage>
                  <img
                    src={
                      message?.expediteur?.profil?.photoProfil?.url
                        ? API_BASE_URL +
                          message?.expediteur?.profil?.photoProfil?.url
                        : "https://avatars.hsoubcdn.com/default?s=128"
                    }
                    alt=""
                    style={{ width: "100%" }}
                  />
                  <div>
                    <p style={{ padding: "0px 0px 10px 0" }}>
                      <h5 style={{ marginBottom: "10px" }}>
                        {message?.expediteur?.username}
                      </h5>
                    </p>
                    <PreUploadItem
                      item={{
                        ...message,
                        type: message.type
                          ? message.type
                          : getFileType(message.attachement?.url),
                      }}
                      conversationId={searchParams.get("id")}
                      setUploaded={setUploaded}
                      onClick={toggleImageModal}
                    />
                  </div>
                </ItemMessage>
                <div style={{ textAlign: "right" }}>
                  {message.status === "PENDING" ? <CiClock1 /> : <FiCheck />}{" "}
                  <Moment format="hh:mm">{new Date(message.createdAt)}</Moment>
                </div>
              </div>
            ))}
          </div>
        </StyledCardBody>
        <StyledCardFooter>
          <ActionSection>
            <TextAreaStyled>
              <WriterMessage createMessage={handleSubmit} />
            </TextAreaStyled>
          </ActionSection>
        </StyledCardFooter>
      </StyledCard>
      <Modal
        show={showImageModal}
        onHide={() => setShowImageModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Image Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Image
            src={selectedImage}
            alt="Enlarged content"
            style={{ width: "100%" }}
          />
        </Modal.Body>
      </Modal>
      <AddParticipantModal
        show={showAddParticipantModal}
        handleClose={() => setShowAddParticipantModal(false)}
        conversationId={searchParams.get("id")}
        currentParticipants={data?.participants}
      />
      <Modal
        show={showRemoveParticipantModal}
        onHide={() => setShowRemoveParticipantModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Remove Participant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formParticipants">
            <Form.Label>Select Participant</Form.Label>
            <Select
              options={data?.participants.map((participant) => ({
                value: participant.id,
                label: participant.username,
              }))}
              value={selectedUser}
              onChange={setSelectedUser}
              placeholder="Select participant..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowRemoveParticipantModal(false)}
          >
            Close
          </Button>
          <Button variant="danger" onClick={handleRemoveParticipant}>
            Remove Participant
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ChatWindow;

async function blobToFile(blobUrl, filename) {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  const file = new File([blob], filename, { type: blob.type });
  return file;
}

async function uploadToStrapi(file) {
  const formData = new FormData();
  formData.append("files", file);
  const options = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${getToken()}`,
    },
  };
  const response = await axios.post(
    `${process.env.REACT_APP_API_BASE_URL}/upload/`,
    formData,
    options
  );
  console.log("File uploaded successfully:", response);
  return response;
}

async function uploadBlobUrlToStrapi(blobUrl) {
  const file = await blobToFile(blobUrl, "audio.ogg");
  const uploadResult = await uploadToStrapi(file);
  return uploadResult;
}

function PreUploadItem({ item, setUploaded, conversationId, onClick }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(null);
  const [source, setSource] = useState();
  const init = useCallback(async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    };
    if (item.type === "VOICE") {
      const result = await uploadBlobUrlToStrapi(item.file);
      axios
        .post(
          `${API_BASE_URL}/api/conversation/${conversationId}`,
          {
            data: {
              file: result.data[0],
              type: item.type,
              fakeId: item.id,
            },
          },
          config
        )
        .then((response) => {
          setUploaded({
            id: item.id,
            status: "success",
            file: result.data[0],
            type: item.type,
          });
        })
        .catch((error) => {});
    } else {
      const controller = new AbortController();
      setStatus("UPLOADING");
      setSource(controller);
      const formData = new FormData();
      formData.append("files", item.file);
      const options = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
        signal: controller.signal,
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percentageProgress = Math.floor((loaded / total) * 100);
          setProgress(percentageProgress);
        },
      };
      const result = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/upload/`,
        formData,
        options
      );
      axios
        .post(
          `${process.env.REACT_APP_API_BASE_URL}/conversation/${conversationId}`,
          {
            data: {
              file: result.data[0],
              type: item.type,
              fakeId: item.id,
            },
          },
          config
        )
        .then((response) => {
          setStatus("UPLOADED");
          setUploaded({
            ...item,
            id: item.id,
            status: "success",
            attachement: result.data[0],
            type: item.type,
          });
        })
        .catch((error) => {});
    }
  }, [item, conversationId, setUploaded]);

  useEffect(() => {
    if (
      item.status === "PENDING" &&
      (item.type === "FILES" || item.type === "VOICE" || item.type === "IMAGES")
    ) {
      init();
    }
  }, [item, init]);

  if (item.type === "FILES")
    return (
      <UploadedFile
        file={item.attachement}
        progress={progress}
        status={status}
        source={source}
      />
    );
  if (item.type === "TEXT") return <ItemText>{item?.contenu}</ItemText>;
  if (item.type === "IMAGES")
    return (
      <div
        onClick={() =>
          onClick(
            item.status === "PENDING"
              ? item?.blobURL
              : process.env.REACT_APP_UPLOAD + item?.attachement?.url
          )
        }
      >
        <UploadedImage
          url={
            item.status === "PENDING"
              ? item?.blobURL
              : process.env.REACT_APP_UPLOAD + item?.attachement?.url
          }
        />
      </div>
    );
  if (item.type === "VOICE")
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#dee1e6",
          borderRadius: 15,
          padding: "0px 20px",
        }}
      >
        <audio
          className="audio-player audio-player-message "
          controls
          src={
            item.status === "pending"
              ? item?.file
              : process.env.REACT_APP_UPLOAD + item?.attachement?.url
          }
          type="audio/ogg"
          style={{ marginLeft: 10 }}
        />
      </div>
    );
  return null;
}

function getFileType(url) {
  if (!url) return "TEXT";
  const extension = url.split(".").pop().toLowerCase();
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
  const audioExtensions = ["ogg"];
  if (imageExtensions.includes(extension)) {
    return "IMAGES";
  } else if (audioExtensions.includes(extension)) {
    return "VOICE";
  } else {
    return "FILES";
  }
}
const ItemText = styled.div`
  background-color: #2386c8;
  padding: 10px;
  color: white;
  width: 96%;
  border-radius: 12px;
`;

const ActionSection = styled.div`
  position: relative;
`;


const ItemMessage = styled.div`
  display: grid;
  grid-template-columns: 45px auto;
  gap: 20px;
  margin: 20px 0px 0px 0px;
  padding: 10px;
`;
const StyledCard = styled(Card)`
  width: 100%;  /* Prendre toute la largeur */
  max-width: 100%; /* S'assurer que la carte occupe bien 100% */
  height: 650px !important; 
  margin: 0;  /* Supprimer les marges externes */
  border-radius: 0; /* Supprimer les bords arrondis pour un look plein écran */
  box-shadow: none; /* Supprimer l'ombre si non nécessaire */
  display: flex;
  flex-direction: column;
  height: 100vh; /* Prendre toute la hauteur de l'écran */
  position: relative;
`;

const StyledCardHeader = styled(Card.Header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.5rem; /* Increase the font size */
  height: 60px;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`;

const StyledCardBody = styled(Card.Body)`
  background-color: #ffffff;  /* Fond blanc */
  padding: 20px;  /* Ajout de padding pour l'espacement interne */
  flex-grow: 1;  /* Prendre l'espace restant */
  overflow-y: auto;  /* Activer le défilement */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);  /* Légère ombre */
`;


const StyledCardFooter = styled(Card.Footer)`
  background-color: #ffffff;  /* Fond blanc */
  padding: 20px;  /* Ajout de padding pour l'espacement interne */
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); 

  @media (max-width: 768px) {
    position: sticky; /* Sticky seulement sur les téléphones */
    bottom: 0;
    z-index: 10;
  }

  @media (min-width: 769px) {
    position: static; /* Comportement normal sur les écrans plus grands */
  }
`;


const TextAreaStyled = styled.div`
  background-color: white;
  width: 100%;
  padding: 10px;
  position: sticky; /* Permet de rester collé au bas */
  bottom: 0;
  z-index: 10;
  @media (min-width: 778px) {
    position: static;
}`;