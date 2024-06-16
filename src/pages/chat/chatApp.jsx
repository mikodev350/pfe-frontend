import React, { useState } from "react";
import { Container, Row, Col, ListGroup, Image } from "react-bootstrap";
import ChatWindow from "./ChatWindow"; // Ensure the path to ChatWindow is correct
import "./ChatApp.css"; // Importing custom CSS
import { useQuery } from "react-query";
import { fetchConversations } from "../../api/apiConversation";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = "http://localhost:1337";

const AvatarWithName = (participants, type, id) => {
  let imageUrl = "";
  let name = "";
  if (type === "PRIVATE") {
    const usersFiltered = participants.filter((item) => item.id !== id);
    console.log("usersFiltered");
    console.log(usersFiltered);
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

const ChatApp = () => {
  const handleSendMessage = (friendId, message) => {};
  const navigate = useNavigate();
  const handleShowConversation = (id) => {
    navigate(`/chat?id=${id}`);
  };

  const { isLoading, data, error } = useQuery(["conversation"], () =>
    fetchConversations()
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>error...</div>;

  return (
    <Container>
      <h1>Chat Application</h1>
      <Row>
        <Col md={4}>
          <ListGroup>
            {data?.conversations?.map((item) => (
              <ListGroup.Item
                key={item.id}
                //active={item.id === selectedFriendId}
                onClick={() => handleShowConversation(item.id)}
                className="friend-list-item"
              >
                {AvatarWithName(
                  item.participants,
                  item.type,
                  data?.currentUserId
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col md={8}>
          <ChatWindow onSendMessage={handleSendMessage} />
        </Col>
      </Row>
    </Container>
  );
};

export default ChatApp;
const ItemCard = styled.div`
  padding: 20px;
  display: grid;
  grid-template-columns: 50px auto;
  gap: 15px;
`;
