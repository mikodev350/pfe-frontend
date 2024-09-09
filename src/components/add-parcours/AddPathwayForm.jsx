import React, { useState } from "react";
import { Button, Form, Container, Row, Col, ListGroup, Spinner } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import AddModuleModal from "../AddModuleForm/AddModuleModal";
import { getToken } from "../../util/authUtils";
import { createPathway } from "../../api/ApiParcour";
import Swal from "sweetalert2"; // Import SweetAlert
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { BiArrowBack } from "react-icons/bi";

// Styled Card Container
const StyledCardContainer = styled.div`
  background-color: #ffffff; /* Fond blanc */
  border-radius: 8px; /* Coins arrondis */
  padding: 20px; /* Padding interne */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Ombre pour un effet de carte */
  margin-bottom: 20px; /* Espace en bas de la carte */
`;

const StyledTitle = styled.h2`
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
`;

// Styled Back Button Container
const BackButtonContainer = styled.div`
  width: 120px !important;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px 15px;
  border-radius: 20px !important; /* Rounded corners */
  cursor: pointer;
  background-color: #10266F !important; /* Blue background */
  color: white !important; /* White text color */
  border: 2px solid #10266F !important; /* Border matching the background */
  transition: background-color 0.3s ease, border-color 0.3s ease;

  svg {
    font-size: 24px !important;
    color: white !important; /* White icon color */
  }

  span {
    margin-left: 8px;
    font-weight: 500 !important;
    font-size: 18px !important;
    color: white !important; /* White text color */
  }

  &:hover {
    background-color: #0056b3 !important; /* Darker blue on hover */
    border-color: #0056b3 !important;
  }

  &:active {
    background-color: #003d80 !important; /* Even darker blue on click */
    border-color: #003d80 !important;
  }
`;

// Validation schema for the form
const validationSchema = Yup.object({
  nom: Yup.string().required("Nom du parcours est requis"),
  type: Yup.string().required("Type du parcours est requis"),
  etablissement: Yup.string(),
  autoApprentissage: Yup.boolean(),
});

const AddPathwayForm = ({ onSave }) => {
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [modules, setModules] = useState([]);
  const [editingModuleIndex, setEditingModuleIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loader state

  // Get the token 
  const token = React.useMemo(() => getToken(), []);
  
  // Use useNavigate for navigation
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      nom: '',
      type: 'académique',
      etablissement: '',
      autoApprentissage: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true); // Show loader
      const pathwayData = { ...values, modules };
      console.log("Enregistrer le parcours:", pathwayData);
      
      try {
        const response = await createPathway(pathwayData, token);
        console.log('Pathway created successfully:', response);
        
        if (onSave) {
          onSave(response);
        }

        // Show success notification with SweetAlert
        Swal.fire({
          title: 'Succès!',
          text: 'Parcours créé avec succès!',
          icon: 'success',
          confirmButtonText: 'OK'
        });

        // Redirect to the previous page or another page
        setTimeout(() => {
          navigate(-1);
        }, 2000);
      } catch (error) {
        console.error('Error creating pathway:', error);

        // Show error notification with SweetAlert
        Swal.fire({
          title: 'Erreur!',
          text: 'Erreur lors de la création du parcours.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      } finally {
        setIsLoading(false); // Hide loader
      }
    },
  });

  const handleSaveModule = (moduleData) => {
    if (editingModuleIndex !== null) {
      const updatedModules = [...modules];
      updatedModules[editingModuleIndex] = moduleData;
      setModules(updatedModules);
      setEditingModuleIndex(null);
    } else {
      setModules([...modules, moduleData]);
    }
    setShowModuleModal(false);
  };

  const handleEditModule = (index) => {
    setEditingModuleIndex(index);
    setShowModuleModal(true);
  };

  const handleAddModule = () => {
    setEditingModuleIndex(null);
    setShowModuleModal(true);
  };

  const handleDeleteModule = (index) => {
    const updatedModules = modules.filter((_, i) => i !== index);
    setModules(updatedModules);
  };

  return (
    <Container>
      <StyledCardContainer>
        <BackButtonContainer onClick={() => navigate(-1)}>
          <BiArrowBack />
          <span>Retour</span>
        </BackButtonContainer>
        <Row >
          <Form className="mt-5" onSubmit={formik.handleSubmit}>
            <StyledTitle>Ajouter un parcours</StyledTitle>

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

            <Button variant="secondary" onClick={handleAddModule} className="mt-4">
              Ajouter  {formik.values.type === 'continue' ? 'formation' : 'module'}
            </Button>
            
            <div className="mt-3">
              {modules.map((module, index) => (
                <div key={index} className="mb-3 p-2 border rounded">
                  <Row className="align-items-center">
                    <Col md={4}>
                      <strong>{module.nom}</strong> ({module.lessons.length} {formik.values.type === 'continue' ? 'cours' : 'leçons'})
                    </Col>
                    <Col md={4} className="text-right">
                      <Button variant="link" onClick={() => handleEditModule(index)} className="mr-2">Modifier</Button>
                    </Col>
                    <Col md={4} className="text-right">
                      <Button variant="link" onClick={() => handleDeleteModule(index)} className="text-danger">Supprimer</Button>
                    </Col>
                  </Row>
                  <h5 className="mt-3">Cours</h5>
                  <ListGroup>
                    {module.lessons.map((lesson, lessonIndex) => (
                      <ListGroup.Item key={lessonIndex}>{lesson}</ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              ))}
            </div>
            
            <Col md={{ span: 7, offset: 4 }}>
              {isLoading ? (
                <Button variant="primary" disabled className="mt-4 w-100 w-md-auto" style={{ height: "52px", maxWidth: "250px", width: "100%" }}>
                  <Spinner animation="border" size="sm" role="status" aria-hidden="true" />
                  <span className="sr-only">Chargement...</span>
                </Button>
              ) : (
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="mt-4 w-100 w-md-auto" 
                  style={{ height: "52px", maxWidth: "250px", width: "100%" }}
                >
                  Enregistrer le {formik.values.type === 'continue' ? 'domaine' : 'parcours'}
                </Button>
              )}
            </Col>
          </Form>
        </Row>

        <AddModuleModal
          show={showModuleModal}
          handleClose={() => { setShowModuleModal(false); setEditingModuleIndex(null); }}
          onSave={handleSaveModule}
          initialData={editingModuleIndex !== null ? modules[editingModuleIndex] : null}
          type={formik.values.type}  // Pass the type to the modal
        />
      </StyledCardContainer>
    </Container>
  );
};

export default AddPathwayForm;
