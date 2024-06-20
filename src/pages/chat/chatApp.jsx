import React, { useState } from "react";
import { Container, Row, Col, ListGroup, Image, Tabs, Tab } from "react-bootstrap";
import ChatWindow from "./ChatWindow"; // Ensure the path to ChatWindow is correct
import "./ChatApp.css"; // Importing custom CSS
import { useQuery } from "react-query";
// import { fetchPrivateConversations, fetchGroupConversations } from "../../api/apiService";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { Helmet } from "react-helmet";
import CreateModelGroupe from "../../components/create-groupe/Create-model-groupe";
import { fetchGroupConversations, fetchPrivateConversations } from "../../api/apiConversation";
const API_BASE_URL = "http://localhost:1337";

const AvatarWithName = (participants, type, id, title) => {
  let imageUrl = "";
  let name = title;
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
      <div>{name}</div>
    </ItemCard>
  );
};

const ChatApp = () => {
  const handleSendMessage = (friendId, message) => {};
  const navigate = useNavigate();
  const handleShowConversation = (id) => {
    navigate(`/chat?id=${id}`);
  };

  const {
    isLoading: isLoadingPrivate,
    data: dataPrivate,
    error: errorPrivate
  } = useQuery(["privateConversations"], fetchPrivateConversations);

  const {
    isLoading: isLoadingGroup,
    data: dataGroup,
    error: errorGroup
  } = useQuery(["groupConversations"], fetchGroupConversations);

  if (isLoadingPrivate || isLoadingGroup) return <div>Loading...</div>;
  if (errorPrivate || errorGroup) return <div>Error...</div>;

  return (
    <>
      <Helmet>
        <link rel="stylesheet" type="text/css" href="/css/chatStyle.css" />
      </Helmet>
      <Layout>
        <Container>
          <h1>Chat Application</h1>
          <Row>
            <Col md={4}>
              <CreateModelGroupe />
              <Tabs defaultActiveKey="private" className="mb-3">
                <Tab eventKey="private" title="Private">
                  <ListGroup>
                    {dataPrivate?.conversations?.map((item) => (
                      <ListGroup.Item
                        key={item.id}
                        onClick={() => handleShowConversation(item.id)}
                        className="friend-list-item"
                      >
                        {AvatarWithName(
                          item.participants,
                          item.type,
                          dataPrivate?.currentUserId
                        )}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Tab>
                <Tab eventKey="group" title="Group">
                  <ListGroup>
                    {dataGroup?.conversations?.map((item) => (
                      <ListGroup.Item
                        key={item.id}
                        onClick={() => handleShowConversation(item.id)}
                        className="friend-list-item"
                      >
                        {AvatarWithName(
                          item.participants,
                          item.type,
                          dataGroup?.currentUserId,
                          item.titre // Pass the title for group conversations
                        )}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Tab>
              </Tabs>
            </Col>
            <Col md={8}>
              <ChatWindow onSendMessage={handleSendMessage} />
            </Col>
          </Row>
        </Container>
      </Layout>
    </>
  );
};

export default ChatApp;

const ItemCard = styled.div`
  padding: 20px;
  display: grid;
  grid-template-columns: 50px auto;
  gap: 15px;
`;
