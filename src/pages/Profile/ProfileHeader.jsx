import React from "react";
import { Container, Image, Button, Badge } from "react-bootstrap";
import { MdPersonAddAlt } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import Swal from "sweetalert2";
import { useQueryClient } from "react-query";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  sendFriendRequest,
} from "../../api/apiFriendRequest";

const userRole = localStorage.getItem("role")?.toUpperCase();

export const ProfileHeader = ({
  id,
  token,
  profile,
  nomComplet,
  isRequestSender,
  isRequestReceiver,
  isMyProfile,
  relationIsExist,
  isFriends,
}) => {
  const [message, setMessage] = React.useState("");
  const [status, setStatus] = React.useState({
    isRequestSender,
    isRequestReceiver,
    relationIsExist,
    isFriends,
    isMyProfile,
  });

  const queryClient = useQueryClient();

  const handleSendRequest = async () => {
    try {
      await sendFriendRequest(id, token);
      queryClient.invalidateQueries(["profile", id ? id : "me"]);
      setStatus({
        ...status,
        isRequestSender: true,
        relationIsExist: true,
        isFriends: false,
      });
      setMessage("Invitation sent!");
    } catch (error) {
      setMessage("Error sending invitation: " + error.message);
    }
  };

  const handleCancelRequest = async () => {
    try {
      Swal.fire({
        title: "Do you want to remove the relation?",
        showCancelButton: true,
        confirmButtonText: "Remove Relation",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await cancelFriendRequest(id, token);
          Swal.fire("Removed!", "", "success");
          queryClient.invalidateQueries(["profile", id ? id : "me"]);
          setStatus({
            ...status,
            isRequestSender: false,
            isRequestReceiver: false,
            relationIsExist: false,
            isFriends: false,
          });
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
    } catch (error) {
      setMessage("Error removing relation: " + error.message);
    }
  };

  const handleAcceptRequest = async () => {
    try {
      await acceptFriendRequest(id, token);
      queryClient.invalidateQueries(["profile", id ? id : "me"]);
      setStatus({
        ...status,
        isRequestSender: false,
        isRequestReceiver: false,
        relationIsExist: true,
        isFriends: true,
      });
    } catch (error) {
      setMessage("Error accepting invitation: " + error.message);
    }
  };

  return (
    <Container className="text-center my-3 container-profile Bagrond-Profils">
      <Image
        width="150px"
        height="150px"
        src={
          profile?.photoProfil
            ? `http://localhost:1337${profile?.photoProfil}`
            : "https://via.placeholder.com/150"
        }
        roundedCircle
        className="mb-3"
      />
      <h1 className="text-light">{nomComplet}</h1>
      <p className="lead text-light">{profile?.programmeEtudes}</p>
      <p className="text-light">
        {profile?.niveauEtudes === "rien"
          ? profile?.nomFormation
          : profile?.niveauEtudes}
      </p>
      {profile?.specialite && (
        <p className="text-light">Spécialité: {profile?.specialite}</p>
      )}
      {profile?.institution && (
        <p className="text-light">Institution: {profile?.institution}</p>
      )}
      {profile?.niveauSpecifique && (
        <p className="text-light">Niveaux: {profile?.niveauSpecifique}</p>
      )}
      <div>
        {profile?.matieresEnseignees?.length > 0 && userRole === "TEACHER" && (
          <>
            <p className="text-light">Les matières:</p>
            {profile.matieresEnseignees.map((matiere, index) => (
              <Badge key={index} pill bg="light" text="dark" className="mx-1">
                {matiere}
              </Badge>
            ))}
          </>
        )}
      </div>
      <div>
        {profile?.additionalAttribute && (
          <p className="text-light">
            Additional Attribute: {profile?.additionalAttribute}
          </p>
        )}
        <br />
        {!status.isMyProfile && (
          <>
            {message && <p className="text-light">{message}</p>}
            {status.relationIsExist ? (
              status.isFriends || status.isRequestSender ? (
                <Button
                  variant="danger"
                  onClick={handleCancelRequest}
                  className="custom-light-button"
                >
                  <IoClose size={19} /> Remove Relation
                </Button>
              ) : status.isRequestReceiver ? (
                <>
                  <Button
                    variant="outline-light"
                    onClick={handleAcceptRequest}
                    className="custom-light-button"
                  >
                    <MdPersonAddAlt size={19} /> Accept
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleCancelRequest}
                    className="custom-light-button"
                  >
                    <IoClose size={19} /> Decline
                  </Button>
                </>
              ) : (
                <Button
                  variant="danger"
                  onClick={handleCancelRequest}
                  className="custom-light-button"
                >
                  <IoClose size={19} /> Cancel
                </Button>
              )
            ) : (
              <Button
                variant="outline-light"
                onClick={handleSendRequest}
                className="custom-light-button"
              >
                <MdPersonAddAlt size={19} /> Add Friend
              </Button>
            )}
          </>
        )}
      </div>
    </Container>
  );
};
