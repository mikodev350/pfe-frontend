import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Image,
  Tabs,
  Tab,
  Button,
} from "react-bootstrap";
import ChatWindow from "./ChatWindow"; // Ensure the path to ChatWindow is correct
import { useQuery } from "react-query";
import styled from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { Helmet } from "react-helmet";
import CreateModelGroupe from "../../components/create-groupe/Create-model-groupe"; // Ensure the path to CreateModelGroupe is correct
import {
  fetchGroupConversations,
  fetchPrivateConversations,
} from "../../api/apiConversation";
import Retour from "../../components/retour-arriere/Retour";

const API_BASE_URL = "http://localhost:1337";
const GROUP_IMAGE_URL = "http://localhost:1337/uploads/2352167_d7a8ed29e9.png";

const AvatarWithName = (participants, type, id, title) => {
  let imageUrl = "";
  let name = title;
  console.log(type);

  if (type === "PRIVATE") {
    const usersFiltered = participants.filter((item) => item.id !== id);

    if (usersFiltered.length > 0) {
      const user = usersFiltered[0];
      name = user.username;
      imageUrl = user.profil?.photoProfil?.url
        ? API_BASE_URL + user.profil.photoProfil.url
        : "http://localhost:1337/uploads/images_1_1f1e6e00bc.jpeg";
    } else {
      imageUrl = API_BASE_URL;
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
  const [searchParams] = useSearchParams();
  const idFromUrl = searchParams.get("id"); // Get the ID from the URL
  const [selectedConversation, setSelectedConversation] = useState(idFromUrl || null); // Set initial conversation if id exists in URL
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Handle showing the conversation and updating the URL
  const handleShowConversation = (id) => {
    setSelectedConversation(id);
    if (windowWidth < 900) {
      navigate(`/chat/${id}`);  // For small screens, use dynamic URL
    } else {
      navigate(`/chat?id=${id}`);  // For larger screens, use query param
    }
  };

  // Fetch private and group conversations
  const { isLoading: isLoadingPrivate, data: dataPrivate, error: errorPrivate } = useQuery(["privateConversations"], fetchPrivateConversations);
  const { isLoading: isLoadingGroup, data: dataGroup, error: errorGroup } = useQuery(["groupConversations"], fetchGroupConversations);

  if (isLoadingPrivate || isLoadingGroup) return <div><loader /></div>;
  if (errorPrivate || errorGroup) return <div>Error...</div>;

  return (
    <>
      <Helmet>
        <link rel="stylesheet" type="text/css" href="/css/chatStyle.css" />
      </Helmet>
      <Layout fullcontent={false} backgroundColorIdentification={false}>
        <StyledContainer>
          <Retour />
          <Row>
            <Col md={3}>
              <StyledTabs defaultActiveKey="private">
                <StyledTab eventKey="private" title="Privé">
                  <StyledListGroup>
                    {dataPrivate?.conversations?.map((item) => (
                      <StyledListGroupItem
                        key={item.id}
                        onClick={() => handleShowConversation(item.id)}
                      >
                        {AvatarWithName(
                          item.participants,
                          "PRIVATE",
                          dataPrivate?.currentUserId
                        )}
                      </StyledListGroupItem>
                    ))}
                  </StyledListGroup>
                </StyledTab>
                <StyledTab eventKey="group" title="Groupe">
                  <StyledListGroup>
                    <CreateModelGroupe
                      show={showCreateGroupModal}
                      handleClose={() => setShowCreateGroupModal(false)}
                    />
                    <br />
                    {dataGroup?.conversations?.map((item) => (
                      <StyledListGroupItem
                        key={item.id}
                        onClick={() => handleShowConversation(item.id)}
                      >
                        {AvatarWithName(
                          item.participants,
                          "GROUP",
                          dataGroup?.currentUserId,
                          item.titre // Pass the title for group conversations
                        )}
                      </StyledListGroupItem>
                    ))}
                  </StyledListGroup>
                </StyledTab>
              </StyledTabs>
            </Col>
            {windowWidth > 800 && (
              <Col md={8}>
                {selectedConversation ? (
                  <ChatWindow id={selectedConversation || searchParams.get("id")} />
                ) : (
                  <PlaceholderText>
                    Select a conversation to start chatting
                  </PlaceholderText>
                )}
              </Col>
            )}
          </Row>
        </StyledContainer>
      </Layout>
    </>
  );
};

export default ChatApp;

const StyledContainer = styled(Container)`
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


const StyledTabs = styled(Tabs)`
  display: flex;
  justify-content: center; /* Centre les onglets */
  .nav-item {
    flex: none;
    margin: 0 10px; /* Ajout d'un léger espacement entre les onglets */
  }
  .nav-link {
    color: #555;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    text-align: center;
    border-radius: 20px;
    transition: all 0.3s ease-in-out;

    &:hover {
      color: #fff;
      background-color: #f8f9fa;
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    }
  }
  .nav-link.active {
    color: black !important;
    background-color: #f8f9fa;
    border: none;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const StyledTab = styled(Tab)`
  padding: 15px;
  background-color:#f8f9fa;
  border-radius: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;



const StyledListGroup = styled(ListGroup)`
  margin-top: 10px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);  /* Ombre pour le groupe */
`;

const StyledListGroupItem = styled(ListGroup.Item)`
  padding: 12px 15px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;  /* Ajout d'une transition pour l'effet de survol */
  border-bottom: 1px solid #e9ecef;  /* Ajout d'une ligne de séparation entre les éléments */
  background-color: #ffffff;  /* Fond blanc pour chaque élément */
  
  &:hover {
    background-color: #f1f3f5;  /* Gris clair lors du survol */
    transform: scale(1.02);  /* Légère mise à l'échelle lors du survol */
  }
  
  &:last-child {
    border-bottom: none;  /* Pas de bordure pour le dernier élément */
  }
`;


const ItemCard = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 5px;
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
