import React, { useState, useEffect } from "react";
import { Button, Form, Container, Row } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getToken } from "../../util/authUtils";
import { updatePathway, getPathwayById } from "../../api/ApiParcour";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Retour from "../retour-arriere/Retour";
import Swal from "sweetalert2"; // Importer SweetAlert pour les notifications

const validationSchema = Yup.object({
  nom: Yup.string().required("Nom du parcours est requis"),
  type: Yup.string().required("Type du parcours est requis"),
  etablissement: Yup.string().nullable(),
  autoApprentissage: Yup.boolean().nullable(),
});

// Styled Components
const StyledCardContainer = styled(Container)`
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const StyledTitle = styled.h3`
  font-size: 2.5rem;
  font-weight: bold;
  color: #10266f;
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  border-bottom: 2px solid #3949ab;
  padding-bottom: 0.5rem;

  @media (max-width: 576px) {  // Media query pour mobile (taille écran max 576px)
    font-size: 1.8rem; // Réduire la taille du texte pour mobile
    margin-top: 1rem;
    margin-bottom: 1rem;
    padding-bottom: 0.3rem;
  }
`;


const StyledForm = styled(Form)`
  margin-top: 20px;
`;

const StyledFormGroup = styled(Form.Group)`
  margin-top: 20px;
`;

const StyledFormControl = styled(Form.Control)`
  &.form-control {
    border-radius: 8px;
    box-shadow: none;
    border: 1px solid #ced4da;
    padding: 10px 12px;
    &:focus {
      border-color: #10266f;
      box-shadow: 0 0 0 0.2rem rgba(16, 38, 111, 0.25);
    }
  }

  &.form-control.is-invalid {
    border-color: #dc3545;
  }

  // Specific styles for the select element
  &.form-control-select {
    appearance: none;
    background-color: #ffffff;
    color: #495057;
    padding-right: 30px;
    border-radius: 8px;
    padding: 10px 12px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='%23495057' d='M2 0L0 2h4zM2 5L0 3h4z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 12px;
    border: 1px solid #ced4da;
    &:focus {
      border-color: #10266f;
      box-shadow: 0 0 0 0.2rem rgba(16, 38, 111, 0.25);
    }
  }

  &.form-control-select:focus {
    background-color: #e9ecef;
  }
`;


const StyledCheck = styled(Form.Check)`
  margin-top: 20px;
`;

const StyledButton = styled(Button)`
  background-color: #3949ab;
  border: none;
  font-weight: bold;
  border-radius: 8px;
  padding: 12px 20px;
  color: white;
  transition: background-color 0.3s ease;
  margin-top: 20px;

  &:hover {
    background-color: #2c387e;
  }

  &:active {
    background-color: #1b255f;
  }

  &:disabled {
    background-color: #9fa8da;
  }
`;

const UpdatePathwayForm = () => {
  const navigate = useNavigate();
  const { pathwayId } = useParams();
  const [initialValues, setInitialValues] = useState(null);
  const token = React.useMemo(() => getToken(), []);

  useEffect(() => {
    const fetchPathway = async () => {
      try {
        const response = await getPathwayById(pathwayId, token);
        if (response.data) {
          setInitialValues(response.data);
        }
      } catch (error) {
        console.error("Error fetching pathway:", error);
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
        if (response.status === 'offline') {
          Swal.fire({
            title: 'Succès!',
            text: 'Parcours mis à jour hors ligne.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        } else {
          Swal.fire({
            title: 'Succès!',
            text: 'Parcours mis à jour avec succès!',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        }
        navigate('/dashboard/parcours');
      } catch (error) {
        Swal.fire({
          title: 'Erreur!',
          text: 'Erreur lors de la mise à jour du parcours.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    },
  });

  return (
    <StyledCardContainer>
      <Retour />
      <Row>
        <StyledForm onSubmit={formik.handleSubmit}>
                  <StyledTitle>Modifier le parcours</StyledTitle>

          <StyledFormGroup controlId="nom">
            <Form.Label>
              Nom du {formik.values.type === 'continue' ? 'domaine' : 'parcours'}
            </Form.Label>
            <StyledFormControl
              type="text"
              name="nom"
              value={formik.values.nom}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.nom && formik.errors.nom}
            />
            {formik.touched.nom && formik.errors.nom && (
              <div className="text-danger">{formik.errors.nom}</div>
            )}
          </StyledFormGroup>

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

          <StyledCheck
            type="checkbox"
            name="autoApprentissage"
            label="Auto-apprentissage"
            checked={formik.values.autoApprentissage}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          {(formik.values.type !== 'continue' && !formik.values.autoApprentissage) && (
            <StyledFormGroup controlId="etablissement">
              <Form.Label>Établissement</Form.Label>
              <StyledFormControl
                type="text"
                name="etablissement"
                value={formik.values.etablissement}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.etablissement && formik.errors.etablissement}
              />
              {formik.touched.etablissement && formik.errors.etablissement && (
                <div className="text-danger">{formik.errors.etablissement}</div>
              )}
            </StyledFormGroup>
          )}
          
          <div className="d-flex justify-content-center">
            <StyledButton type="submit">
              Enregistrer le {formik.values.type === 'continue' ? 'domaine' : 'parcours'}
            </StyledButton>
          </div>
        </StyledForm>
      </Row>
    </StyledCardContainer>
  );
};

export default UpdatePathwayForm;
