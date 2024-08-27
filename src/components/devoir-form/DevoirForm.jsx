import React, { useEffect, useState } from "react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import RichTextEditor from "../richTextEditor/RichTextEditor";
import { createDevoir, updateDevoir } from "../../api/apiDevoir";
import { getToken } from "../../util/authUtils";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import styled from "styled-components";

const validationSchema = Yup.object({
  titre: Yup.string().required("Le titre du devoir est requis"),
  description: Yup.string().required("La description du devoir est requise"),
});

// Styled button to match the overall design
const GradientButton = styled(Button)`
  background: linear-gradient(135deg, #10266f, #3949ab);
  border: 2px solid #10266f;
  color: #ffffff;
  font-weight: bold;
  border-radius: 8px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  transition: border-color 0.3s ease-in-out, background 0.3s ease-in-out,
    transform 0.2s ease-in-out;

  &:hover {
    background: linear-gradient(135deg, #3949ab, #10266f);
    transform: translateY(-3px);
    border-color: #3949ab;
  }

  &:focus {
    box-shadow: 0 0 0 0.2rem rgba(16, 38, 111, 0.25);
    outline: none;
  }

  @media (max-width: 576px) {
    font-size: 1rem;
    padding: 8px 16px;
  }
`;

export default function DevoirForm({ initialData, onClose, isEdit }) {
  const { id } = useParams(); // Récupère l'ID du devoir si on est en mode modification
  const [description, setDescription] = useState(initialData?.description || "");
  const token = getToken();
  const queryClient = useQueryClient();

  const formik = useFormik({
    initialValues: {
      titre: initialData?.titre || "",
      description: initialData?.description || "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        if (isEdit) {
          await updateDevoir(id, values, token);
        } else {
          await createDevoir(values, token);
        }
        queryClient.invalidateQueries("devoirs"); // Recharger la liste des devoirs après modification
        onClose();
      } catch (error) {
        console.error("Erreur lors de la soumission du formulaire:", error);
      }
    },
  });

  useEffect(() => {
    if (isEdit && initialData) {
      formik.setValues({
        titre: initialData.titre || "",
        description: initialData.description || "",
      });
      setDescription(initialData.description || "");
    }
  }, [initialData, isEdit]);

  const handleDescriptionChange = (content) => {
    setDescription(content);
    formik.setFieldValue("description", content);
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={8}>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group controlId="titre">
              <Form.Label>Titre du Devoir</Form.Label>
              <Form.Control
                type="text"
                name="titre"
                value={formik.values.titre}
                onChange={formik.handleChange}
                isInvalid={!!formik.errors.titre}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.titre}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Description du Devoir</Form.Label>
              <RichTextEditor
                initialValue={description}
                getValue={handleDescriptionChange}
                isUpdate={isEdit}
              />
              {formik.errors.description && (
                <div className="text-danger">{formik.errors.description}</div>
              )}
            </Form.Group>
            
            <div class="d-flex justify-content-center">
            <GradientButton type="submit" className="mt-3">
              {isEdit ? "Mettre à Jour le Devoir" : "Ajouter le Devoir"}
            </GradientButton>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
