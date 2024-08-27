import React, { useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { BiTrash } from "react-icons/bi";
import styled from "styled-components";

// Styled Components
const StyledModalBody = styled(Modal.Body)`
  padding: 20px;
`;

const StyledFormGroup = styled(Form.Group)`
  margin-bottom: 15px;
`;

const StyledFormControl = styled(Form.Control)`
  border-radius: 20px;
  padding-right: 40px;
  flex: 1;
`;

const DeleteButton = styled(Button)`
  border-radius: 50%;
  width: 40px !important;
  height: 40px !important;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  margin-top: 0px;

  @media (max-width: 576px) {
    margin-top: 10px;
    margin-left: 0;
  }
`;

const LessonRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const StyledButton = styled(Button)`
  border-radius: 20px;
  padding: 10px;
  width: 100%;
  background-color: ${(props) =>
    props.variant === "danger" ? "#dc3545" : "#003366"};
  border: none;
  margin-bottom: ${(props) => (props.mb ? "20px" : "0")};
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 0.875em;
  margin-top: 5px;
`;

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
      <StyledModalBody>
        <Form onSubmit={formik.handleSubmit}>
          <StyledFormGroup controlId="nom">
            <Form.Label>
              Nom de la {type === "continue" ? "formation" : "module"}
            </Form.Label>
            <StyledFormControl
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
              <ErrorMessage>{formik.errors.nom}</ErrorMessage>
            )}
          </StyledFormGroup>

          {formik.values.lessons.map((lesson, index) => (
            <StyledFormGroup key={index} controlId={`lesson${index}`}>
              <Form.Label>
                Nom du {type === "continue" ? "cours" : "leçon"}
              </Form.Label>
              <LessonRow>
                <StyledFormControl
                  type="text"
                  value={lesson}
                  onChange={(event) => handleLessonChange(index, event)}
                />
                <DeleteButton
                  variant="danger"
                  onClick={() => handleRemoveLesson(index)}
                >
                  <BiTrash size={14} />
                </DeleteButton>
              </LessonRow>
              {formik.touched.lessons &&
                formik.touched.lessons[index] &&
                formik.errors.lessons &&
                formik.errors.lessons[index] && (
                  <ErrorMessage>{formik.errors.lessons[index]}</ErrorMessage>
                )}
            </StyledFormGroup>
          ))}

          <StyledButton variant="secondary" onClick={handleAddLesson} mb="true">
            Ajouter un {type === "continue" ? "cours" : "leçon"}
          </StyledButton>

          <Modal.Footer
            style={{
              padding: "0",
              borderTop: "none",
              marginTop: "20px",
            }}
          >
            <StyledButton variant="primary" type="submit">
              Enregistrer la {type === "continue" ? "formation" : "module"}
            </StyledButton>
          </Modal.Footer>
        </Form>
      </StyledModalBody>
    </Modal>
  );
};

export default AddModuleModal;
