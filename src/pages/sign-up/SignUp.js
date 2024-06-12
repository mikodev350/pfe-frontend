import React, { useState } from "react";
import { Form, Button, ProgressBar, Row, Col } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import { register, updateRole } from "../../api/authApi"; // Ensure these functions are correctly exported from authApi.js
import { useNavigate } from "react-router-dom";
import wilayas from "./../../api/fakeData/wilayas.json";
import { ToastContainer, toast } from "react-toastify";
import Layout from "../../components/layout/Layout";

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
        const updateRoleResponse = await updateRole(values.type);

        if (updateRoleResponse) {
          const token = localStorage.getItem("token");
          if (token) {
            console.log(token);
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
    <Layout fullcontent={true}>
      <div id="signUp-box">
        <ToastContainer />
        <Row className="position-relative justify-content-center overflow-hidden">
          <Col xs={12} md={8} id="signUp-column">
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
                <Form id="signUp-form" onSubmit={handleSubmit}>
                  <ProgressBar now={(step / 4) * 100} />
                  {step === 1 && (
                    <>
                      <Form.Group className="mb-3" controlId="formtype">
                        <Form.Label>Rôle :</Form.Label>
                        <Form.Control
                          as="select"
                          name="type"
                          value={values.type}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={
                            touched.type && errors.type ? "is-invalid" : ""
                          }
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
                        <Form.Label>Nom d'utilisateur :</Form.Label>
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
                              : ""
                          }
                          placeholder="Nom d'utilisateur"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.username}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email :</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="email"
                          className={
                            touched.email && errors.email ? "is-invalid" : ""
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Button
                        variant="primary"
                        onClick={nextStep}
                        className="button-Login btn-color"
                      >
                        Suivant
                      </Button>
                    </>
                  )}
                  {step === 2 && (
                    <>
                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                      >
                        <Form.Label>Mot de passe :</Form.Label>
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
                              : ""
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.password}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="formBasicConfirmPassword"
                      >
                        <Form.Label>Confirmation du mot de passe :</Form.Label>
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
                              : ""
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.confirmPassword}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Button
                        variant="secondary"
                        onClick={prevStep}
                        className="button-Login btn-color"
                      >
                        Précédent
                      </Button>
                      <Button
                        variant="primary"
                        onClick={nextStep}
                        className="button-Login btn-color"
                      >
                        Suivant
                      </Button>
                    </>
                  )}
                  {step === 3 && (
                    <>
                      <Form.Group className="mb-3" controlId="formPhoneNumber">
                        <Form.Label>Numéro de téléphone :</Form.Label>
                        <Form.Control
                          type="text"
                          name="phoneNumber"
                          value={values.phoneNumber}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={
                            touched.phoneNumber && errors.phoneNumber
                              ? "is-invalid"
                              : ""
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.phoneNumber}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formDateOfBirth">
                        <Form.Label>Date de naissance :</Form.Label>
                        <Form.Control
                          type="date"
                          name="dateOfBirth"
                          value={values.dateOfBirth}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={
                            touched.dateOfBirth && errors.dateOfBirth
                              ? "is-invalid"
                              : ""
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.dateOfBirth}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Button
                        variant="secondary"
                        onClick={prevStep}
                        className="button-Login btn-color"
                      >
                        Précédent
                      </Button>
                      <Button
                        variant="primary"
                        onClick={nextStep}
                        className="button-Login btn-color"
                      >
                        Suivant
                      </Button>
                    </>
                  )}
                  {step === 4 && (
                    <>
                      <Form.Group className="mb-3" controlId="formWilaya">
                        <Form.Label>Wilaya :</Form.Label>
                        <Form.Control
                          as="select"
                          name="wilaya"
                          value={values.wilaya}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={
                            touched.wilaya && errors.wilaya ? "is-invalid" : ""
                          }
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
                        <Form.Label>Adresse :</Form.Label>
                        <Form.Control
                          type="text"
                          name="address"
                          value={values.address}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={
                            touched.address && errors.address
                              ? "is-invalid"
                              : ""
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.address}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formPostalCode">
                        <Form.Label>Code postal :</Form.Label>
                        <Form.Control
                          type="text"
                          name="postalCode"
                          value={values.postalCode}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={
                            touched.postalCode && errors.postalCode
                              ? "is-invalid"
                              : ""
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.postalCode}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formGender">
                        <Form.Label>Sexe :</Form.Label>
                        <Form.Control
                          as="select"
                          name="gender"
                          value={values.gender}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={
                            touched.gender && errors.gender ? "is-invalid" : ""
                          }
                        >
                          <option value="">Sélectionner le sexe</option>
                          <option value="male">Masculin</option>
                          <option value="female">Féminin</option>
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          {errors.gender}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Button
                        variant="secondary"
                        onClick={prevStep}
                        className="button-Login btn-color"
                      >
                        Précédent
                      </Button>
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={isSubmitting}
                        className="button-Login btn-color"
                      >
                        Register
                      </Button>
                    </>
                  )}
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

export default SignUp;
