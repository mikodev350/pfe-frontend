import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Alert,
  Image,
} from "react-bootstrap";
import { acceptInvitation, fetchInvitations } from "../../api/apiInvitation";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useQuery } from "react-query";
import Swal from "sweetalert2";
import { useQueryClient } from "react-query";
import {
  acceptFriendRequest,
  cancelFriendRequest,
} from "../../api/apiFriendRequest";
import { getToken } from "../../util/authUtils";

const styles = {
  container: {
    backgroundColor: "#f8f9fa",
    padding: "20px",
    borderRadius: "8px",
  },
  card: {
    transition: "transform 0.3s, box-shadow 0.3s",
    marginBottom: "20px",
    boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)",
  },
  cardHover: {
    transform: "translateY(-5px)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
  },
  cardBody: {
    padding: "20px",
    textAlign: "center",
  },
  cardTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "15px",
  },
  cardText: {
    color: "#6c757d",
    marginBottom: "15px",
  },
  button: {
    margin: "5px",
  },
  image: {
    marginBottom: "1rem",
    borderRadius: "50%",
  },
};

const Communaute = () => {
  const [message, setMessage] = useState("");

  const { data: invitations, isLoading } = useQuery(["invitations"], () =>
    fetchInvitations()
  );
  const queryClient = useQueryClient();

  const handleAcceptInvitation = async (token) => {
    try {
      await acceptInvitation(token);
      setMessage("Invitation acceptée !");
      // setInvitations((prevInvitations) =>
      //   prevInvitations.filter((invitation) => invitation.token !== token)
      // );
    } catch (error) {
      console.error("Error accepting invitation:", error);
      setMessage("Error accepting invitation: " + error.message);
    }
  };
  const handleCancelRequest = async (id) => {
    try {
      Swal.fire({
        title: "Do you want to save the changes?",
        showCancelButton: true,
        confirmButtonText: "Remove Relation",
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          const token = getToken();
          await cancelFriendRequest(id, token);
          Swal.fire("Saved!", "", "success");
          // !FIX: need to update the data
          // queryClient.setQueryData(["profile", id ? id : "me"], (oldData) => {
          //   return {
          //     ...oldData,
          //     isRequestSender: false,
          //     relationIsExist: false,
          //     isFriends: false,
          //   };
          // });
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
    } catch (error) {
      setMessage("Error sending invitation: " + error.message);
    }
  };
  const handleAcceptRequest = async (id) => {
    try {
      const token = getToken();
      await acceptFriendRequest(id, token);
      // queryClient.setQueryData(["invitations"], (oldData) => {
      //   return {
      //     ...oldData,
      //     isRequestSender: false,
      //     relationIsExist: false,
      //     isFriends: false,
      //   };
      // });
    } catch (error) {
      setMessage("Error sending invitation: " + error.message);
    }
  };
  if (isLoading) return <div>Fetching</div>;
  return (
    <Container style={styles.container}>
      <h1 className="my-4 text-center">Invitations Communautaires</h1>
      {message && <Alert variant="info">{message}</Alert>}
      <Row>
        {invitations?.map((invitation) => (
          <Col key={invitation?.id} sm={12} md={6} lg={4}>
            <Card
              className="shadow-sm"
              style={styles.card}
              onMouseEnter={(e) => (e.currentTarget.style = styles.cardHover)}
              onMouseLeave={(e) => (e.currentTarget.style = styles.card)}
            >
              <Card.Body style={styles.cardBody}>
                <Image
                  src={
                    invitation?.expediteur?.profil?.photoProfil?.url
                      ? "http://localhost:1337" +
                        invitation?.expediteur?.profil?.photoProfil?.url
                      : `https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png`
                  }
                  roundedCircle
                  width="150"
                  height="150"
                  style={styles.image}
                  className="mb-3"
                />
                <Card.Title style={styles.cardTitle}>
                  {invitation.expediteur.username}
                </Card.Title>
                <Card.Text style={styles.cardText}>
                  {invitation.expediteur.email}
                </Card.Text>
                <Button
                  variant="outline-primary"
                  className="me-2"
                  style={styles.button}
                  onClick={() => handleCancelRequest(invitation.expediteur.id)}
                >
                  <FaCheck /> Accepter
                </Button>
                <Button
                  variant="outline-danger"
                  style={styles.button}
                  onClick={() => handleAcceptRequest(invitation.expediteur.id)}
                >
                  <FaTimes /> Refuser
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Communaute;
