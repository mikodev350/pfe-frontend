import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { Container, Form, Row, Col, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { experienceValidationSchema } from '../../validator/experienceValidationSchema';
import { getToken } from '../../util/authUtils';
import { createExperience, updateExperience, getExperience } from '../../api/apiProfile';
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

const AddExperience = () => {
  const token = React.useMemo(() => getToken(), []);
  const { experienceId } = useParams();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      titrePoste: '',
      entreprise: '',
      localisation: '',
      dateDebut: '',
      dateFin: null,
      posteActuel: false,
      descriptionPoste: ''
    },
    validationSchema: experienceValidationSchema,
    onSubmit: async (values) => {
      try {
        let response;
        if (experienceId) {
          response = await updateExperience(experienceId, values, token);
        } else {
          response = await createExperience(values, token);
        }
        navigate('/student/edit-profile');
      } catch (error) {
        console.error('Error saving experience:', error);
      }
    }
  });

  useEffect(() => {
    if (experienceId) {
      const fetchExperience = async () => {
        try {
          const experience = await getExperience(experienceId, token);
          formik.setValues({
            titrePoste: experience.titrePoste,
            entreprise: experience.entreprise,
            localisation: experience.localisation,
            dateDebut: experience.dateDebut,
            dateFin: experience.dateFin,
            posteActuel: experience.posteActuel,
            descriptionPoste: experience.descriptionPoste
          });
        } catch (error) {
          console.error('Error fetching experience:', error);
        }
      };
      fetchExperience();
    }
  }, [experienceId, token]);

  return (
    <Container  className=" d-flex justify-content-center">
      <StyledCard>
        <StyledTitle>{experienceId ? 'Modifier' : 'Ajouter'} une expérience</StyledTitle>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group controlId="titrePoste">
            <Form.Label>Titre du poste</Form.Label>
            <Form.Control
              type="text"
              name="titrePoste"
              value={formik.values.titrePoste}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.titrePoste && formik.errors.titrePoste}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.titrePoste}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="entreprise">
            <Form.Label>Entreprise</Form.Label>
            <Form.Control
              type="text"
              name="entreprise"
              value={formik.values.entreprise}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.entreprise && formik.errors.entreprise}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.entreprise}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="localisation">
            <Form.Label>Localisation</Form.Label>
            <Form.Control
              type="text"
              name="localisation"
              value={formik.values.localisation}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.localisation && formik.errors.localisation}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.localisation}
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
                  disabled={formik.values.posteActuel}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.dateFin}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="posteActuel" className="mb-3">
            <Form.Check
              type="checkbox"
              label="Poste actuel"
              name="posteActuel"
              checked={formik.values.posteActuel}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Form.Group>

          <Form.Group controlId="descriptionPoste">
            <Form.Label>Description du poste</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descriptionPoste"
              value={formik.values.descriptionPoste}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.descriptionPoste && formik.errors.descriptionPoste}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.descriptionPoste}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex justify-content-between mt-4">
            <StyledButton variant="secondary" onClick={() => navigate('/dashboard/edit-profile')}>Retour</StyledButton>
            <StyledButton type="submit" variant="primary">{experienceId ? 'Mettre à jour' : 'Envoyer'}</StyledButton>
          </div>
        </Form>
      </StyledCard>
    </Container>
  );
};

export default AddExperience;
