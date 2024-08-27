import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BiDetail, BiEdit, BiTrash } from "react-icons/bi";
import { Button, Modal, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "react-query";
import { deleteModule } from "../../api/apiModule";
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
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <OverlayTrigger
          overlay={<Tooltip>Accéder aux leçons</Tooltip>}
          placement="top"
        >
          <Link to={`/dashboard/lessons/${moduleId}`}>
            <StyledIconButton backgroundColor="#007bff" hoverColor="#0056b3">
              <BiDetail size={23} />
            </StyledIconButton>
          </Link>
        </OverlayTrigger>

        <StyledIconButton
          onClick={handleEdit}
          backgroundColor="#28a745"
          hoverColor="#218838"
        >
          <BiEdit size={24} />
        </StyledIconButton>

        <StyledIconButton
          onClick={handleDelete}
          backgroundColor="#dc3545"
          hoverColor="#c82333"
        >
          <BiTrash size={24} />
        </StyledIconButton>
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
