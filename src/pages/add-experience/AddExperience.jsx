import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { experienceValidationSchema } from '../../validator/experienceValidationSchema';
import { getToken } from '../../util/authUtils';
import { createExperience, updateExperience, getExperience } from '../../api/apiProfile';
import { useParams } from "react-router-dom";

const AddExperience = () => {
  const token = React.useMemo(() => getToken(), []);
  const { experienceId } = useParams(); // Correctly use idModule from useParams

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
          console.log('Experience updated:', response);
        } else {
          response = await createExperience(values, token);
          console.log('Experience created:', response);
        }
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
    // eslint-disable-next-line
  }, [experienceId, token]);

  return (
    <Container>
      <h1 className="mt-5 mb-4">{experienceId ? 'Modifier' : 'Ajouter'} une expérience</h1>
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

        <Form.Group controlId="posteActuel">
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

        <Button type="submit">{experienceId ? 'Mettre à jour' : 'Envoyer'}</Button>
        <Button variant="secondary" className="ml-2" onClick={() => formik.resetForm()}>Retour</Button>
      </Form>
    </Container>
  );
};

export default AddExperience;
