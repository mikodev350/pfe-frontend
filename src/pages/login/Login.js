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
import loginStyle from "./login.css";
import ForgotPasswordModal from "../../components/ForgotPasswordModal/ForgotPasswordModal";
// import loginImage from "./img/Mobile login-cuate.png"; // Importation de l'image

// Schéma de validation du formulaire
const LoginSchema = Yup.object().shape({
  identifier: Yup.string().email("Email invalide").required("Email requis"),
  password: Yup.string().required("Mot de passe requis"),
});

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false); // Initialisation de l'état pour le modal

  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsSubmitting(true);
    try {
      const response = await loginAPI(values);

      if (response && response.jwt) {
        localStorage.setItem("token", response.jwt);
        localStorage.setItem("userId", response.user.id);
        localStorage.setItem("username", response.user.username);
        localStorage.setItem("role", response.user.type);

        // DASHEBOARD_STUDENT;
        // Initialiser les données critiques après la connexion

        if (response.user.type.toUpperCase() === "TEACHER") {
          localStorage.setItem("currentRoute", "DASHEBOARD_TEACHER");
        } else if (response.user.type.toUpperCase() === "STUDENT") {
          localStorage.setItem("currentRoute", "DASHEBOARD_STUDENT");
        }
        await initializeCriticalData(response.jwt);

        // Rediriger vers le tableau de bord
        navigate("/dashboard/home");
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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      <Helmet>
        <link rel="stylesheet" type="text/css" href="./login.css" />
      </Helmet>
      <Layout
        center={true}
        fullcontent={true}
        backgroundColorIdentification={true}
      >
        <ToastContainer />
        <div
          className="main-login-container"
          style={{
            marginTop: "20px",
          }}
        >
          <div>
            <Row
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center", // Corrected spacing
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Subtle shadow effect
                borderRadius: "10px", // Slightly smaller border radius for subtle rounding
                padding: "0", // No extra padding, to maintain the original size
                backgroundColor: "#ffffff", // Background to ensure the shadow is visible
              }}
            >
              {/* Colonne pour l'image */}
              {windowWidth > 900 && (
                <Col md={6} className="image-login">
                  <img
                    src={"./assets/img/Mobile login-cuate.png"}
                    alt="Login Illustration"
                    className="image-style w-100"
                  />
                </Col>
              )}

              {/* Colonne pour le formulaire */}
              <Col md={6}>
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
                    <Form onSubmit={handleSubmit} className="mt-5 ">
                      <h2
                        className="text-center "
                        style={{
                          fontSize: "2rem",
                          fontWeight: "bold",
                          color: "#1e7fc9",
                        }}
                      >
                        {" "}
                        {"Se\u00A0connecter"}{" "}
                      </h2>
                      <Form.Group
                        className="mb-3 mt-5"
                        controlId="formBasicEmail"
                      >
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
                          className="button-Login  w-100 mt-3 mb-3"
                        >
                          {"Se\u00A0connecter"}
                        </Button>
                        <div className="text-center mt-2 forgot">
                          <p>
                            Vous avez des difficultés à vous connecter ?&nbsp;
                            <span
                              style={{ cursor: "pointer", color: "blue" }}
                              onClick={() => setShowForgotPasswordModal(true)} // Afficher le modal
                            >
                              Mot de passe oublié ?
                            </span>
                          </p>
                        </div>
                        <hr />
                        <Button
                          variant="secondary"
                          className="button-Login  w-100"
                          onClick={() => navigate("/signup")}
                        >
                          {"Créer un compte"}
                        </Button>
                      </Form.Group>
                    </Form>
                  )}
                </Formik>
              </Col>
            </Row>
          </div>
        </div>
        <ForgotPasswordModal
          show={showForgotPasswordModal}
          handleClose={() => setShowForgotPasswordModal(false)}
        />
      </Layout>
    </>
  );
};

export default Login;
