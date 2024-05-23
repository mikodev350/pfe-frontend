import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";

const ModelModule = ({ show, handleClose, onSave, initialData }) => {
  const [moduleName, setModuleName] = useState("");

  useEffect(() => {
    if (initialData) {
      setModuleName(initialData.name);
    }
  }, [initialData]);

  const handleSave = () => {
    onSave({ ...initialData, name: moduleName });
    setModuleName("");
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {initialData ? "Modifier le module" : "Ajouter un module"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="moduleName">
            <Form.Label>Nom du module</Form.Label>
            <Form.Control
              type="text"
              placeholder="Entrer le nom du module"
              value={moduleName}
              onChange={(e) => setModuleName(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Fermer
        </Button>
        <Button variant="primary" onClick={handleSave}>
          {initialData ? "Modifier" : "Ajouter"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModelModule;
