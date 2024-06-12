// components/table/TableIconeResource.js
import React from "react";
import { Link } from "react-router-dom";
import { BiDetail, BiEdit, BiTrash } from "react-icons/bi";
import { useMutation, useQueryClient } from "react-query";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { deleteResource } from "../../api/apiResource";
import { getToken } from "../../util/authUtils";

export default function TableIconeResource({ id, dataLabel }) {
  const token = React.useMemo(() => getToken(), []);
  const queryClient = useQueryClient();

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
    <td data-label={dataLabel} style={{ alignItems: "center" }}>
      <Link to={`/student/resource-preview/${id}`}>
        <span className="icon-option">
          <BiDetail size={23} />
        </span>
      </Link>
      <Link to={`/student/update-resource/${id}`}>
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
