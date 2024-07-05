import React, { useState } from "react";
import { Form, Button, ProgressBar, Row, Col } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import { register } from "../../api/authApi"; // Ensure these functions are correctly exported from authApi.js
import { useNavigate } from "react-router-dom";
import wilayas from "./../../api/fakeData/wilayas.json";
import { ToastContainer, toast } from "react-toastify";
import Layout from "../../components/layout/Layout";
import { Helmet } from "react-helmet";
import "react-toastify/dist/ReactToastify.css";

const SignUpSchema = Yup.object().shape({
  username: Yup.string().required("Nom d'utilisateur requis"),
  email: Yup.string().email("Email invalide").required("Email requis"),
  password: Yup.string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères")
    .required("Mot de passe requis"),
  confirmPassword: Yup.string()
    .oneOf(
      [Yup.ref("password"), null],
      "Les mots de passe doivent correspondre"
    )
    .required("Confirmation du mot de passe requise"),
  phoneNumber: Yup.string()
    .matches(
      /^\d+$/,
      "Le numéro de téléphone doit contenir uniquement des chiffres"
    )
    .required("Numéro de téléphone requis"),
  dateOfBirth: Yup.date().required("Date de naissance requise"),
  address: Yup.string().required("Adresse requise"),
  wilaya: Yup.string().required("Wilaya requise"),
  postalCode: Yup.string().required("Code postal requis"),
  gender: Yup.string().required("Sexe requis"),
  type: Yup.string().required("Rôle requis"),
});

