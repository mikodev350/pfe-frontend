import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";

const ModelModule = ({
  show,
  handleClose,
  onSaveModule,
  initialData,
  parcourId,
}) => {
  const formik = useFormik({
    initialValues: {
      nom: initialData ? initialData.nom : "",
    },
    validationSchema: Yup.object({
      nom: Yup.string().required("Nom du module est requis"),
    }),
    onSubmit: (values) => {
      onSaveModule({ ...values, parcour: Number(parcourId) });
      handleClose();
    },
  });

  React.useEffect(() => {
    if (initialData) {
      formik.setValues({ nom: initialData.nom });
    }
  }, [initialData]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {initialData ? "Modifier le module" : "Ajouter un module"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group controlId="formModuleName">
            <Form.Label>Nom du module</Form.Label>
            <Form.Control
              type="text"
              name="nom"
              value={formik.values.nom}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={!!formik.errors.nom && formik.touched.nom}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.nom}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-end mt-3">
            <Button
              variant="secondary"
              onClick={handleClose}
              style={{
                width: "100%",
                height: "52px",
                marginRight: "10px",
                backgroundColor: "#6c757d",
                borderColor: "#6c757d",
              }}
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              type="submit"
              style={{
                width: "100%",
                height: "52px",
                backgroundColor: "#007bff",
                borderColor: "#007bff",
              }}
            >
              Enregistrer
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModelModule;
