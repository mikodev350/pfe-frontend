import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Card,
  Image,
  // Badge,
  Modal,
} from "react-bootstrap";
import { CiClock1 } from "react-icons/ci";
import { FiCheck } from "react-icons/fi";
import Moment from "react-moment";
import { v4 as uuidv4 } from "uuid";
import WriterMessage from "../../components/common/conversation/WriterMessage";
import styled from "styled-components";
import { useQuery, useQueryClient } from "react-query";
import { addMessage, fetchConversation } from "../../api/apiConversation";
import { useSearchParams } from "react-router-dom";

import axios from "axios";
import UploadedImage from "../../components/common/conversation/UploadedImage";
import UploadedFile from "../../components/common/conversation/UploadedFile";
import { getToken } from "../../util/authUtils";
import { useAppDispatch } from "../../hooks/hooks";
import { onClearFile, onClearImages } from "../../redux/features/upload-slice";
import { useSelector } from "react-redux";

const API_BASE_URL = "http://localhost:1337";

const AvatarWithName = (participants, type, id) => {
  let imageUrl = "";
  let name = "";
  if (type === "PRIVATE") {
    const usersFiltered = participants.filter((item) => item.id !== id);

    const {
      username,
      profil: {
        photoProfil: { url },
      },
    } = usersFiltered[0];
    name = username;
    imageUrl = API_BASE_URL + url;
  }
  return (
    <ItemCard>
      <Image
        style={{ width: "40px", height: "40px", borderRadius: "100%" }}
        src={imageUrl}
      />
      <div> {name}</div>{" "}
    </ItemCard>
  );
};
const ItemCard = styled.div`
  display: grid;
  grid-template-columns: 50px auto;
  gap: 15px;
`;

