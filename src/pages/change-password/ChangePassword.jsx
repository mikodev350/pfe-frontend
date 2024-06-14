import React from "react";
import { Container, Row, Form, Col, Button, Card } from "react-bootstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import { getToken } from "../../util/authUtils";
import { changePassword } from "../../api/apiSettingsSelf";
import { toast, ToastContainer } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';

function ChangePassword() {
  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required("Le mot de passe actuel est requis"),
    password: Yup.string()
      .min(6, "Le mot de passe doit comporter au moins 6 caractères")
      .required("Le nouveau mot de passe est requis"),
    passwordConfirmation: Yup.string()
      .oneOf([Yup.ref("password"), null], "Les mots de passe doivent correspondre")
      .required("La confirmation du mot de passe est requise"),
  });

  const token = React.useMemo(() => getToken(), []);

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      password: "",
      passwordConfirmation: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await changePassword(
          values.currentPassword,
          values.password,
          values.passwordConfirmation,
          token
        );
        toast.success("Mot de passe changé avec succès", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        setSubmitting(false);
      } catch (error) {
        toast.error("Erreur lors du changement de mot de passe", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        console.error("Erreur lors du changement de mot de passe:", error);
        setSubmitting(false);
      }
    },
  });

  return (
    <Container className="bg-light p-5 rounded shadow-sm" style={{ marginBottom: "100px" }}>
      <ToastContainer /> {/* Add this line to include the toast container */}
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="p-4">
            <Card.Body>
              <h3 className="text-center mb-4">Changez votre mot de passe</h3>
              <Form onSubmit={formik.handleSubmit}>
                <Form.Group className="mb-3" controlId="currentPassword">
                  <Form.Label>Mot de passe actuel:</Form.Label>
                  <Form.Control
                    type="password"
                    name="currentPassword"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.currentPassword}
                    autoComplete="current-password"
                    isInvalid={formik.touched.currentPassword && formik.errors.currentPassword}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.currentPassword}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Nouveau mot de passe:</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    autoComplete="new-password"
                    isInvalid={formik.touched.password && formik.errors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="passwordConfirmation">
                  <Form.Label>Confirmez le nouveau mot de passe:</Form.Label>
                  <Form.Control
                    type="password"
                    name="passwordConfirmation"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.passwordConfirmation}
                    autoComplete="new-password"
                    isInvalid={formik.touched.passwordConfirmation && formik.errors.passwordConfirmation}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.passwordConfirmation}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-flex justify-content-center">
                  <Button
                    type="submit"
                    variant="primary"
                    className="button-save"
                    size="lg"
                    disabled={formik.isSubmitting}
                  >
                    {formik.isSubmitting ? "Sauvegarde..." : "Sauvegarder"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ChangePassword;
