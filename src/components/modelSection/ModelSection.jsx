import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { Formik, Field } from "formik";
import * as Yup from "yup";

const initialValues = {
  name: "",
};

const validationSchema = Yup.object({
  name: Yup.string().required("Name of section is required"),
});

const ModelSection = ({ onAddSection }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async (values, actions) => {
    try {
      onAddSection(values.name);

      actions.resetForm();
      setShow(false);
    } catch (error) {
      console.error("Error adding section:", error);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <>
      <Button className="button-dashboard btn-color" onClick={handleShow}>
        <span className="button-span-size">ajouer un module</span>
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>ajouer un module</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ handleSubmit, errors, touched }) => (
              <Form onSubmit={handleSubmit}>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>Name of Section</Form.Label>
                  <Field
                    type="text"
                    name="name"
                    className={`form-control ${
                      touched.name && errors.name ? "is-invalid" : ""
                    }`}
                    autoFocus
                  />
                  {touched.name && errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </Form.Group>

                <Modal.Footer>
                  <Button
                    variant="primary"
                    className="button-model"
                    type="submit"
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
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ModelSection;
 