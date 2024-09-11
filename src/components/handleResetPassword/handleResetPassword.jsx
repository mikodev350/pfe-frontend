import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom"; 
import { API_BASE_URL } from "../../constants/constante";

// Schéma de validation du formulaire
const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Le mot de passe doit avoir au moins 6 caractères")
    .required("Mot de passe requis"),
  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref("password"), null], "Les mots de passe ne correspondent pas")
    .required("Confirmation du mot de passe requise"),
});

const ResetPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); 
  const token = searchParams.get("token"); // Récupérer le token depuis l'URL

  const handleResetPassword = async (values) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
        code: token, // Token récupéré de l'URL
        password: values.password, 
        passwordConfirmation: values.passwordConfirmation,
      });

      if (response.status === 200) {
        toast.success("Mot de passe réinitialisé avec succès.", {
          position: "top-right",
          autoClose: 5000,
        });
        navigate("/login"); // Rediriger vers la page de connexion
      }
    } catch (error) {
      toast.error(
        "Erreur lors de la réinitialisation du mot de passe: " + error.message,
        {
          position: "top-right",
          autoClose: 5000,
        }
      );
    }
    setIsSubmitting(false); // Réactive le bouton après traitement
  };

  return (
    <Formik
      initialValues={{ password: "", passwordConfirmation: "" }}
      validationSchema={ResetPasswordSchema}
      onSubmit={handleResetPassword}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
      }) => (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Nouveau mot de passe</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.password && errors.password ? "is-invalid" : ""}
              placeholder="Entrez votre nouveau mot de passe"
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPasswordConfirmation">
            <Form.Label>Confirmer le nouveau mot de passe</Form.Label>
            <Form.Control
              type="password"
              name="passwordConfirmation"
              value={values.passwordConfirmation}
              onChange={handleChange}
              onBlur={handleBlur}
              className={
                touched.passwordConfirmation && errors.passwordConfirmation
                  ? "is-invalid"
                  : ""
              }
              placeholder="Confirmez votre nouveau mot de passe"
            />
            <Form.Control.Feedback type="invalid">
              {errors.passwordConfirmation}
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            disabled={isSubmitting}
            className="w-100 mt-3"
          >
            Réinitialiser le mot de passe
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default ResetPassword;
