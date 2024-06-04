import React, { useState, useEffect } from "react";
import { Button, Form, Container, Row } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getToken } from "../../util/authUtils";
import { updatePathway, getPathwayById } from "../../api/ApiParcour";
import { useParams,useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
  nom: Yup.string().required("Nom du parcours est requis"),
  type: Yup.string().required("Type du parcours est requis"),
  etablissement: Yup.string(),
  autoApprentissage: Yup.boolean(),
});

const UpdatePathwayForm = () => {
  const navigate = useNavigate();

      const { pathwayId } = useParams();

  const [initialValues, setInitialValues] = useState(null);

  const token = React.useMemo(() => getToken(), []);

  useEffect(() => {
    const fetchPathway = async () => {
      try {
        const response = await getPathwayById(pathwayId, token);
        setInitialValues(response.data);
      } catch (error) {
        console.error('Error fetching pathway:', error);
      }
    };

    fetchPathway();
  }, [pathwayId, token]);

  const formik = useFormik({
    initialValues: initialValues || {
      nom: '',
      type: 'académique',
      etablissement: '',
      autoApprentissage: false,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {

      try {
        const response = await updatePathway(pathwayId, values, token);
        console.log('Pathway updated successfully:', response);
                      navigate("/student/parcours");

      } catch (error) {
        console.error('Error updating pathway:', error);
      }
    },
  });



  return (
    <Container>
      <Row className="padding-row-top margin-left padding-form">
        <h3 className="text-center">Modifier le parcours</h3>
        <Form className="mt-5" onSubmit={formik.handleSubmit}>
          <Form.Group className="mt-4" controlId="nom">
            <Form.Label>Nom du {formik.values.type === 'continue' ? 'domaine' : 'parcours'}</Form.Label>
            <Form.Control
              type="text"
              name="nom"
              value={formik.values.nom}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.touched.nom && formik.errors.nom
                  ? "form-control is-invalid"
                  : "form-control"
              }
            />
            {formik.touched.nom && formik.errors.nom && (
              <div className="text-danger">{formik.errors.nom}</div>
            )}
          </Form.Group>

          <Form.Group className="mt-4" controlId="type">
            <Form.Label>Type de parcours</Form.Label>
            <Form.Control
              as="select"
              name="type"
              value={formik.values.type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="académique">Académique</option>
              <option value="continue">Continue</option>
            </Form.Control>
            {formik.touched.type && formik.errors.type && (
              <div className="text-danger">{formik.errors.type}</div>
            )}
          </Form.Group>

          <Form.Group className="mt-4" controlId="autoApprentissage">
            <Form.Check
              type="checkbox"
              name="autoApprentissage"
              label="Auto-apprentissage"
              checked={formik.values.autoApprentissage}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Form.Group>

          {(formik.values.type !== 'continue' && !formik.values.autoApprentissage) && (
            <Form.Group className="mt-4" controlId="etablissement">
              <Form.Label>Établissement</Form.Label>
              <Form.Control
                type="text"
                name="etablissement"
                value={formik.values.etablissement}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.touched.etablissement && formik.errors.etablissement
                    ? "form-control is-invalid"
                    : "form-control"
                }
              />
              {formik.touched.etablissement && formik.errors.etablissement && (
                <div className="text-danger">{formik.errors.etablissement}</div>
              )}
            </Form.Group>
          )}

          <Button variant="primary" type="submit" className="mt-4">
            Enregistrer le {formik.values.type === 'continue' ? 'domaine' : 'parcours'}
          </Button>
        </Form>
      </Row>
    </Container>
  );
};

export default UpdatePathwayForm;
