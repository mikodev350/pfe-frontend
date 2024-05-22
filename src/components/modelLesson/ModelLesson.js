import React, { useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  name: Yup.string().required("Le nom de la leçon est requis"),
  idModule: Yup.number().required("L'ID du module est requis"),
});

const ModelLesson = ({ show, handleClose, onSaveLesson, initialData }) => {
  const formik = useFormik({
    initialValues: initialData || {
      name: "",
      idModule: "", // Ensure this matches the expected ID type
    },
    validationSchema,
    onSubmit: (values) => {
      onSaveLesson(values);
      handleClose();
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (!initialData) {
      formik.resetForm();
    }
  }, [show, initialData]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {initialData ? "Modifier" : "Ajouter"} une leçon
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group controlId="lessonName">
            <Form.Label>Nom de la leçon</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.name && !!formik.errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.name}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="moduleId">
            <Form.Label>ID du module</Form.Label>
            <Form.Control
              type="number"
              name="idModule"
              value={formik.values.idModule}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.idModule && !!formik.errors.idModule}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.idModule}
            </Form.Control.Feedback>
          </Form.Group>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              {initialData ? "Mettre à jour" : "Ajouter"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModelLesson;
