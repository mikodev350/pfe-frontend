import React, { useEffect } from "react";
import { useFormik } from "formik";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import { validationSchema } from "../../validator/educationValidationSchema";
import { getToken } from "../../util/authUtils";
import { createEducation, updateEducation, getEducation } from "../../api/apiProfile";
import { useParams, useNavigate } from "react-router-dom";

const AddEducationForm = () => {
  const token = React.useMemo(() => getToken(), []);
  const { educationId } = useParams();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      ecole: "",
      diplome: "",
      domaineEtude: "",
      dateDebut: "",
      dateFin: null,
      ecoleActuelle: false,
      descriptionProgramme: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        let response;
        if (educationId) {
          response = await updateEducation(educationId, values, token);
          console.log('Education updated:', response);
        } else {
          response = await createEducation(values, token);
          console.log('Education created:', response);
        }
        console.log('Redirection en cours...');
        navigate('/student/edit-profile'); // Redirection après la soumission réussie
      } catch (error) {
        console.error('Error saving education:', error);
      }
    },
  });

  useEffect(() => {
    if (educationId) {
      const fetchEducation = async () => {
        try {
          const education = await getEducation(educationId, token);
          formik.setValues({
            ecole: education.ecole,
            diplome: education.diplome,
            domaineEtude: education.domaineEtude,
            dateDebut: education.dateDebut,
            dateFin: education.dateFin,
            ecoleActuelle: education.ecoleActuelle,
            descriptionProgramme: education.descriptionProgramme,
          });
        } catch (error) {
          console.error('Error fetching education:', error);
        }
      };

      fetchEducation();
    }
    // eslint-disable-next-line
  }, [educationId, token]);

  return (
    <Container fluid className="mt-5">
      <Row className="justify-content-center">
          <Card className="container-dashboard card-custom">
            <Card.Header as="h1" className="text-center card-header-custom shadow-sm">{educationId ? 'Modifier' : 'Ajouter'} votre éducation</Card.Header>
            <Card.Body>
              <Form onSubmit={formik.handleSubmit}>
                <Form.Group controlId="ecole">
                  <Form.Label>École ou Bootcamp</Form.Label>
                  <Form.Control
                    type="text"
                    name="ecole"
                    value={formik.values.ecole}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.ecole && formik.errors.ecole}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.ecole}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="diplome">
                  <Form.Label>Diplôme ou Certificat</Form.Label>
                  <Form.Control
                    type="text"
                    name="diplome"
                    value={formik.values.diplome}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.diplome && formik.errors.diplome}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.diplome}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="domaineEtude">
                  <Form.Label>Champ d'étude</Form.Label>
                  <Form.Control
                    type="text"
                    name="domaineEtude"
                    value={formik.values.domaineEtude}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.domaineEtude && formik.errors.domaineEtude
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.domaineEtude}
                  </Form.Control.Feedback>
                </Form.Group>

                <Row>
                  <Col>
                    <Form.Group controlId="dateDebut">
                      <Form.Label>Date de début</Form.Label>
                      <Form.Control
                        type="date"
                        name="dateDebut"
                        value={formik.values.dateDebut}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.dateDebut && formik.errors.dateDebut}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.dateDebut}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="dateFin">
                      <Form.Label>Date de fin</Form.Label>
                      <Form.Control
                        type="date"
                        name="dateFin"
                        value={formik.values.dateFin || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.dateFin && formik.errors.dateFin}
                        disabled={formik.values.ecoleActuelle}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.dateFin}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group controlId="ecoleActuelle" className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="École ou Bootcamp actuel"
                    name="ecoleActuelle"
                    checked={formik.values.ecoleActuelle}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Form.Group>

                <Form.Group controlId="descriptionProgramme">
                  <Form.Label>Description du programme</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="descriptionProgramme"
                    value={formik.values.descriptionProgramme}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.descriptionProgramme &&
                      formik.errors.descriptionProgramme
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.descriptionProgramme}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-flex justify-content-between">
                  <Button variant="secondary" onClick={() => navigate('/student/edit-profile')}>Retour</Button>
                  <Button type="submit" variant="primary">{educationId ? 'Mettre à jour' : 'Soumettre'}</Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
      </Row>
    </Container>
  );
};

export default AddEducationForm;
