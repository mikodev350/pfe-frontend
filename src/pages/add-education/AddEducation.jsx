import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { Container, Form, Row, Col, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { validationSchema } from '../../validator/educationValidationSchema';
import { getToken } from '../../util/authUtils';
import { createEducation, updateEducation, getEducation } from '../../api/apiProfile';
import { useParams, useNavigate } from "react-router-dom";

// Styled components
const StyledTitle = styled.h1`
  background-color: #10266f;
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  text-align: center;
  font-size: 1.5rem;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.15);
  margin-bottom: 20px;
`;

const StyledCard = styled.div`
  background-color: #ffffff;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.1); /* Enhanced shadow */
  border-radius: 16px; /* Smoother rounded corners */
  padding: 20px 30px;
  max-width: 800px;
  width: 100%;
  margin-top: 20px;
`;

const StyledButton = styled(Button)`
  border-radius: 20px;
  padding: 10px 20px;
  font-weight: bold;
  &:hover {
    opacity: 0.9;
  }
`;

const AddEducation = () => {
  const token = React.useMemo(() => getToken(), []);
  const { educationId } = useParams();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      ecole: '',
      diplome: '',
      domaineEtude: '',
      dateDebut: '',
      dateFin: null,
      ecoleActuelle: false,
      descriptionProgramme: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        let response;
        if (educationId) {
          response = await updateEducation(educationId, values, token);
        } else {
          response = await createEducation(values, token);
        }
        navigate('/dashboard/edit-profile');
      } catch (error) {
        console.error('Error saving education:', error);
      }
    }
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
            descriptionProgramme: education.descriptionProgramme
          });
        } catch (error) {
          console.error('Error fetching education:', error);
        }
      };
      fetchEducation();
    }
  }, [educationId, token]);

  return (
    <Container className="d-flex justify-content-center">
      <StyledCard>
        <StyledTitle>{educationId ? 'Modifier' : 'Ajouter'} une éducation</StyledTitle>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group controlId="ecole">
            <Form.Label>École</Form.Label>
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
            <Form.Label>Diplôme</Form.Label>
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
            <Form.Label>Domaine d'étude</Form.Label>
            <Form.Control
              type="text"
              name="domaineEtude"
              value={formik.values.domaineEtude}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.domaineEtude && formik.errors.domaineEtude}
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
                  value={formik.values.dateFin || ''}
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
              label="École actuelle"
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
              isInvalid={formik.touched.descriptionProgramme && formik.errors.descriptionProgramme}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.descriptionProgramme}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex justify-content-between mt-4">
            <StyledButton variant="secondary" onClick={() => navigate('/dashboard/edit-profile')}>Retour</StyledButton>
            <StyledButton type="submit" variant="primary">{educationId ? 'Mettre à jour' : 'Envoyer'}</StyledButton>
          </div>
        </Form>
      </StyledCard>
    </Container>
  );
};

export default AddEducation;
