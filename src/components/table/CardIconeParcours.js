import React from "react";
import { Link } from "react-router-dom";
import { BiArchive, BiEdit, BiTrash } from "react-icons/bi";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "react-query";
import { deletePathway } from "../../api/ApiParcour";
import { getToken } from "../../util/authUtils";
import styled from "styled-components";

const IconContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const StyledLink = styled(Link)`
  color: black;
  padding: 5px;
  text-decoration: none;
`;

const IconButton = styled.span`
  color: black;
  padding: 5px;
  cursor: pointer;
`;

export default function CardIconeParcours({ parcoursId, parcoursName }) {
  const token = getToken();
  const queryClient = useQueryClient();

  const deletePathwayMutation = useMutation(
    () => deletePathway(parcoursId, token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("parcours");
        toast.success("Parcours supprimé avec succès !");
      },
      onError: (error) => {
        toast.error(
          `Erreur lors de la suppression du parcours : ${error.message}`
        );
      },
    }
  );

  const handleDelete = () => {
    Swal.fire({
      title: "Êtes-vous sûr?",
      text: "Vous ne pourrez pas annuler cette action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimez-le!",
    }).then((result) => {
      if (result.isConfirmed) {
        deletePathwayMutation.mutate();
      }
    });
  };

  return (
    <IconContainer>
      <OverlayTrigger
        overlay={
          <Tooltip>
            Accéder au <strong>module</strong>.
          </Tooltip>
        }
        placement="top"
        container={document.body}
      >
        <StyledLink to={`/dashboard/modules/${parcoursId}`}>
          <BiArchive size={24} />
        </StyledLink>
      </OverlayTrigger>

      <OverlayTrigger
        overlay={
          <Tooltip>
            Modifier le <strong>parcours</strong>.
          </Tooltip>
        }
        placement="top"
        container={document.body}
      >
        <StyledLink to={`/dashboard/update-parcour/${parcoursId}`}>
          <BiEdit size={24} />
        </StyledLink>
      </OverlayTrigger>

      <OverlayTrigger
        overlay={
          <Tooltip>
            Supprimer le <strong>parcours</strong>.
          </Tooltip>
        }
        placement="top"
        container={document.body}
      >
        <IconButton onClick={handleDelete}>
          <BiTrash size={24} />
        </IconButton>
      </OverlayTrigger>
    </IconContainer>
  );
}
