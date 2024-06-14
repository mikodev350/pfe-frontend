import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import wilayas from "../../api/fakeData/wilayas.json"; // Import the wilayas data

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Le prénom est requis"),
  email: Yup.string().email("Email invalide").required("L'email est requis"),
  phone: Yup.string().required("Le téléphone est requis"),
  postalCode: Yup.string().required("Le code postal est requis"),
  wilaya: Yup.string().required("La wilaya est requise"),
  dateOfBirth: Yup.date().required("La date de naissance est requise"),
  address: Yup.string().required("L'adresse est requise"),
});

function AccountInformationForm({ userData, handleSave }) {
  const formik = useFormik({
    initialValues: {
      username: userData.username,
      email: userData.email,
      phone: userData.phoneNumber,
      postalCode: userData.postalCode,
      wilaya: userData.wilaya,
      dateOfBirth: userData.dateOfBirth,
      address: userData.address,
    },
    validationSchema,
    onSubmit: (values) => {
      handleSave(values);
    },
  });

  return (
    <Container>
      <Form onSubmit={formik.handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Prénom</Form.Label>
              <Form.Control
                type="text"
                name="username"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
                isInvalid={!!formik.errors.username && formik.touched.username}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.username}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                isInvalid={!!formik.errors.email && formik.touched.email}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.email}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3" controlId="phone">
              <Form.Label>Téléphone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
                isInvalid={!!formik.errors.phone && formik.touched.phone}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.phone}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3" controlId="postalCode">
              <Form.Label>Code Postal</Form.Label>
              <Form.Control
                type="text"
                name="postalCode"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.postalCode}
                isInvalid={!!formik.errors.postalCode && formik.touched.postalCode}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.postalCode}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3" controlId="wilaya">
              <Form.Label>Wilaya</Form.Label>
              <Form.Control
                as="select"
                name="wilaya"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.wilaya}
                isInvalid={!!formik.errors.wilaya && formik.touched.wilaya}
              >
                <option value="">Sélectionner une wilaya</option>
                {wilayas.map((wilaya) => (
                  <option key={wilaya.id} value={wilaya.name}>
                    {wilaya.name}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {formik.errors.wilaya}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3" controlId="dateOfBirth">
              <Form.Label>Date de Naissance</Form.Label>
              <Form.Control
                type="date"
                name="dateOfBirth"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.dateOfBirth}
                isInvalid={!!formik.errors.dateOfBirth && formik.touched.dateOfBirth}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.dateOfBirth}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group className="mb-3" controlId="address">
              <Form.Label>Adresse</Form.Label>
              <Form.Control
                type="text"
                name="address"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.address}
                isInvalid={!!formik.errors.address && formik.touched.address}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.address}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-center">
          <Button variant="primary" type="submit">
            Sauvegarder
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default AccountInformationForm;
