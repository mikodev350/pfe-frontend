// components/table/TableIconeResource.js
import React from "react";
import { Link } from "react-router-dom";
import { BiDetail, BiEdit, BiTrash } from "react-icons/bi";
import { useMutation, useQueryClient } from "react-query";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { deleteResource } from "../../api/apiResource";
import { getToken } from "../../util/authUtils";
import styled from "styled-components";

const StyledIconButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  border-radius: 8px;
  background-color: #e0e0e0; /* Default gray background */
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.3s ease;
  color: #424242; /* Dark grey icon color */

  &:hover,
  &:focus {
    background-color: #007bff; /* Blue background on hover/focus */
    color: #ffffff; /* White icon color on hover/focus */
    transform: translateY(-3px); /* Slight lift on hover/focus */
  }
`;

export default function TableIconeResource({ id, dataLabel }) {
  const [isFirstClick, setIsFirstClick] = React.useState(true);

  const token = React.useMemo(() => getToken(), []);
  const queryClient = useQueryClient();

  const handleLinkClick = (event, path) => {
    if (isFirstClick) {
      event.preventDefault();
      setIsFirstClick(false);
      window.location.href = path; // Force un rechargement complet de la page
    }
  };

  const mutation = useMutation(() => deleteResource(id, token), {
    onSuccess: () => {
      queryClient.invalidateQueries("resources");
      toast.success("Ressource supprimée avec succès !");
    },
    onError: (error) => {
      toast.error(
        `Erreur lors de la suppression de la ressource : ${error.message}`
      );
    },
  });

  const handleDelete = () => {
    Swal.fire({
      title: "Êtes-vous sûr?",
      text: "Vous ne pourrez pas annuler cette action !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimez-la!",
    }).then((result) => {
      if (result.isConfirmed) {
        mutation.mutate();
      }
    });
  };

  return (
    <td
      data-label={dataLabel}
      style={{ alignItems: "center", display: "flex", gap: "10px" }}
    >
      <Link
        to={`/dashboard/resource-preview/${id}`}
        onClick={(e) => handleLinkClick(e, `/dashboard/resource-preview/${id}`)}
      >
        <StyledIconButton>
          <BiDetail size={23} />
        </StyledIconButton>
      </Link>

      <Link
        to={`/dashboard/update-resource/${id}`}
        onClick={(e) => handleLinkClick(e, `/dashboard/update-resource/${id}`)}
      >
        <StyledIconButton>
          <BiEdit size={24} />
        </StyledIconButton>
      </Link>

      <StyledIconButton onClick={handleDelete}>
        <BiTrash size={24} />
      </StyledIconButton>
    </td>
  );
}
