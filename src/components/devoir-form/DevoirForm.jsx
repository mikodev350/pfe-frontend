import React, { useEffect, useState } from "react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import RichTextEditor from "../richTextEditor/RichTextEditor";
import { createDevoir, updateDevoir } from "../../api/apiDevoir";
import { getToken } from "../../util/authUtils";
import { useQueryClient } from 'react-query';
import { useParams } from "react-router-dom";

const validationSchema = Yup.object({
  titre: Yup.string().required("Le titre du devoir est requis"),
  description: Yup.string().required("La description du devoir est requise"),
});

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
        queryClient.invalidateQueries('devoirs'); // Recharger la liste des devoirs après modification
        onClose();
      } catch (error) {
        console.error("Erreur lors de la soumission du formulaire:", error);
      }
    },
  });

  // Utilisation de formik.setValues pour mettre à jour les valeurs lorsque les données initiales changent
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

            <Button type="submit" className="mt-3 text-center">
              {isEdit ? "Mettre à Jour le Devoir" : "Ajouter le Devoir"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
