import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BiDetail, BiEdit, BiTrash } from "react-icons/bi";
import { Button, Modal, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "react-query";
import { deleteModule } from "../../api/apiModule";
import { getToken } from "../../util/authUtils";

const CardIconeModule = ({ moduleId, moduleName, handleUpdateModule }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [newName, setNewName] = useState(moduleName);
  const token = getToken();
  const queryClient = useQueryClient();

  const deleteModuleMutation = useMutation(
    () => deleteModule(moduleId, token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("modules");
        toast.success("Module supprimé avec succès !");
      },
      onError: (error) => {
        toast.error(
          `Erreur lors de la suppression du module : ${error.message}`
        );
      },
    }
  );

  const handleEdit = () => setShowEditModal(true);

  const handleClose = () => setShowEditModal(false);

  const handleSave = () => {
    handleUpdateModule(moduleId, newName);
    setShowEditModal(false);
  };

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
        deleteModuleMutation.mutate();
      }
    });
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        <OverlayTrigger
          overlay={<Tooltip>Accéder aux leçons</Tooltip>}
          placement="top"
        >
          <Link
            to={`/dashboard/lessons/${moduleId}`}
            className="icon-option"
            style={{ color: "black", marginRight: "10px" }}
          >
            <BiDetail size={23} />
          </Link>
        </OverlayTrigger>

        <BiEdit
          size={24}
          onClick={handleEdit}
          style={{ cursor: "pointer", marginRight: "10px" }}
        />

        <BiTrash
          size={24}
          onClick={handleDelete}
          style={{ cursor: "pointer" }}
        />
      </div>

      <Modal show={showEditModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier le Module</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formModuleName">
            <Form.Label>Nom du Module</Form.Label>
            <Form.Control
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Enregistrer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CardIconeModule;
