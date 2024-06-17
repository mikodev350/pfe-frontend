import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import { loginAPI } from "../../api/authApi";
// import "./login.css";
import Layout from "../../components/layout/Layout";

const LoginSchema = Yup.object().shape({
  identifier: Yup.string().email("Invalid email").required("Email Required"),
  password: Yup.string().required("Password Required"),
});

const Login = () => {
  const [values] = useState({
    identifier: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  function witchPage(token) {
    const role = localStorage.getItem("role");

    if (role === "STUDENT") {
      if (token) {
        window.location.href = `/invite-section/${token}`;
      }
      navigate("/student/section");
    } else if (role === "TEACHER") {
      navigate("/teacher/section");
    }
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsSubmitting(true);
    try {
      const response = await loginAPI(values);
      if (response && response.token) {
        localStorage.setItem("token", response.token);
        witchPage(response.token);
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
    <Layout fullcontent={true} backgroundColorIdentification={true}>
      <ToastContainer />
      <div className="main-login-container">
        <Row className="justify-content-center">
          <Col md={6} className="image-login">
            <div className="background-image"></div>
          </Col>
          <Col md={6} id="login-box">
            <Formik
              initialValues={values}
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
                  <h2 className="text-center custom-heading">Login</h2>
                  <Form.Group className="mb-3 mt-5" controlId="formBasicEmail">
                    <Form.Label className="ms-4">Email address</Form.Label>
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
                    <Form.Label className="ms-4">Password</Form.Label>
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
                      className="w-50 button-Login btn-color mt-5"
                    >
                      Login
                    </Button>
                    <div className="text-center mt-2 forgot">
                      <p>
                        Having trouble logging in?&nbsp;
                        <Link to={"/"}>Forgot your password?</Link>
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
  );
};

export default Login;