const SignUp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    dateOfBirth: "",
    address: "",
    wilaya: "",
    postalCode: "",
    gender: "",
    type: "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await register(values);
      if (response) {
        const token = localStorage.getItem("token");
        if (token) {
          if (values.type === "STUDENT") {
            navigate("/student/parcour");
          } else {
            navigate("/teacher/parcour");
          }
        } else {
          toast.error("Token is missing, please login again.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      }
    } catch (error) {
      toast.error("An error occurred, please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    setSubmitting(false);
  };

  const nextStep = () => setStep((prevStep) => prevStep + 1);
  const prevStep = () => setStep((prevStep) => prevStep - 1);

  return (
    <>
      <Helmet>
        <link rel="stylesheet" type="text/css" href="/css/SignUp.css" />
      </Helmet>
      <Layout fullcontent={true} backgroundColorIdentification={true}>
        <ToastContainer />
        <div className="main-signup-container">
          <Row className="justify-content-center">
            <Col md={6} className="image-signup">
              <div className="background-image"></div>
            </Col>
            <Col md={6} id="signup-box">
              <Formik
                initialValues={initialValues}
                validationSchema={SignUpSchema}
                onSubmit={handleSubmit}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                }) => (
                  <Form onSubmit={handleSubmit} className="mt-5">
                    <h2 className="text-center custom-heading">S'inscrire</h2>
                    <ProgressBar now={(step / 4) * 100} className="mb-4" />
                    {step === 1 && (
                      <>
                        <Form.Group className="mb-3 mt-5" controlId="formtype">
                          <Form.Label className="ms-4">Rôle :</Form.Label>
                          <Form.Control
                            as="select"
                            name="type"
                            value={values.type}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={
                              touched.type && errors.type
                                ? "is-invalid"
                                : "border-1"
                            }
                            style={{ borderColor: "#1e7fc9c2" }}
                          >
                            <option value="">Sélectionner le rôle</option>
                            <option value="STUDENT">Étudiant</option>
                            <option value="TEACHER">Enseignant</option>
                          </Form.Control>
                          <Form.Control.Feedback type="invalid">
                            {errors.type}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formusername">
                          <Form.Label className="ms-4">
                            Nom d'utilisateur :
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="username"
                            value={values.username}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            autoComplete="username"
                            className={
                              touched.username && errors.username
                                ? "is-invalid"
                                : "border-1"
                            }
                            style={{ borderColor: "#1e7fc9c2" }}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.username}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                          <Form.Label className="ms-4">Email :</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            autoComplete="email"
                            className={
                              touched.email && errors.email
                                ? "is-invalid"
                                : "border-1"
                            }
                            style={{ borderColor: "#1e7fc9c2" }}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.email}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <div className="d-flex justify-content-between">
                          <Button
                            variant="primary"
                            onClick={nextStep}
                            className="button-Login btn-color w-100"
                          >
                            Suivant
                          </Button>
                        </div>
                      </>
                    )}
                    {step === 2 && (
                      <>
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicPassword"
                        >
                          <Form.Label className="ms-4">
                            Mot de passe :
                          </Form.Label>
                          <Form.Control
                            type="password"
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            autoComplete="current-password"
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
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicConfirmPassword"
                        >
                          <Form.Label className="ms-4">
                            Confirmation du mot de passe :
                          </Form.Label>
                          <Form.Control
                            type="password"
                            name="confirmPassword"
                            value={values.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            autoComplete="current-password"
                            className={
                              touched.confirmPassword && errors.confirmPassword
                                ? "is-invalid"
                                : "border-1"
                            }
                            style={{ borderColor: "#1e7fc9c2" }}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.confirmPassword}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <div className="d-flex justify-content-between">
                          <Button
                            variant="secondary"
                            onClick={prevStep}
                            className="button-Login btn-color w-45"
                          >
                            Précédent
                          </Button>
                          <Button
                            variant="primary"
                            onClick={nextStep}
                            className="button-Login btn-color w-45"
                          >
                            Suivant
                          </Button>
                        </div>
                      </>
                    )}
                    {step === 3 && (
                      <>
                        <Form.Group
                          className="mb-3"
                          controlId="formPhoneNumber"
                        >
                          <Form.Label className="ms-4">
                            Numéro de téléphone :
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="phoneNumber"
                            value={values.phoneNumber}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={
                              touched.phoneNumber && errors.phoneNumber
                                ? "is-invalid"
                                : "border-1"
                            }
                            style={{ borderColor: "#1e7fc9c2" }}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.phoneNumber}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                          controlId="formDateOfBirth"
                        >
                          <Form.Label className="ms-4">
                            Date de naissance :
                          </Form.Label>
                          <Form.Control
                            type="date"
                            name="dateOfBirth"
                            value={values.dateOfBirth}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={
                              touched.dateOfBirth && errors.dateOfBirth
                                ? "is-invalid"
                                : "border-1"
                            }
                            style={{ borderColor: "#1e7fc9c2" }}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.dateOfBirth}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <div className="d-flex justify-content-between">
                          <Button
                            variant="secondary"
                            onClick={prevStep}
                            className="button-Login btn-color w-45"
                          >
                            Précédent
                          </Button>
                          <Button
                            variant="primary"
                            onClick={nextStep}
                            className="button-Login btn-color w-45"
                          >
                            Suivant
                          </Button>
                        </div>
                      </>
                    )}
                    {step === 4 && (
                      <>
                        <Form.Group className="mb-3" controlId="formWilaya">
                          <Form.Label className="ms-4">Wilaya :</Form.Label>
                          <Form.Control
                            as="select"
                            name="wilaya"
                            value={values.wilaya}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={
                              touched.wilaya && errors.wilaya
                                ? "is-invalid"
                                : "border-1"
                            }
                            style={{ borderColor: "#1e7fc9c2" }}
                          >
                            <option value="">Sélectionner la wilaya</option>
                            {wilayas.map((wilaya) => (
                              <option key={wilaya.id} value={wilaya.name}>
                                {wilaya.name}
                              </option>
                            ))}
                          </Form.Control>
                          <Form.Control.Feedback type="invalid">
                            {errors.wilaya}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formAddress">
                          <Form.Label className="ms-4">Adresse :</Form.Label>
                          <Form.Control
                            type="text"
                            name="address"
                            value={values.address}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={
                              touched.address && errors.address
                                ? "is-invalid"
                                : "border-1"
                            }
                            style={{ borderColor: "#1e7fc9c2" }}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.address}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formPostalCode">
                          <Form.Label className="ms-4">
                            Code postal :
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="postalCode"
                            value={values.postalCode}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={
                              touched.postalCode && errors.postalCode
                                ? "is-invalid"
                                : "border-1"
                            }
                            style={{ borderColor: "#1e7fc9c2" }}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.postalCode}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGender">
                          <Form.Label className="ms-4">Sexe :</Form.Label>
                          <Form.Control
                            as="select"
                            name="gender"
                            value={values.gender}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={
                              touched.gender && errors.gender
                                ? "is-invalid"
                                : "border-1"
                            }
                            style={{ borderColor: "#1e7fc9c2" }}
                          >
                            <option value="">Sélectionner le sexe</option>
                            <option value="male">Masculin</option>
                            <option value="female">Féminin</option>
                          </Form.Control>
                          <Form.Control.Feedback type="invalid">
                            {errors.gender}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <div className="d-flex justify-content-between">
                          <Button
                            variant="secondary"
                            onClick={prevStep}
                            className="button-Login btn-color w-45"
                          >
                            Précédent
                          </Button>
                          <Button
                            variant="primary"
                            type="submit"
                            disabled={isSubmitting}
                            className="button-Login btn-color w-45"
                          >
                            S'inscrire
                          </Button>
                        </div>
                      </>
                    )}
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

export default SignUp;
