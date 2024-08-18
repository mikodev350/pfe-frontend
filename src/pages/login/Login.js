import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import { loginAPI } from "../../api/authApi";
import Layout from "../../components/layout/Layout";
import { Helmet } from "react-helmet";
import initializeCriticalData from "../../hooks/initializeCriticalData";
import loginStyle from './login.css';
import loginImage from './img/Mobile login-cuate.png'; // Importation de l'image

// Schéma de validation du formulaire
const LoginSchema = Yup.object().shape({
  identifier: Yup.string().email("Email invalide").required("Email requis"),
  password: Yup.string().required("Mot de passe requis"),
});

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsSubmitting(true);
    try {
      const response = await loginAPI(values);

      if (response && response.jwt) {
        localStorage.setItem("token", response.jwt);
        localStorage.setItem("userId", response.user.id);
        localStorage.setItem("username", response.user.username);
        localStorage.setItem("role", response.type);

        // Initialiser les données critiques après la connexion
        await initializeCriticalData(response.jwt);

        // Rediriger vers le tableau de bord
        navigate('/dashboard/');
      }
    } catch (error) {
      toast.error("An error occurred: " + error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <link rel="stylesheet" type="text/css" href="./login.css" />
      </Helmet>
      <Layout fullcontent={true} backgroundColorIdentification={true}>
        <ToastContainer />
        <div className="main-login-container">
          <Row className="w-100 no-gutters">
            {/* Colonne pour l'image */}
            <Col md={6} className="image-login">
              <img src={loginImage} alt="Login Illustration" className="image-style w-100" />
            </Col>
            
            {/* Colonne pour le formulaire */}
            <Col md={6} id="login-box">
              <Formik
                initialValues={{ identifier: "", password: "" }}
                validationSchema={LoginSchema}
                onSubmit={handleSubmit}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                }) => (
                  <Form onSubmit={handleSubmit} className="mt-5">
                    <h2 className="text-center custom-heading">Connexion</h2>
                    <Form.Group className="mb-3 mt-5" controlId="formBasicEmail">
                      <Form.Label className="ms-4">Adresse e-mail</Form.Label>
                      <Form.Control
                        type="email"
                        name="identifier"
                        value={values.identifier}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={
                          touched.identifier && errors.identifier
                            ? "is-invalid"
                            : "border-1"
                        }
                        style={{ borderColor: "#1e7fc9c2" }}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.identifier}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                      <Form.Label className="ms-4">Mot de passe</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={
                          touched.password && errors.password
                            ? "is-invalid"
                            : "border-1"
                        }
                        style={{ borderColor: "#1e7fc9c2" }}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3 text-center">
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={isSubmitting}
                        className="w-50 button-Login btn-color mt-5 mb-2"
                      >
                        {"Se\u00A0connecter"}
                      </Button>
                      <div className="text-center mt-2 forgot">
                        <p>
                        Vous avez des difficultés à vous connecter ?&nbsp;
                          <Link to={"/"}>Mot de passe oublié ?</Link>
                        </p>
                      </div>
                    </Form.Group>
                  </Form>
                )}
              </Formik>
            </Col>
          </Row>
        </div>
      </Layout>
    </>
  );
};

export default Login;
