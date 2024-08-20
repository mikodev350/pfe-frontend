import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Alert,
  Image,
} from "react-bootstrap";
import { fetchInvitations } from "../../api/apiInvitation";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useQuery, useMutation } from "react-query";
import Swal from "sweetalert2";
import { useQueryClient } from "react-query";
import { useLocation } from "react-router-dom";
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

const InvitationPage = () => {
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();
  const location = useLocation();

  // Determine the type of invitations based on the route
  const invitationType = location.pathname.includes("coaching") ? "COACHING" : "AMIS";

  // Fetch invitations using react-query
  const { data: invitations, isLoading } = useQuery(
    ["invitations", invitationType],
    () => fetchInvitations(invitationType)
  );

  // Accept invitation mutation
  const acceptInvitationMutation = useMutation(
    (id) => acceptFriendRequest(id, getToken()),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["invitations", invitationType]);
        setMessage(`${invitationType === "AMIS" ? "Invitation" : "Demande de coaching"} acceptée !`);
      },
      onError: (error) => {
        setMessage(`Erreur lors de l'acceptation de ${invitationType === "AMIS" ? "l'invitation" : "la demande de coaching"}: ${error.message}`);
      },
    }
  );

  // Cancel invitation mutation
  const cancelInvitationMutation = useMutation(
    (id) => cancelFriendRequest(id, getToken()),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["invitations", invitationType]);
        setMessage(`${invitationType === "AMIS" ? "Invitation" : "Demande de coaching"} refusée !`);
      },
      onError: (error) => {
        setMessage(`Erreur lors du refus de ${invitationType === "AMIS" ? "l'invitation" : "la demande de coaching"}: ${error.message}`);
      },
    }
  );

  const handleAcceptRequest = (id) => {
    acceptInvitationMutation.mutate(id);
  };

  const handleCancelRequest = (id) => {
    Swal.fire({
      title: `Êtes-vous sûr de vouloir refuser cette ${invitationType === "AMIS" ? "invitation" : "demande de coaching"}?`,
      showCancelButton: true,
      confirmButtonText: "Refuser",
    }).then((result) => {
      if (result.isConfirmed) {
        cancelInvitationMutation.mutate(id);
        Swal.fire(`${invitationType === "AMIS" ? "Invitation" : "Demande de coaching"} refusée!`, "", "success");
      }
    });
  };

  if (isLoading) return <div>Chargement...</div>;

  return (
    <Container style={styles.container}>
      <h1 className="my-4 text-center">
        {invitationType === "AMIS" ? "Invitations Communautaires" : "Demandes de Coaching"}
      </h1>
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
                  onClick={() => handleAcceptRequest(invitation.expediteur.id)}
                  disabled={acceptInvitationMutation.isLoading || cancelInvitationMutation.isLoading}
                >
                  <FaCheck /> Accepter
                </Button>
                <Button
                  variant="outline-danger"
                  style={styles.button}
                  onClick={() => handleCancelRequest(invitation.expediteur.id)}
                  disabled={acceptInvitationMutation.isLoading || cancelInvitationMutation.isLoading}
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

export default InvitationPage;
