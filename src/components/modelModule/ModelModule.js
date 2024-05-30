import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";

const TableIconeModule = ({ moduleId, moduleName, handleUpdateModule }) => {
  const [show, setShow] = useState(false);
  const [newName, setNewName] = useState(moduleName);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const handleSave = () => {
    handleUpdateModule(moduleId, newName);
    handleClose();
  };

  return (
    <>
      <Button variant="info" onClick={handleShow}>
        Modifier
      </Button>

      <Modal show={show} onHide={handleClose}>
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
