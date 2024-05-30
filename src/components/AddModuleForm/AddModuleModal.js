import React, { useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { BiTrash } from "react-icons/bi";

// Validation schema for the form
const validationSchema = Yup.object({
  nom: Yup.string().required("Nom du module est requis"),
  lessons: Yup.array().of(Yup.string().required("Nom de la leçon est requis")),
});

const AddModuleModal = ({ show, handleClose, onSave, initialData, type }) => {
  const formik = useFormik({
    initialValues: initialData || {
      nom: "",
      lessons: [""],
    },
    validationSchema,
    onSubmit: (values) => {
      onSave(values);
      handleClose();
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (!initialData) {
      formik.resetForm();
    }
    // eslint-disable-next-line
  }, [show, initialData]);

  const handleLessonChange = (index, event) => {
    const lessons = [...formik.values.lessons];
    lessons[index] = event.target.value;
    formik.setFieldValue("lessons", lessons);
  };

  const handleAddLesson = () => {
    formik.setFieldValue("lessons", [...formik.values.lessons, ""]);
  };

  const handleRemoveLesson = (index) => {
    const lessons = [...formik.values.lessons];
    lessons.splice(index, 1);
    formik.setFieldValue("lessons", lessons);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {initialData ? "Modifier" : "Ajouter"} une{" "}
          {type === "continue" ? "formation" : "module"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group controlId="nom">
            <Form.Label>
              Nom de la {type === "continue" ? "formation" : "module"}
            </Form.Label>
            <Form.Control
              type="text"
              name="nom"
              value={formik.values.nom}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.touched.nom && formik.errors.nom
                  ? "form-control is-invalid"
                  : "form-control"
              }
            />
            {formik.touched.nom && formik.errors.nom && (
              <div className="text-danger">{formik.errors.nom}</div>
            )}
          </Form.Group>

          {formik.values.lessons.map((lesson, index) => (
            <Form.Group key={index} controlId={`lesson${index}`}>
              <Row className="align-items-center">
                <Col sm={8}>
                  <Form.Label>
                    Nom du {type === "continue" ? "cours" : "leçon"}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={lesson}
                    onChange={(event) => handleLessonChange(index, event)}
                    className="mb-2"
                  />
                  {formik.touched.lessons &&
                    formik.touched.lessons[index] &&
                    formik.errors.lessons &&
                    formik.errors.lessons[index] && (
                      <div className="text-danger">
                        {formik.errors.lessons[index]}
                      </div>
                    )}
                </Col>
                <Col
                  sm={2}
                  className="text-right"
                  style={{ paddingTop: "35px" }}
                >
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveLesson(index)}
                    className="mb-2"
                  >
                    <BiTrash />
                  </Button>
                </Col>
              </Row>
            </Form.Group>
          ))}

          <Button
            variant="secondary"
            onClick={handleAddLesson}
            className="mb-3"
          >
            Ajouter un {type === "continue" ? "cours" : "leçon"}
          </Button>

          <Modal.Footer>
            <Row className="mt-3 w-100">
              <Col xs={6} className="text-left">
                <Button
                  variant="secondary"
                  onClick={handleClose}
                  className="mr-2"
                >
                  Annuler
                </Button>
              </Col>
              <Col xs={6} className="text-right">
                <Button variant="primary" type="submit">
                  Enregistrer la {type === "continue" ? "formation" : "module"}
                </Button>
              </Col>
            </Row>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddModuleModal;
