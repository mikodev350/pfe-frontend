import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import { API_BASE_URL } from "../../constants/constante";

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Email invalide").required("Email requis"),
});

const ForgotPasswordModal = ({ show, handleClose }) => {
  const handleForgotPassword = async (values, { setSubmitting }) => {
    setSubmitting(true); // Active l'état de soumission du formulaire
    try {
      // La requête POST vers /user/forgot-password
      const response = await axios.post(
        `${API_BASE_URL}/user-custom/forgot-password`,
        {
          email: values.email,
        }
      );

      if (response.status === 200) {
        toast.success("Email de réinitialisation envoyé avec succès.", {
          position: "top-right",
          autoClose: 5000,
        });
        handleClose(); // Ferme le modal après succès
      }
    } catch (error) {
      toast.error("Erreur lors de l'envoi de l'email: " + error.message, {
        position: "top-right",
        autoClose: 5000,
      });
    }
    setSubmitting(false); // Désactive l'état de soumission du formulaire
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center">
          Réinitialiser le mot de passe
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ email: "" }}
          validationSchema={ForgotPasswordSchema}
          onSubmit={handleForgotPassword}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting, // Gestion du statut de soumission
          }) => (
            <Form
              onSubmit={handleSubmit}
              className="d-flex flex-column align-items-center"
            >
              <Form.Group className="mb-3 w-100" controlId="formBasicEmail">
                <Form.Label>Adresse e-mail</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={touched.email && errors.email ? "is-invalid" : ""}
                  placeholder="Entrez votre adresse e-mail"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Styled Button */}
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting} // Désactive le bouton si le formulaire est en cours de soumission
                className="w-100  shadow-lg btn-lg"
                style={{
                  backgroundColor: "#1e90ff", // Custom background color
                  borderColor: "#1e90ff", // Custom border color
                  color: "#fff", // Text color
                  borderRadius: "30px", // Rounded corners
                  padding: "10px 20px", // Padding for larger button size
                  fontSize: "18px", // Larger font size
                }}
              >
                {isSubmitting ? "Envoi en cours..." : "Confirmer"}
              </Button>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default ForgotPasswordModal;
