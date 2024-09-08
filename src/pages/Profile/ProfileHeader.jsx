import React from "react";
import { Container, Image, Button, Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import { MdPersonAddAlt } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import { useQueryClient } from "react-query";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  sendFriendRequest,
} from "../../api/apiFriendRequest";
import { Link } from "react-router-dom";
import styled from "styled-components";

const EditButton = styled.button`
  width: 35px;
  height: 35px;
  position: absolute;
   top: 5px;
  right: 15px;
  font-size: 16px; /* Taille de l'icône */
  border-radius: 50%;
  background-color: white;
  color: #1976d2;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none; /* Suppression de la bordure */

  &:hover {
    background-color: #f5f5f5;
    color: #0d47a1;
    cursor: pointer; /* Ajouter un curseur pointer */
  }
`;
export const ProfileHeader = ({
  id,
  token,
  profile,
  nomComplet,
  isRequestSender,
  isRequestReceiver,
  isMyProfile = false,
  relationIsExist,
  isFriends,
  type,
}) => {
  const [message, setMessage] = React.useState("");
  const [status, setStatus] = React.useState({
    isRequestSender,
    isRequestReceiver,
    relationIsExist,
    isFriends,
    isMyProfile,
    coachingRequestSent: false,
    friendRequestSent: false,
  });

  const queryClient = useQueryClient();
  const userRole = localStorage.getItem("role")?.toUpperCase();

  const handleSendRequest = async (typeDemande = "AMIS") => {
    try {
      await sendFriendRequest(id, token, { typeDemande });
      queryClient.invalidateQueries(["profile", id ? id : "me"]);
      setStatus((prevStatus) => ({
        ...prevStatus,
        isRequestSender: true,
        relationIsExist: true,
        isFriends: typeDemande === "FRIEND",
        coachingRequestSent: typeDemande === "COACHING",
        friendRequestSent: typeDemande === "FRIEND",
      }));
      setMessage(
        typeDemande === "COACHING"
          ? "Demande de Coaching envoyée !"
          : "Invitation envoyée !"
      );
    } catch (error) {
      setMessage("Erreur lors de l'envoi de la demande : " + error.message);
    }
  };

  const handleCancelRequest = async () => {
    try {
      Swal.fire({
        title: "Voulez-vous retirer la relation ?",
        showCancelButton: true,
        confirmButtonText: "Retirer la relation",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await cancelFriendRequest(id, token);
          Swal.fire("Retiré !", "", "success");
          queryClient.invalidateQueries(["profile", id ? id : "me"]);
          setStatus({
            ...status,
            isRequestSender: false,
            isRequestReceiver: false,
            relationIsExist: false,
            isFriends: false,
            coachingRequestSent: false,
            friendRequestSent: false,
          });
        } else if (result.isDenied) {
          Swal.fire("Aucune modification", "", "info");
        }
      });
    } catch (error) {
      setMessage("Erreur lors du retrait de la relation : " + error.message);
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
      setMessage("Erreur lors de l'acceptation de l'invitation : " + error.message);
    }
  };

  const renderButtons = () => {

//  if (userRole === "TEACHER" && type === "STUDENT") {
//       return (
//         !status.coachingRequestSent && (
//           <Button
//             variant="outline-light"
//             className="mt-2 custom-light-button"
//             onClick={() => handleSendRequest("COACHING")}
//           >
//             Demande de Coach
//           </Button>
//         )
//       );
//     }
if (userRole === "TEACHER" && type === "TEACHER") {
      return (
        <>
          {!status.friendRequestSent && (
            <Button
              variant="outline-light"
              onClick={() => handleSendRequest("AMIS")}
                          style={{marginTop: "5px !important"}}

              className="custom-light-button"
            >
              <MdPersonAddAlt size={19} /> Ajouter comme ami
            </Button>
          )}
          {!status.coachingRequestSent && (
            <Button
              variant="outline-light"
              className="mt-2 custom-light-button"
              onClick={() => handleSendRequest("COACHING")}
            >
              Demande de Coaching
            </Button>
          )}
        </>
      );
    } 
    
    
    else if (userRole === "STUDENT" && type === "STUDENT") {
      return (
        !status.friendRequestSent && (
          <Button
            style={{marginTop: "5px !important"}}
            variant="outline-light"
            onClick={() => handleSendRequest("AMIS")}
            className="custom-light-button"
          >
            <MdPersonAddAlt size={19} /> Ajouter comme ami
          </Button>
        )
      );
    } else if (userRole === "STUDENT" && type === "TEACHER") {
      return (
        !status.coachingRequestSent && (
          <Button
            variant="outline-light"
            className="mt-2 custom-light-button"
            onClick={() => handleSendRequest("COACHING")}
          >
            Demande de Coaching
          </Button>
        )
      );
    }
    return null;
  };

  return (
    <Container className="text-center my-3 container-profile Bagrond-Profils">

      {status.isMyProfile && (
          <div className="d-flex justify-content-end position-relative mb-3">

        <Link to="/dashboard/edit-profile">
           <OverlayTrigger
              placement="left"
              overlay={<Tooltip id="edit-profile-tooltip">Modifier le profile</Tooltip>}
            >
              <EditButton>
                <FaEdit />
              </EditButton>
            </OverlayTrigger>
        </Link>
          </div>

      )}
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
                  <IoClose size={19} /> Supprimer la relation
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
              renderButtons()
            )}
          </>
        )}
      </div>

      {/* Bouton Edit Profile ajouté ici avec une icône */}


    </Container>
  );
};



