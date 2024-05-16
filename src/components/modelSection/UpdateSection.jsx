import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { BiEdit } from "react-icons/bi";

// UpdateSection component
const UpdateSection = ({ sectionId, currentName, handleSubmit }) => {
  const [show, setShow] = useState(false); // State to manage modal visibility
  const [updatedName, setUpdatedName] = useState(currentName); // State to manage the updated name

  // Function to close the modal
  const handleClose = () => setShow(false);

  // Function to show the modal
  const handleShow = () => setShow(true);

  // Function to handle save changes click, which will call the passed handleSubmit function
  const handleSaveChanges = () => {
    handleSubmit(sectionId, updatedName);
    handleClose(); // Close the modal after saving changes
  };

  return (
    <>
      <BiEdit size={23} onClick={handleShow} />

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Section</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Update Section</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                autoFocus
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)} // Update state when text changes
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            className="button-model"
            onClick={handleSaveChanges}
          >
            Save Changes
          </Button>
          <Button
            variant="secondary"
            className="button-model"
            onClick={handleClose}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UpdateSection;
