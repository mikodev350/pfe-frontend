import React, { useState } from "react";
import { Button, Form, Container, Row, Col, ListGroup } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import AddModuleModal from "../AddModuleForm/AddModuleModal";

// Validation schema for the form
const validationSchema = Yup.object({
  pathwayName: Yup.string().required("Nom du parcours est requis"),
  pathwayType: Yup.string().required("Type du parcours est requis"),
  institution: Yup.string(),
  selfLearning: Yup.boolean(),
});

const AddPathwayForm = ({ onSave }) => {
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [modules, setModules] = useState([]);
  const [editingModuleIndex, setEditingModuleIndex] = useState(null);

  const formik = useFormik({
    initialValues: {
      pathwayName: '',
      pathwayType: 'académique',
      institution: '',
      selfLearning: false,
    },
    validationSchema,
    onSubmit: (values) => {
      const pathwayData = { ...values, modules };
      console.log("Enregistrer le parcours:", pathwayData); // Afficher les données dans la console
      onSave(pathwayData);
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
          <Form.Group className="mt-4" controlId="pathwayName">
            <Form.Label>Nom du {formik.values.pathwayType === 'continu' ? 'domaine' : 'parcours'}</Form.Label>
            <Form.Control
              type="text"
              name="pathwayName"
              value={formik.values.pathwayName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.touched.pathwayName && formik.errors.pathwayName
                  ? "form-control is-invalid"
                  : "form-control"
              }
            />
            {formik.touched.pathwayName && formik.errors.pathwayName && (
              <div className="text-danger">{formik.errors.pathwayName}</div>
            )}
          </Form.Group>

          <Form.Group className="mt-4" controlId="pathwayType">
            <Form.Label>Type de parcours</Form.Label>
            <Form.Control
              as="select"
              name="pathwayType"
              value={formik.values.pathwayType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="académique">Académique</option>
              <option value="continu">Continu</option>
            </Form.Control>
            {formik.touched.pathwayType && formik.errors.pathwayType && (
              <div className="text-danger">{formik.errors.pathwayType}</div>
            )}
          </Form.Group>

          <Form.Group className="mt-4" controlId="selfLearning">
            <Form.Check
              type="checkbox"
              name="selfLearning"
              label="Auto-apprentissage"
              checked={formik.values.selfLearning}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Form.Group>

          {(formik.values.pathwayType !== 'continu' && !formik.values.selfLearning) && (
            <Form.Group className="mt-4" controlId="institution">
              <Form.Label>Établissement</Form.Label>
              <Form.Control
                type="text"
                name="institution"
                value={formik.values.institution}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.touched.institution && formik.errors.institution
                    ? "form-control is-invalid"
                    : "form-control"
                }
              />
              {formik.touched.institution && formik.errors.institution && (
                <div className="text-danger">{formik.errors.institution}</div>
              )}
            </Form.Group>
          )}

          <Button variant="secondary" onClick={handleAddModule} className="mt-4">
            Ajouter une {formik.values.pathwayType === 'continu' ? 'formation' : 'module'}
          </Button>

          <div className="mt-3">
            {modules.map((module, index) => (
              <div key={index} className="mb-3 p-2 border rounded">
                <Row className="align-items-center">
                  <Col md={4}>
                    <strong>{module.moduleName}</strong> ({module.lessons.length} {formik.values.pathwayType === 'continu' ? 'cours' : 'leçons'})
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
            Enregistrer le {formik.values.pathwayType === 'continu' ? 'domaine' : 'parcours'}
          </Button>
        </Form>
      </Row>

      <AddModuleModal
        show={showModuleModal}
        handleClose={() => { setShowModuleModal(false); setEditingModuleIndex(null); }}
        onSave={handleSaveModule}
        initialData={editingModuleIndex !== null ? modules[editingModuleIndex] : null}
        pathwayType={formik.values.pathwayType}  // Pass the pathwayType to the modal
      />
    </Container>
  );
};

export default AddPathwayForm;
