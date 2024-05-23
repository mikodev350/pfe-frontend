import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Image,
  Badge,
  Modal,
} from "react-bootstrap";
import { BiImageAdd, BiXCircle } from "react-icons/bi";
import { IoMdSend } from "react-icons/io";
import { Picker as EmojiPicker } from "emoji-mart";
import WriterMessage from "../../components/common/conversation/WriterMessage";
import styled from "styled-components";

const ChatWindow = ({ friend, onSendMessage, currentUserId, onBackToList }) => {
  const [newMessage, setNewMessage] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [friend?.messages, showEmojiPicker, uploadedImages]); // Use optional chaining to safely access messages

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
  const handleSubmit = async (body) => {};

  if (!friend) {
    // Handle undefined friend object gracefully
    return (
      <Container>
        <h2>Loading friend data...</h2>
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <Card.Header>
          Conversation with {friend.name}
          <Button
            variant="outline-secondary"
            onClick={onBackToList}
            style={{
              float: "right",
              display: "inline-block",
              marginTop: "-5px",
            }}
          >
            Back to List
          </Button>
        </Card.Header>
        <Card.Body style={{ maxHeight: "500px", overflowY: "auto" }}>
          {friend.messages.map((message, index) => (
            <div
              key={index}
              className={`message ${
                message.senderId === currentUserId
                  ? "my-message"
                  : "friend-message"
              }`}
            >
              <p>{message.content}</p>
              {message.images?.map((image, idx) => (
                <Image
                  key={idx}
                  src={image.src}
                  alt="Message content"
                  style={{ maxWidth: "100%", cursor: "pointer" }}
                  onClick={() => toggleImageModal(image.src)}
                />
              ))}
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
    margin-top: 220px;
    position: static;
  }
`;
