import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModelLesson = ({
  show,
  handleClose,
  onSaveLesson,
  initialData,
  moduleId,
}) => {
  const [lessonData, setLessonData] = useState({
    name: "",
  });

  useEffect(() => {
    if (initialData) {
      setLessonData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLessonData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSaveLesson({ ...lessonData, module: moduleId });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {initialData ? "Modifier leçon" : "Ajouter leçon"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formLessonName">
            <Form.Label>Nom de leçon</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={lessonData.name}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
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

export default ModelLesson;
