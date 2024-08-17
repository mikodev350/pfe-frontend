import React from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import Button from "react-bootstrap/Button";

const GroupTaskModal = ({ show, handleClose, handleTaskAssign, options }) => (
  <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>Assigner un Quiz ou un Devoir</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group controlId="taskSelection">
          <Form.Label>Sélectionner les tâches</Form.Label>
          <Select
            isMulti
            options={options}
            placeholder="Sélectionnez un quiz ou un devoir"
          />
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
        Annuler
      </Button>
      <Button variant="primary" onClick={handleTaskAssign}>
        Assigner
      </Button>
    </Modal.Footer>
  </Modal>
);

export default GroupTaskModal;
