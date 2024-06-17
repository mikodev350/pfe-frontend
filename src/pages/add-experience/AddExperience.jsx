import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { experienceValidationSchema } from '../../validator/experienceValidationSchema';
import { getToken } from '../../util/authUtils';
import { createExperience, updateExperience, getExperience } from '../../api/apiProfile';
import { useParams, useNavigate } from "react-router-dom";

const AddExperience = () => {
  const token = React.useMemo(() => getToken(), []);
  const { experienceId } = useParams();
  const navigate = useNavigate(); // Utilisation de useNavigate pour la redirection

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
        console.log('Submitting form...');
        let response;
        if (experienceId) {
          console.log('Updating experience with ID:', experienceId);
          response = await updateExperience(experienceId, values, token);
          console.log('Experience updated:', response);
        } else {
          console.log('Creating new experience');
          response = await createExperience(values, token);
          console.log('Experience created:', response);
        }
        console.log('Redirection en cours...');
        navigate('/student/edit-profile'); // Redirection après la soumission réussie
      } catch (error) {
        console.error('Error saving experience:', error);
      }
    }
  });

  useEffect(() => {
    if (experienceId) {
      const fetchExperience = async () => {
        try {
          console.log('Fetching experience with ID:', experienceId);
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
          console.log('Experience fetched:', experience);
        } catch (error) {
          console.error('Error fetching experience:', error);
        }
      };

      fetchExperience();
    }
    // eslint-disable-next-line
  }, [experienceId, token]);

  return (
    <Container fluid className="mt-5">
      <Row className="justify-content-center">
          <Card className="container-dashboard card-custom ">
            <Card.Header as="h1" className="text-center card-header-custom shadow-sm">{experienceId ? 'Modifier' : 'Ajouter'} une expérience</Card.Header>
            <Card.Body>
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

                <div className="d-flex justify-content-between">
                  <Button variant="secondary" onClick={() => navigate('/student/edit-profile')}>Retour</Button>
                                  <Button type="submit" variant="primary">{experienceId ? 'Mettre à jour' : 'Envoyer'}</Button>

                </div>
              </Form>
            </Card.Body>
          </Card>
      </Row>
    </Container>
  );
};

export default AddExperience;