// import React from "react";
// import { Container, Image, Button, Badge } from "react-bootstrap";
// import { MdPersonAddAlt } from "react-icons/md";
// import { IoClose } from "react-icons/io5";
// import Swal from "sweetalert2";
// import { useQueryClient } from "react-query";
// import {
//   acceptFriendRequest,
//   cancelFriendRequest,
//   sendFriendRequest,
// } from "../../api/apiFriendRequest";

// export const ProfileHeader = ({
//   id,
//   token,
//   profile,
//   nomComplet,
//   isRequestSender,
//   isRequestReceiver,
//   isMyProfile = false,
//   relationIsExist,
//   isFriends,
//   type,
// }) => {
//   const [message, setMessage] = React.useState("");
//   const [status, setStatus] = React.useState({
//     isRequestSender,
//     isRequestReceiver,
//     relationIsExist,
//     isFriends,
//     isMyProfile,
//     coachingRequestSent: false,
//     friendRequestSent: false,
//   });

//   const queryClient = useQueryClient();
//   const userRole = localStorage.getItem("role")?.toUpperCase();

//   const handleSendRequest = async (typeDemande = "AMIS") => {
//     try {
//       await sendFriendRequest(id, token, { typeDemande });
//       queryClient.invalidateQueries(["profile", id ? id : "me"]);
//       setStatus((prevStatus) => ({
//         ...prevStatus,
//         isRequestSender: true,
//         relationIsExist: true,
//         isFriends: typeDemande === "FRIEND",
//         coachingRequestSent: typeDemande === "COACHING",
//         friendRequestSent: typeDemande === "FRIEND",
//       }));
//       setMessage(
//         typeDemande === "COACHING"
//           ? "Demande de Coaching envoyée !"
//           : "Invitation envoyée !"
//       );
//     } catch (error) {
//       setMessage("Erreur lors de l'envoi de la demande : " + error.message);
//     }
//   };

//   const handleCancelRequest = async () => {
//     try {
//       Swal.fire({
//         title: "Voulez-vous retirer la relation ?",
//         showCancelButton: true,
//         confirmButtonText: "Retirer la relation",
//       }).then(async (result) => {
//         if (result.isConfirmed) {
//           await cancelFriendRequest(id, token);
//           Swal.fire("Retiré !", "", "success");
//           queryClient.invalidateQueries(["profile", id ? id : "me"]);
//           setStatus({
//             ...status,
//             isRequestSender: false,
//             isRequestReceiver: false,
//             relationIsExist: false,
//             isFriends: false,
//             coachingRequestSent: false,
//             friendRequestSent: false,
//           });
//         } else if (result.isDenied) {
//           Swal.fire("Aucune modification", "", "info");
//         }
//       });
//     } catch (error) {
//       setMessage("Erreur lors du retrait de la relation : " + error.message);
//     }
//   };

//   const handleAcceptRequest = async () => {
//     try {
//       await acceptFriendRequest(id, token);
//       queryClient.invalidateQueries(["profile", id ? id : "me"]);
//       setStatus({
//         ...status,
//         isRequestSender: false,
//         isRequestReceiver: false,
//         relationIsExist: true,
//         isFriends: true,
//       });
//     } catch (error) {
//       setMessage("Erreur lors de l'acceptation de l'invitation : " + error.message);
//     }
//   };

