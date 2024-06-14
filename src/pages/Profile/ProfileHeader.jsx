import React from "react";
import { Container, Image, Button, Badge } from "react-bootstrap";
import { MdPersonAddAlt } from "react-icons/md";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  sendFriendRequest,
} from "../../api/apiFriendRequest";
import { IoClose } from "react-icons/io5";
import Swal from "sweetalert2";
import { useQueryClient } from "react-query";

export const ProfileHeader = ({
  id,
  token,
  profile,
  nomComplet,
  isRequestSender,
  relationIsExist,
  isFriends,
}) => {
  const [message, setMessage] = React.useState("");

  const queryClient = useQueryClient();
  const handleSendRequest = async () => {
    try {
      const result = await sendFriendRequest(id, token);
      console.log(result);
      // Function to manually update the profile data

      queryClient.setQueryData(["profile", id ? id : "me"], (oldData) => {
        return {
          ...oldData,
          isRequestSender: false,
          relationIsExist: true,
          isFriends: false,
        };
      });

      setMessage("Invitation sent!");
    } catch (error) {
      setMessage("Error sending invitation: " + error.message);
    }
  };
  const handleCancelRequest = async () => {
    try {
      Swal.fire({
        title: "Do you want to save the changes?",
        showCancelButton: true,
        confirmButtonText: "Remove Relation",
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          await cancelFriendRequest(id, token);
          Swal.fire("Saved!", "", "success");

          queryClient.setQueryData(["profile", id ? id : "me"], (oldData) => {
            return {
              ...oldData,
              isRequestSender: false,
              relationIsExist: false,
              isFriends: false,
            };
          });
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
    } catch (error) {
      setMessage("Error sending invitation: " + error.message);
    }
  };
  const handleAcceptRequest = async () => {
    try {
      await acceptFriendRequest(id, token);
      queryClient.setQueryData(["profile", id ? id : "me"], (oldData) => {
        return {
          ...oldData,
          isRequestSender: false,
          relationIsExist: false,
          isFriends: false,
        };
      });
    } catch (error) {
      setMessage("Error sending invitation: " + error.message);
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
        <p className="text-light">Les matières:</p>
        {profile?.matieresEnseignees?.map((matiere, index) => (
          <Badge key={index} pill bg="light" text="dark" className="mx-1">
            {matiere}
          </Badge>
        ))}
      </div>
      <div>
        <br />
        {id && (
          <>
            {message && <p className="text-light">{message}</p>}

            {relationIsExist ? (
              <>
                {isFriends ? (
                  <Button
                    variant="danger"
                    onClick={handleCancelRequest}
                    className="custom-light-button"
                  >
                    <IoClose size={19} /> Remove Relation
                  </Button>
                ) : !isRequestSender ? (
                  <>
                    <Button
                      variant="danger"
                      onClick={handleCancelRequest}
                      className="custom-light-button"
                    >
                      <IoClose size={19} /> Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline-light"
                      onClick={handleAcceptRequest}
                      className="custom-light-button"
                    >
                      <MdPersonAddAlt size={19} /> Accpect
                    </Button>
                    <Button
                      variant="danger"
                      onClick={handleCancelRequest}
                      className="custom-light-button"
                    >
                      <IoClose size={19} /> Decline
                    </Button>
                  </>
                )}
              </>
            ) : (
              <Button
                variant="outline-light"
                onClick={handleSendRequest}
                className="custom-light-button"
              >
                <MdPersonAddAlt size={19} /> Ajouter
              </Button>
            )}
          </>
        )}
      </div>
    </Container>
  );
};
