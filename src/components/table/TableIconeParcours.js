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

export default function TableIconeParcours({
  parcoursId,
  parcoursName,
  dataLabel,
}) {
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
    <td data-label={dataLabel} style={{ alignItems: "center" }}>
      <OverlayTrigger
        overlay={
          <Tooltip>
            Accès au <strong>module</strong>.
          </Tooltip>
        }
        placement="top"
        popperConfig={{
          modifiers: [{ name: "offset", options: { offset: [0, 8] } }],
        }}
      >
        <Link
          to={`/student/modules/${parcoursId}`}
          className="icon-option"
          style={{ paddingLeft: "5px", color: "black" }}
        >
          <BiArchive size={24} />
        </Link>
      </OverlayTrigger>

      <Link to={`/student/update-parcour/${parcoursId}`}>
        <span className="icon-option">
          <BiEdit size={24} />
        </span>
      </Link>
      <span className="icon-option" onClick={handleDelete}>
        <BiTrash size={24} />
      </span>
    </td>
  );
}
