import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BiDetail, BiEdit, BiTrash } from "react-icons/bi";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Button, Modal, Form } from "react-bootstrap";

const TableIconeModule = ({
  moduleId,
  moduleName,
  dataLabel,
  handleUpdateModule,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [newName, setNewName] = useState(moduleName);

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleClose = () => {
    setShowEditModal(false);
  };

  const handleSave = () => {
    handleUpdateModule(moduleId, newName);
    setShowEditModal(false);
  };

  return (
    <>
      <td data-label={dataLabel} style={{ alignItems: "center" }}>
        <OverlayTrigger
          overlay={<Tooltip>Accès au leçon</Tooltip>}
          placement="top"
          popperConfig={{
            modifiers: [{ name: "offset", options: { offset: [0, 8] } }],
          }}
        >
          <Link
            to={`/student/lessons/${moduleId}`}
            className="icon-option"
            style={{ color: "black" }}
          >
            <BiDetail size={23} />
          </Link>
        </OverlayTrigger>
        <span className="icon-option" style={{ paddingLeft: "5px" }}>
          <BiEdit size={24} onClick={handleEdit} />
        </span>
        <span className="icon-option">
          <BiTrash size={24} />
        </span>
      </td>

      <Modal show={showEditModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier Module</Modal.Title>
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

export default TableIconeModule;