const ChatWindow = ({ friend, onSendMessage, currentUserId, onBackToList }) => {
  const [searchQuery] = useSearchParams();

  const [uploadedImages] = useState([]);
  const [showEmojiPicker] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const messageEndRef = useRef(null);
  const id = searchQuery.get("id");
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [id, showEmojiPicker, uploadedImages]); // Use optional chaining to safely access messages

  const toggleImageModal = (image) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { isLoading, data, error } = useQuery(
    ["conversation", searchQuery.get("id")],
    () => fetchConversation({ id: searchQuery.get("id") })
  );
  const handleSubmit = async (body) => {
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
      //setData((prev) => [...prev, newMessages]);
      let data = await queryClient.getQueryData([
        "conversation",
        searchQuery.get("id"),
      ]);
      data = {
        ...data,
        messages: [...data.messages, newMessages],
      };
      queryClient.setQueryData(["conversation", searchQuery.get("id")], {
        ...data,
      });
      //here we need to add new message using react query
      const result = await addMessage({
        data: {
          ...form,
          id: searchQuery.get("id"),
          fakeId: newMessages.id,
        },
      });
      data.messages = data?.messages?.map((item) => {
        if (item.id === result.fakeId) {
          item.status = "success";
        }
        return item;
      });

      queryClient.setQueryData(["conversation", searchQuery.get("id")], {
        ...data,
      });

      // wee need to update it
      console.log(result);
      // axios
      //   .post(
      //     `${API_BASE_URL}/course-hub/message?course_hubId=${conversationId}`,
      //     form,
      //     config
      //   )
      //.then((response) => {
      //   setTimeout(() => {
      // setData((currentData) =>
      //   currentData.map((item) => {
      //     if (item.id === uuid) {
      //       item.status = "success";
      //     }
      //     return item;
      //   })
      // );
      //   }, 1000);
      //  })
      // .catch((error) => {
      // const update = data.map((item) => {
      //   if (item.id === uuid) {
      //     item.status = "error";
      //   }
      //   return item;
      // });
      // setData(update);
      // });
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

      let data = await queryClient.getQueryData([
        "conversation",
        searchQuery.get("id"),
      ]);
      console.log(data);
      data = {
        ...data,
        messages: [...data.messages, ...newMessages],
      };
      console.log(data);
      queryClient.setQueryData(["conversation", searchQuery.get("id")], {
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
      let data = await queryClient.getQueryData([
        "conversation",
        searchQuery.get("id"),
      ]);
      data = {
        ...data,
        messages: [...data.messages, newMessages],
      };
      queryClient.setQueryData(["conversation", searchQuery.get("id")], {
        ...data,
      });

      // const updated = [...data, newMessages];
    }
    messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  };
  const setUploaded = React.useCallback(async (targetItem) => {
    console.log(targetItem);
    let data = await queryClient.getQueryData([
      "conversation",
      searchQuery.get("id"),
    ]);
    console.log(data);
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
    console.log(data);
    queryClient.setQueryData(["conversation", searchQuery.get("id")], {
      ...data,
    });
  }, []);

  const { socket } = useSelector((state) => state.socket);

  React.useEffect(() => {
    if (socket) {
      // Create a socket connection
      socket?.on("newMessage", async ({ message }) => {
        let data = await queryClient.getQueryData([
          "conversation",
          searchQuery.get("id"),
        ]);
        console.log(data);
        data = {
          ...data,
          messages: [...data.messages, message],
        };

        queryClient.setQueryData(["conversation", searchQuery.get("id")], {
          ...data,
        });
        // formik.setFieldTouched("message", false); // Disable field touched status
        // formik.setFieldValue("message", ""); // Reset field value
        // const newMessage = {
        //   createdAt: new Date(),
        //   message: message,
        //   member: {
        //     fullname: localStorage.getItem("fullname"),
        //   },
        // };
        //setData((prev) => [...prev, newMessage]);
      });
      return () => {
        socket?.off("newMessage");
      };
    }
  }, [socket]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>error...</div>;

  return (
    <Container>
      <Card>
        <Card.Header>
          {AvatarWithName(data?.participants, data?.type, data?.currentUserId)}
        </Card.Header>
        <Card.Body style={{ height: "70vh", overflowY: "auto" }}>
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
                  <p color="text.muted" style={{ padding: "0px 0px 10px 0" }}>
                    <h5 color="gray.700" mb="10px" lineHeight="1.3">
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
                    conversationId={searchQuery.get("id")}
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
          <div ref={messageEndRef} />
        </Card.Body>
        <Card.Footer>
          <ActionSection>
            <TextAreaStylled>
              <WriterMessage createMessage={handleSubmit} />
            </TextAreaStylled>
          </ActionSection>
        </Card.Footer>
      </Card>
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
    </Container>
  );
};

export default ChatWindow;

async function blobToFile(blobUrl, filename) {
  // Fetch the Blob from the Blob URL
  const response = await fetch(blobUrl);
  const blob = await response.blob();

  // Create a File object from the Blob
  const file = new File([blob], filename, { type: blob.type });

  return file;
}

async function uploadToStrapi(file) {
  // Create a FormData object and append the file to it
  const formData = new FormData();
  formData.append("files", file);
  const options = {
    headers: {
      //"Content-Type": selectedFile.type,
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${getToken()}`, // Attach the token as a Bearer token
    },
  };

  const response = await axios.post(
    `${process.env.REACT_APP_API_BASE_URL}/upload/`,
    formData,
    options
  );
  // The result should contain the uploaded file's information
  console.log("File uploaded successfully:", response);

  // Return the result containing information about the uploaded file
  return response;
}

// Usage example:
async function uploadBlobUrlToStrapi(blobUrl) {
  // Convert the Blob URL to a File object
  const file = await blobToFile(blobUrl, "audio.ogg");

  // Upload the File object to Strapi
  const uploadResult = await uploadToStrapi(file);

  // Handle the upload result as needed
  return uploadResult;
}

function PreUploadItem({ item, setUploaded, conversationId, onClick }) {
  const [progress, setProgress] = React.useState(0);
  const [status, setStatus] = React.useState(null);
  const [source, setsource] = React.useState();
  const init = async () => {
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
      console.log(item);
      setStatus("UPLOADING");
      setsource(controller);

      const formData = new FormData();
      formData.append("files", item.file);
      const options = {
        headers: {
          //"Content-Type": selectedFile.type,
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`, // Attach the token as a Bearer token
        },
        signal: controller.signal,
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percentageProgress = Math.floor((loaded / total) * 100);
          console.log(percentageProgress);
          setProgress(percentageProgress);
          //setUploaded(false);
        },
      };

      const result = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/upload/`,
        formData,
        options
      );
      console.log(result.data[0]);
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
  };
  React.useEffect(() => {
    if (
      item.status === "PENDING" &&
      (item.type === "FILES" || item.type === "VOICE" || item.type === "IMAGES")
    ) {
      init();
    }
  }, [item, conversationId]);

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
      <>
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
      </>
    );
  return null;
}

function getFileType(url) {
  if (!url) return "TEXT";
  // Extract the file extension from the URL
  const extension = url.split(".").pop().toLowerCase();

  // Define file type categories
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
const TextAreaStylled = styled.div`
  /* On small screens, make the element fixed at the bottom */
  background-color: white;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;

  /* On larger screens, revert the position to static (normal positioning) */
  @media (min-width: 778px) {
    // margin-top: 220px;
    position: static;
  }
`;

const ItemMessage = styled.div`
  display: grid;
  grid-template-columns: 45px auto;
  gap: 20px;
  // background-color: white;
  margin: 20px 0px 0px 0px;
  padding: 10px;
`;
