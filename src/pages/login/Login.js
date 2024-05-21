import { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
// import { FaGoogle, FaFacebookF } from "react-icons/fa";
import "./login.css";
import Layout from "../../components/layout/Layout";

// import { loginAPI } from "../../api/authApi";
// import { getToken } from "../../util/authUtils";
// import { ToastContainer } from "react-toastify";

const LoginSchema = Yup.object().shape({
  identifier: Yup.string().email("Invalid email").required("Email Required"),
  password: Yup.string().required("Password Required"),
});

const Login = () => {
  const { token } = useParams();

  const [values] = useState({
    identifier: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  function witchPage() {
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
    // try {
    //   const response = await loginAPI(values);
    //   if (response) {
    //     // witchPage();
    //     // const token = getToken();
    //     // console.log("test token" + token);
    //   }
    // } catch (error) {
    //   console.log("An error occurred:", error);
    // }
    setIsSubmitting(false);
  };
  
  return (
    <Layout fullcontent={true} backgroundColorIdentification={true}>
       <div className="main-login-container">
        <Row className="justify-content-center">
          <Col md={6} className="image-login">
          <div className="background-image"></div>
          </Col>
          <Col md={6} id="login-box" >
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
                {/* Login with Facebook & Googel in comment  */}
                {/* <div className="text-center forgot">
                  <Button variant="light" className="button-login">
                    <span>
                      <FaGoogle size={24} />
                    </span>
                  </Button>
                  <Button variant="light" className="button-login">
                    <span>
                      <FaFacebookF size={24} />
                    </span>
                  </Button>
                </div> */}
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
                        
                    } style={{ borderColor: "#1e7fc9c2" }}
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
                      touched.password && errors.password ? "is-invalid" : "border-1"
                    }style={{ borderColor: "#1e7fc9c2" }}
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
                    <p>Having trouble logging in?&nbsp;
                    <Link to={"/"}>Forgot your password?</Link></p>
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
