import React, { useState } from "react";
import { Container, Row, Col, ListGroup, Image, Tabs, Tab, Button } from "react-bootstrap";
import ChatWindow from "./ChatWindow"; // Ensure the path to ChatWindow is correct
import { useQuery } from "react-query";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { Helmet } from "react-helmet";
import CreateModelGroupe from "../../components/create-groupe/Create-model-groupe"; // Ensure the path to CreateModelGroupe is correct
import { fetchGroupConversations, fetchPrivateConversations } from "../../api/apiConversation";

const API_BASE_URL = "http://localhost:1337";
const GROUP_IMAGE_URL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxUv4CmCk5Vn_z61JnwvIzcdzDuJjZYd9ZxA&s";

// const AvatarWithName = (participants, type, id, title) => {
//   let imageUrl = "";
//   let name = title;
//   let url = GROUP_IMAGE_URL;
//   if (type === "PRIVATE") {
//     const usersFiltered = participants.filter((item) => item.id !== id);
//     const { username, profil: { photoProfil: { url } = {} } = {} } = usersFiltered[0];
//     name = username;
//     imageUrl = API_BASE_URL + url;
//   } else if (type === "GROUP") {
//     imageUrl = GROUP_IMAGE_URL;
//   }
//   return (
//     <ItemCard>
//       <AvatarImage src={imageUrl} />
//       <div>{name}</div>
//     </ItemCard>
//   );
// };


const AvatarWithName = ({ participants, type, id, title }) => {
  let imageUrl = "";
  let name = title;

  if (type === "PRIVATE") {
    const usersFiltered = participants.filter((item) => item.id !== id);
    
    if (usersFiltered.length > 0) {
      const { username, profil: { photoProfil: { url } = {} } = {} } = usersFiltered[0];
      name = username;
      imageUrl = API_BASE_URL + (url || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6LXNJFTmLzCoExghcATlCWG85kI8dsnhJng&s');
    } else {
      // Si aucun autre utilisateur n'est trouvé, vous pouvez définir une image par défaut ou gérer autrement
      imageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6LXNJFTmLzCoExghcATlCWG85kI8dsnhJng&s';
    }
  } else if (type === "GROUP") {
    imageUrl = GROUP_IMAGE_URL;
  }

  return (
    <ItemCard>
      <AvatarImage src={imageUrl} />
      <div>{name}</div>
    </ItemCard>
  );
};


const ChatApp = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const navigate = useNavigate();
  const handleShowConversation = (id) => {
    setSelectedConversation(id);
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
    navigate(`/chat?id=${id}`);
  };

  const { isLoading: isLoadingPrivate, data: dataPrivate, error: errorPrivate } = useQuery(
    ["privateConversations"],
    fetchPrivateConversations
  );

  const { isLoading: isLoadingGroup, data: dataGroup, error: errorGroup } = useQuery(
    ["groupConversations"],
    fetchGroupConversations
  );

  if (isLoadingPrivate || isLoadingGroup) return <div>Loading...</div>;
  if (errorPrivate || errorGroup) return <div>Error...</div>;

  return (
    <>
      <Helmet>
        <link rel="stylesheet" type="text/css" href="/css/chatStyle.css" />
      </Helmet>
      <Layout>
        <StyledContainer>
          <Row>
            <Col md={4} className={`sidebar ${showSidebar ? "show" : ""}`}>
              <StyledCreateGroupButton onClick={() => {}}>
                Create Group
              </StyledCreateGroupButton>
              <StyledTabs defaultActiveKey="private">
                <StyledTab eventKey="private" title="Private">
                  <StyledListGroup>
                    {dataPrivate?.conversations?.map((item) => (
                      <StyledListGroupItem
                        key={item.id}
                        onClick={() => handleShowConversation(item.id)}
                      >
                        {AvatarWithName(
                          item.participants,
                          item.type,
                          dataPrivate?.currentUserId
                        )}
                      </StyledListGroupItem>
                    ))}
                  </StyledListGroup>
                </StyledTab>
                <StyledTab eventKey="group" title="Group">
                  <StyledListGroup>
                    {dataGroup?.conversations?.map((item) => (
                      <StyledListGroupItem
                        key={item.id}
                        onClick={() => handleShowConversation(item.id)}
                      >
                        {AvatarWithName(
                          item.participants,
                          item.type,
                          dataGroup?.currentUserId,
                          item.titre // Pass the title for group conversations
                        )}
                      </StyledListGroupItem>
                    ))}
                  </StyledListGroup>
                </StyledTab>
              </StyledTabs>
            </Col>
            <Col md={8}>
              {selectedConversation ? (
                <ChatWindow />
              ) : (
                <PlaceholderText>Select a conversation to start chatting</PlaceholderText>
              )}
            </Col>
          </Row>
          <ToggleButton onClick={() => setShowSidebar(!showSidebar)}>
            {showSidebar ? "Hide" : "Show"} Sidebar
          </ToggleButton>
        </StyledContainer>
      </Layout>
    </>
  );
};

export default ChatApp;

const StyledContainer = styled(Container)`
  margin-top: 20px;
  position: relative;

  .sidebar {
    display: none;
  }

  @media (min-width: 768px) {
    .sidebar {
      display: block;
    }
  }

  @media (max-width: 767px) {
    .sidebar.show {
      display: block;
      position: absolute;
      z-index: 1000;
      background: white;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      padding: 20px;
    }
  }
`;

const ChatHeader = styled.h1`
  text-align: center;
  margin-bottom: 20px;
  font-size: 2.5rem;
  color: #007bff;
`;

const StyledCreateGroupButton = styled(Button)`
  margin-bottom: 15px;
  background-color: #007bff;
  border: none;
  font-size: 0.9rem;
  padding: 8px 12px;
  border-radius: 20px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const StyledTabs = styled(Tabs)`
  display: flex;
  justify-content: space-between; /* Center align tabs */
  .nav-item {
    flex: 1;
  }
  .nav-link {
    color: #007bff;
    padding: 0.5rem 1rem; /* Adjust padding to make tabs smaller */
    font-size: 0.9rem; /* Adjust font size */
    text-align: center;
    &:hover {
      color: #003d66; /* Change hover color */
      border-bottom: 2px solid #003d66; /* Add underline effect on hover */
      background-color: #e9ecef; /* Light grey background on hover */
    }
  }
  .nav-link.active {
    color: #fff !important;
    background-color: #007bff;
    border-color: #007bff;
  }
`;

const StyledTab = styled(Tab)`
  padding: 10px;
`;

const StyledListGroup = styled(ListGroup)`
  margin-top: 10px;
`;

const StyledListGroupItem = styled(ListGroup.Item)`
  padding: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f8f9fa;
  }
`;

const ItemCard = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const AvatarImage = styled(Image)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const ToggleButton = styled(Button)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #007bff;
  border: none;
  border-radius: 50%;
  padding: 10px 15px;
  font-size: 0.9rem;
  z-index: 1000;

  &:hover {
    background-color: #0056b3;
  }
`;

const PlaceholderText = styled.div`
  text-align: center;
  color: #aaa;
  font-size: 1.2rem;
  padding: 20px;
`;
