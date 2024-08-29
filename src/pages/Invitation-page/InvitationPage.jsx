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
import { Link, useLocation } from "react-router-dom";
import {
  acceptFriendRequest,
  cancelFriendRequest,
} from "../../api/apiFriendRequest";
import { getToken } from "../../util/authUtils";
import styled from "styled-components";


// Styled Components
const StyledContainer = styled(Container)`
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
`;

const StyledCard = styled(Card)`
  transition: transform 0.3s ease !important, box-shadow 0.3s ease !important;
  margin-bottom: 20px !important;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1) !important; /* Enhanced shadow effect */
  transform: translateY(0) !important;
  border-radius: 15px !important; /* Rounded borders */
  overflow: hidden !important; /* Ensure content stays within the rounded borders */

  &:hover {
    transform: translateY(-8px) !important; /* Lift card up more on hover */
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2) !important; /* Deeper shadow on hover */
  }
`;

const StyledCardBody = styled(Card.Body)`
  padding: 20px;
  text-align: center;
`;

const StyledCardTitle = styled(Card.Title)`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 15px;
`;

const StyledCardText = styled(Card.Text)`
  color: #6c757d;
  margin-bottom: 15px;
`;

const StyledButton = styled(Button)`
  margin: 5px;
`;

const StyledImage = styled(Image)`
  margin-bottom: 1rem;
  border-radius: 50%;
`;

const NoInvitations = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  color: #6c757d;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;
const InvitationPage = () => {
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();
  const location = useLocation();

  const userRole = localStorage.getItem("role");

  // Determine the type of invitations based on the route
  const invitationType = location.pathname.includes("coaching")
    ? "COACHING"
    : "AMIS";

  // Fetch invitations using react-query
  const { data: invitations, isLoading } = useQuery(
    ["invitations", invitationType],
    () => fetchInvitations(invitationType)
  );


  console.log('====================================');
  console.log("invitations");
    console.log(invitations);

  console.log('====================================');
  // Accept invitation mutation
  const acceptInvitationMutation = useMutation(
    (id) => acceptFriendRequest(id, getToken()),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["invitations", invitationType]);
        setMessage(
          `${invitationType === "AMIS" ? "Invitation" : "Demande de coaching"} acceptée !`
        );
      },
      onError: (error) => {
        setMessage(
          `Erreur lors de l'acceptation de ${
            invitationType === "AMIS" ? "l'invitation" : "la demande de coaching"
          }: ${error.message}`
        );
      },
    }
  );

  // Cancel invitation mutation
  const cancelInvitationMutation = useMutation(
    (id) => cancelFriendRequest(id, getToken()),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["invitations", invitationType]);
        setMessage(
          `${
            invitationType === "AMIS" ? "Invitation" : "Demande de coaching"
          } refusée !`
        );
      },
      onError: (error) => {
        setMessage(
          `Erreur lors du refus de ${
            invitationType === "AMIS" ? "l'invitation" : "la demande de coaching"
          }: ${error.message}`
        );
      },
    }
  );

  const handleAcceptRequest = (id) => {
    acceptInvitationMutation.mutate(id);
  };

  const handleCancelRequest = (id) => {
    Swal.fire({
      title: `Êtes-vous sûr de vouloir refuser cette ${
        invitationType === "AMIS" ? "invitation" : "demande de coaching"
      }?`,
      showCancelButton: true,
      confirmButtonText: "Refuser",
    }).then((result) => {
      if (result.isConfirmed) {
        cancelInvitationMutation.mutate(id);
        Swal.fire(
          `${
            invitationType === "AMIS" ? "Invitation" : "Demande de coaching"
          } refusée!`,
          "",
          "success"
        );
      }
    });
  };

  const getInvitationText = (expediteur) => {
    if (invitationType === "COACHING" && userRole === "STUDENT") {
      return `Invitation de ${expediteur.username} pour devenir votre mentor`;
    }
    return `Demande de coaching de ${expediteur.username}`;
  };

  if (isLoading) return <div>Chargement...</div>;


  
   return (
    <StyledContainer>
      <h1 className="my-4 text-center">
        {invitationType === "AMIS"
          ? "Invitations Communautaires"
          : "Demandes de Coaching"}
      </h1>
      {message && <Alert variant="info">{message}</Alert>}
      <Row>
        {invitations && invitations.length > 0 ? (
          invitations.map((invitation) => (
            <Col key={invitation?.id} sm={12} md={6} lg={4}>
              <StyledCard>
                <StyledCardBody>
                  
                  <Link to={`/dashboard/find-profil/${ invitation?.expediteur?.id}`}>
                  <StyledImage
                    src={
                      invitation?.expediteur?.profil?.photoProfil?.url
                        ? "http://localhost:1337" +
                          invitation?.expediteur?.profil?.photoProfil?.url
                        : `https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png`
                    }
                    roundedCircle
                    width="150"
                    height="150"
                  />
                  </Link>
                  <StyledCardTitle>
                    {invitation.expediteur.username}
                  </StyledCardTitle>
                  <StyledCardText>
                    {getInvitationText(invitation.expediteur)}
                  </StyledCardText>
                  <StyledButton
                    variant="outline-primary"
                    className="me-2"
                    onClick={() =>
                      handleAcceptRequest(invitation.expediteur.id)
                    }
                    disabled={
                      acceptInvitationMutation.isLoading ||
                      cancelInvitationMutation.isLoading
                    }
                  >
                    <FaCheck /> Accepter
                  </StyledButton>
                  <StyledButton
                    variant="outline-danger"
                    onClick={() =>
                      handleCancelRequest(invitation.expediteur.id)
                    }
                    disabled={
                      acceptInvitationMutation.isLoading ||
                      cancelInvitationMutation.isLoading
                    }
                  >
                    <FaTimes /> Refuser
                  </StyledButton>
                </StyledCardBody>
              </StyledCard>
            </Col>
          ))
        ) : (
          <Col>
            <NoInvitations>
              {invitationType === "AMIS"
                ? "Vous n'avez reçu aucune invitation communautaire."
                : "Vous n'avez reçu aucune demande de coaching."}
            </NoInvitations>
          </Col>
        )}
      </Row>
    </StyledContainer>
  );
};

export default InvitationPage;
