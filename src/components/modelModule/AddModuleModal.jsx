import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const AddModuleModal = ({ show, handleClose, handleAddModule }) => {
  const [moduleName, setModuleName] = useState("");

  const handleSave = () => {
    handleAddModule(moduleName);
    setModuleName("");
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Ajouter un module</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="formModuleName">
          <Form.Label>Nom du Module</Form.Label>
          <Form.Control
            type="text"
            value={moduleName}
            onChange={(e) => setModuleName(e.target.value)}
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
  );
};

export default AddModuleModal;
