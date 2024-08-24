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
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { Helmet } from "react-helmet";
import CreateModelGroupe from "../../components/create-groupe/Create-model-groupe"; // Ensure the path to CreateModelGroupe is correct
import {
  fetchGroupConversations,
  fetchPrivateConversations,
} from "../../api/apiConversation";

const API_BASE_URL = "http://localhost:1337";
const GROUP_IMAGE_URL = "http://localhost:1337/uploads/2352167_d7a8ed29e9.png";

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

const AvatarWithName = (participants, type, id, title) => {
  let imageUrl = "";
  let name = title;

  if (type === "PRIVATE") {
    const usersFiltered = participants.filter((item) => item.id !== id);

    if (usersFiltered.length > 0) {
      const user = usersFiltered[0];
      name = user.username;
      imageUrl = user.profil?.photoProfil?.url
        ? API_BASE_URL + user.profil.photoProfil.url
        : "http://localhost:1337/uploads/images_1_1f1e6e00bc.jpeg";
    } else {
      imageUrl = "http://localhost:1337/uploads/images_1_1f1e6e00bc.jpeg";
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

const Conversation = () => {
  const { id } = useParams(); // Access the :id parameter
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
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

  const navigate = useNavigate();
  const handleShowConversation = (id) => {
    setSelectedConversation(id);
    if (windowWidth < 900) {
      navigate(`/chat/${id}`);
    } else {
      navigate(`/chat?id=${id}`);
    }
  };

  const {
    isLoading: isLoadingPrivate,
    data: dataPrivate,
    error: errorPrivate,
  } = useQuery(["privateConversations"], fetchPrivateConversations);

  const {
    isLoading: isLoadingGroup,
    data: dataGroup,
    error: errorGroup,
  } = useQuery(["groupConversations"], fetchGroupConversations);

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
            <Col md={8}>
              <ChatWindow id={id} />
            </Col>
          </Row>
          {/* <ToggleButton onClick={() => setShowSidebar(!showSidebar)}>
            {showSidebar ? "Hide" : "Show"} Sidebar
          </ToggleButton> */}
        </StyledContainer>
      </Layout>
    </>
  );
};

export default Conversation;

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
