import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Image,
  // Badge,
  Modal,
} from "react-bootstrap";
import { IoMdCheckmark } from "react-icons/io";
import { v4 as uuidv4 } from "uuid";
// import { BiImageAdd, BiXCircle } from "react-icons/bi";
// import { IoMdSend } from "react-icons/io";
// import { Picker as EmojiPicker } from "emoji-mart";
import WriterMessage from "../../components/common/conversation/WriterMessage";
import styled from "styled-components";
import { useQuery, useQueryClient } from "react-query";
import { addMessage, fetchConversation } from "../../api/apiConversation";
import { useSearchParams } from "react-router-dom";
import { FiClock } from "react-icons/fi";
import axios from "axios";
import UploadedImage from "../../components/common/conversation/UploadedImage";
import UploadedFile from "../../components/common/conversation/UploadedFile";
import { getToken } from "../../util/authUtils";
import { uploadFile } from "../../api/apiUpload";

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
// Utility function to check if the attachment is a file
const isFile = (attachment) => {
  const fileTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  return fileTypes.includes(attachment.mime);
};

const ChatWindow = ({ friend, onSendMessage, currentUserId, onBackToList }) => {
  const [searchQuery] = useSearchParams();
  const [newMessage, setNewMessage] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const messageEndRef = useRef(null);
  const id = searchQuery.get("id");
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [id, showEmojiPicker, uploadedImages]); // Use optional chaining to safely access messages

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() || uploadedImages.length > 0) {
      const messageToSend = {
        content: newMessage,
        images: uploadedImages.map((image) => ({ src: image })),
        senderId: currentUserId,
      };
      onSendMessage(friend.id, messageToSend);
      setNewMessage("");
      setUploadedImages([]);
      setShowEmojiPicker(false);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setNewMessage((prevMessage) => prevMessage + emoji.native);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImages((prevImages) => [...prevImages, reader.result]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (index) => {
    setUploadedImages((prevImages) =>
      prevImages.filter((_, idx) => idx !== index)
    );
  };

  const toggleImageModal = (image) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };
  const queryClient = useQueryClient();
  const { isLoading, data, error } = useQuery(
    ["conversation", searchQuery.get("id")],
    () => fetchConversation({ id: searchQuery.get("id") })
  );
  const handleSubmit = async (body) => {
    // Handle form submission here
    // console.log(body);
    // const config = {
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem("jwt")}`, // Attach the token as a Bearer token
    //   },
    // };
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
      // dispatch(onClearImages());
      // dispatch(onClearFile());
      const newMessages = body.message.map((file) => ({
        id: uuidv4(),
        type: body.type,
        message: null,
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
      console.log(newMessages);
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
    // else if (body.type === "VOICE") {
    //   const newMessages = {
    //     id: uuidv4(),
    //     type: body.type,
    //     message: null,
    //     file: body.message,
    //     member: {
    //       id: localStorage.getItem("id"),
    //       fullname: localStorage.getItem("fullname"),
    //       avatar: localStorage.getItem("avatar"),
    //     },
    //     createdAt: new Date(),
    //     status: "PENDING",
    //   };

    //   // const updated = [...data, newMessages];
    //   // setData(updated);
    // } else if (body.type === "IMAGES" || body.type === "FILES") {
    //   // dispatch(onClearImages());
    //   // dispatch(onClearFile());
    //   const newMessages = body.message.map((file) => ({
    //     id: uuidv4(),
    //     type: body.type,
    //     message: null,
    //     file: file.file,
    //     blobURL: body.type === "IMAGES" ? file.blobURL : null,
    //     member: {
    //       id: localStorage.getItem("id"),
    //       fullname: localStorage.getItem("fullname"),
    //       avatar: localStorage.getItem("avatar"),
    //     },
    //     createdAt: new Date(),
    //     status: "PENDING",
    //   }));

    //   // setData((prev) => [...prev, ...newMessages]);

    //   // const result = await uploadBlobUrlToStrapi(body.message);
    //   // axios
    //   //   .post(
    //   //     `${API_BASE_URL}/course-hub/message?course_hubId=${conversationId}`,
    //   //     {
    //   //       files: result.data,
    //   //       type: body.type,
    //   //     },
    //   //     config
    //   //   )
    //   //   .then((response) => {
    //   //     setTimeout(() => {
    //   //       setData((currentData) =>
    //   //         currentData.map((item) => {
    //   //           if (item.id === uuid) {
    //   //             item.status = "success";
    //   //             item.files = result.data;
    //   //             item.type = body.type;
    //   //           }
    //   //           return item;
    //   //         })
    //   //       );
    //   //     }, 1000);
    //   //   })
    //   //   .catch((error) => {
    //   //     console.log(error);
    //   //     const update = data.map((item) => {
    //   //       if (item.id === uuid) {
    //   //         item.status = "error";
    //   //       }
    //   //       return item;
    //   //     });
    //   //     setData(update);
    //   //   });
    // } else {
    //   alert("something wrong");
    // }
  };
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>error...</div>;

  return (
    <Container>
      <Card>
        <Card.Header>
          {AvatarWithName(data?.participants, data?.type, data?.currentUserId)}
          {/* <Button
            variant="outline-secondary"
            onClick={onBackToList}
            style={{
              float: "right",
              display: "inline-block",
              marginTop: "-5px",
            }}
          >
            Back to List
          </Button> */}
        </Card.Header>
        <Card.Body style={{ height: "70vh", overflowY: "auto" }}>
          {data?.messages?.map((message, index) => (
            <div
              key={index}
              className={`message ${
                message.senderId === currentUserId
                  ? "my-message"
                  : "frie nd-message"
              }`}
            >
              <p>{message.contenu}</p>
              <div style={{ float: "right" }}>
                {message?.status === "PENDING" ? (
                  <FiClock />
                ) : (
                  <IoMdCheckmark />
                )}
              </div>
              <PreUploadItem
                item={{
                  ...message,
                  type: message.type
                    ? message.type
                    : getFileType(message.attachement?.url),
                }}
                conversationId={searchQuery.get("id")}
                setUploaded={(e) => console.log(e)}
              />

              {/* {message.attachement?.map((item, idx) => (
                <div key={idx} style={{ marginBottom: "10px" }}>
                  {item.mime.startsWith("image/") ? (
                    <Image
                      src={API_BASE_URL + item.url}
                      alt="Message content"
                      style={{ maxWidth: "100%", cursor: "pointer" }}
                      onClick={() => toggleImageModal(API_BASE_URL + item.url)}
                    />
                  ) : (
                    isFile(item) && (
                      <a
                        href={item.url}
                        download
                        style={{ display: "inline-block", marginTop: "10px" }}
                      >
                        <button>Download File</button>
                      </a>
                    )
                  )}
                </div>
              ))} */}
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
          {/* <Form onSubmit={handleSendMessage}>
            {showEmojiPicker && <EmojiPicker onSelect={handleEmojiSelect} />}
            <Button
              variant="secondary"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              😊
            </Button>
            <Form.Control
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <input
              type="file"
              onChange={handleImageUpload}
              accept="image/*"
              style={{ display: "none" }}
              id="fileInput"
            />
            <label
              htmlFor="fileInput"
              style={{ cursor: "pointer", marginRight: 10 }}
            >
              <BiImageAdd />
            </label>
            {uploadedImages.map((image, index) => (
              <Badge
                key={index}
                style={{
                  cursor: "pointer",
                  position: "relative",
                  display: "inline-block",
                  marginRight: "5px",
                }}
              >
                <Image
                  src={image}
                  alt="Preview"
                  thumbnail
                  style={{ width: "100px" }}
                  onClick={() => toggleImageModal(image)}
                />
                <BiXCircle
                  color="red"
                  style={{
                    position: "absolute",
                    top: "0",
                    right: "0",
                    fontSize: "20px",
                    margin: "5px",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage(index);
                  }}
                />
              </Badge>
            ))}
            <Button type="submit">
              <IoMdSend />
            </Button>
          </Form> */}
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

function PreUploadItem({ item, setUploaded, conversationId }) {
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
        `${API_BASE_URL}/upload/`,
        formData,
        options
      );
      console.log(result.data[0]);
      axios
        .post(
          `${API_BASE_URL}/conversation/${conversationId}`,
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
            status: "success",
            file: result.data[0],
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
        file={item.file}
        progress={progress}
        status={status}
        source={source}
      />
    );
  if (item.type === "IMAGES")
    return (
      <UploadedImage
        url={
          item.status === "pending"
            ? item?.blobURL
            : process.env.REACT_APP_DOMAIN_BACKEND + item?.file?.url
        }
      />
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
  // background-color: #2386c8;
  // padding: 10px;
  // color: white;
  // width: 96%;
  // border-radius: 12px;
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