//   const renderButtons = () => {
//     if (userRole === "TEACHER" && type === "STUDENT") {
//       // Affiche seulement "Demande de Coaching" si le rôle est TEACHER et le type est STUDENT
//       return (
//         !status.coachingRequestSent && (
//           <Button
//             variant="outline-light"
//             className="mt-2 custom-light-button"
//             onClick={() => handleSendRequest("COACHING")}
//           >
//             Demande de Coach
//           </Button>
//         )
//       );
//     } else if (userRole === "TEACHER" && type === "TEACHER") {
//       // Affiche les deux boutons si les deux sont TEACHER
//       return (
//         <>
//           {!status.friendRequestSent && (
//             <Button
//               variant="outline-light"
//               onClick={() => handleSendRequest("AMIS")}
//               className="custom-light-button"
//             >
//               <MdPersonAddAlt size={19} /> Ajouter comme ami
//             </Button>
//           )}
//           {!status.coachingRequestSent && (
//             <Button
//               variant="outline-light"
//               className="mt-2 custom-light-button"
//               onClick={() => handleSendRequest("COACHING")}
//             >
//               Demande de Coaching
//             </Button>
//           )}
//         </>
//       );
//     } else if (userRole === "STUDENT" && type === "STUDENT") {
//       // Affiche seulement "Ajouter comme ami" si les deux sont STUDENT
//       return (
//         !status.friendRequestSent && (
//           <Button
//             variant="outline-light"
//             onClick={() => handleSendRequest("AMIS")}
//             className="custom-light-button"
//           >
//             <MdPersonAddAlt size={19} /> Ajouter comme ami
//           </Button>
//         )
//       );
//     } else if (userRole === "STUDENT" && type === "TEACHER") {
//       // Affiche seulement "Demande de Coaching" si le rôle est STUDENT et le type est TEACHER
//       return (
//         !status.coachingRequestSent && (
//           <Button
//             variant="outline-light"
//             className="mt-2 custom-light-button"
//             onClick={() => handleSendRequest("COACHING")}
//           >
//             Demande de Coaching
//           </Button>
//         )
//       );
//     }
//     return null;
//   };

//   return (
//     <Container className="text-center my-3 container-profile Bagrond-Profils">
//       <Image
//         width="150px"
//         height="150px"
//         src={
//           profile?.photoProfil
//             ? `http://localhost:1337${profile?.photoProfil}`
//             : "https://via.placeholder.com/150"
//         }
//         roundedCircle
//         className="mb-3"
//       />
//       <h1 className="text-light">{nomComplet}</h1>
//       <p className="lead text-light">{profile?.programmeEtudes}</p>
//       <p className="text-light">
//         {profile?.niveauEtudes === "rien"
//           ? profile?.nomFormation
//           : profile?.niveauEtudes}
//       </p>
//       {profile?.specialite && (
//         <p className="text-light">Spécialité: {profile?.specialite}</p>
//       )}
//       {profile?.institution && (
//         <p className="text-light">Institution: {profile?.institution}</p>
//       )}
//       {profile?.niveauSpecifique && (
//         <p className="text-light">Niveaux: {profile?.niveauSpecifique}</p>
//       )}
//       <div>
//         {profile?.matieresEnseignees?.length > 0 && userRole === "TEACHER" && (
//           <>
//             <p className="text-light">Les matières:</p>
//             {profile.matieresEnseignees.map((matiere, index) => (
//               <Badge key={index} pill bg="light" text="dark" className="mx-1">
//                 {matiere}
//               </Badge>
//             ))}
//           </>
//         )}
//       </div>
//       <div>
//         {profile?.additionalAttribute && (
//           <p className="text-light">
//             Additional Attribute: {profile?.additionalAttribute}
//           </p>
//         )}
//         <br />
//         {!status.isMyProfile && (
//           <>
//             {message && <p className="text-light">{message}</p>}
//             {status.relationIsExist ? (
//               status.isFriends || status.isRequestSender ? (
//                 <Button
//                   variant="danger"
//                   onClick={handleCancelRequest}
//                   className="custom-light-button"
//                 >
//                   <IoClose size={19} /> Remove Relation
//                 </Button>
//               ) : status.isRequestReceiver ? (
//                 <>
//                   <Button
//                     variant="outline-light"
//                     onClick={handleAcceptRequest}
//                     className="custom-light-button"
//                   >
//                     <MdPersonAddAlt size={19} /> Accept
//                   </Button>
//                   <Button
//                     variant="danger"
//                     onClick={handleCancelRequest}
//                     className="custom-light-button"
//                   >
//                     <IoClose size={19} /> Decline
//                   </Button>
//                 </>
//               ) : (
//                 <Button
//                   variant="danger"
//                   onClick={handleCancelRequest}
//                   className="custom-light-button"
//                 >
//                   <IoClose size={19} /> Cancel
//                 </Button>
//               )
//             ) : (
//               renderButtons()
//             )}
//           </>
//         )}
//       </div>
//     </Container>
//   );
// };
