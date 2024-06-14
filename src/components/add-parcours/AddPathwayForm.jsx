import React, { useState } from "react";
import { Button, Form, Container, Row, Col, ListGroup } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import AddModuleModal from "../AddModuleForm/AddModuleModal";
import { getToken } from "../../util/authUtils";
import { createPathway } from "../../api/ApiParcour";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

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
      const pathwayData = { ...values, modules };
      console.log("Enregistrer le parcours:", pathwayData); // Afficher les données dans la console
      
      try {
        const response = await createPathway(pathwayData, token);
        console.log('Pathway created successfully:', response);
        
        if (onSave) {
          onSave(response);
        }

        // Show success notification
        toast.success("Parcours créé avec succès!");

        // Redirect to the previous page or another page
        setTimeout(() => {
          navigate(-1);
        }, 2000);
      } catch (error) {
        console.error('Error creating pathway:', error);

        // Show error notification
        toast.error("Erreur lors de la création du parcours.");
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
    setEditingModuleIndex(null);  // Ensure the modal is reset
    setShowModuleModal(true);
  };

  const handleDeleteModule = (index) => {
    const updatedModules = modules.filter((_, i) => i !== index);
    setModules(updatedModules);
  };

  return (
    <Container>
      <Row className="padding-row-top margin-left padding-form">
        <h3 className="text-center">Ajouter un parcours</h3>
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

          <Button variant="secondary" onClick={handleAddModule} className="mt-4">
            Ajouter une {formik.values.type === 'continue' ? 'formation' : 'module'}
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

          <Button variant="primary" type="submit" className="mt-4">
            Enregistrer le {formik.values.type === 'continue' ? 'domaine' : 'parcours'}
          </Button>
        </Form>
      </Row>

      <AddModuleModal
        show={showModuleModal}
        handleClose={() => { setShowModuleModal(false); setEditingModuleIndex(null); }}
        onSave={handleSaveModule}
        initialData={editingModuleIndex !== null ? modules[editingModuleIndex] : null}
        type={formik.values.type}  // Pass the type to the modal
      />

      <ToastContainer />
    </Container>
  );
};

export default AddPathwayForm;
