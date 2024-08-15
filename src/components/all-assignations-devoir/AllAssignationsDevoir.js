import React, { useState, useEffect } from "react";
import { Accordion, Card, Button, Modal, Form } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  fetchFilteredAnswerHistories,
  sendAssignationNote,
} from "./../../api/apiReponseStudent";

const accordionStyles = {
  card: {
    marginBottom: "10px",
  },
  header: {
    backgroundColor: "#007bff",
    color: "#ffffff",
    padding: "10px",
    fontWeight: "bold",
  },
  body: {
    padding: "15px",
    backgroundColor: "#f8f9fa",
  },
  assignNoteButton: {
    marginTop: "10px",
    backgroundColor: "#28a745",
    color: "#ffffff",
  },
  attachmentImage: {
    maxWidth: "100px",
    marginRight: "10px",
    cursor: "zoom-in",
  },
};

const validationSchema = Yup.object().shape({
  note: Yup.number()
    .min(0, "La note doit être au moins de 0")
    .max(20, "La note doit être au maximum de 20")
    .required("La note est obligatoire"),
});

const AllAssignationsDevoir = () => {
  const [searchParams] = useSearchParams();
  const group = searchParams.get("group");
  const etudiant = searchParams.get("etudiant");
  const devoir = searchParams.get("devoir");

  const [assignations, setAssignations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAssignation, setSelectedAssignation] = useState(null);

  useEffect(() => {
    const fetchAssignations = async () => {
      try {
        const params = {
          group: group,
          etudiant: etudiant,
          devoir: devoir,
        };
        const data = await fetchFilteredAnswerHistories(params);

        setAssignations(data);
      } catch (error) {
        console.error("Error fetching assignations:", error);
      }
    };

    fetchAssignations();
  }, [group, etudiant]);

  const handleShowModal = (assignation) => {
    setSelectedAssignation(assignation);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAssignation(null);
  };

  const handleAssignNote = async (values) => {
    const { note } = values;
    try {
      await sendAssignationNote(
        selectedAssignation?.devoir?.id,
        selectedAssignation?.etudiant?.id,
        note
      );
      alert(
        `Note ${note} assignée avec succès à ${selectedAssignation.etudiant}`
      );
    } catch (error) {
      console.error("Erreur lors de l'assignation de la note:", error);
      alert("Une erreur est survenue lors de l'assignation de la note.");
    }
    handleCloseModal();
  };

  return (
    <div className="p-3">
      <Accordion defaultActiveKey="0">
        {assignations.map((assignation, index) => (
          <Card key={assignation.id} style={accordionStyles.card}>
            <Accordion.Item eventKey={index.toString()}>
              <Accordion.Header style={accordionStyles.header}>
                <span>{assignation.devoir.titre}</span>
              </Accordion.Header>
              <Accordion.Body style={accordionStyles.body}>
                <Card.Text>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: assignation.devoir.description,
                    }}
                  />
                </Card.Text>

                <div>
                  <strong>Étudiant: </strong>
                  {assignation.etudiant}
                </div>

                <div>
                  <strong>Note: </strong>
                  {assignation.note !== null
                    ? `${assignation.note} / 20`
                    : "Pas encore noté"}
                </div>

                {assignation.answer_histories.length > 0 && (
                  <div>
                    <strong>Réponses:</strong>
                    {assignation.answer_histories.map(
                      (history, historyIndex) => (
                        <div key={historyIndex}>
                          <div className="d-flex">
                            {history.attachements.map(
                              (attachment, attachmentIndex) => (
                                <Zoom key={attachmentIndex}>
                                  <img
                                    src={`http://localhost:1337${attachment.url}`}
                                    alt={attachment.name}
                                    style={accordionStyles.attachmentImage}
                                  />
                                </Zoom>
                              )
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}

                <Button
                  variant="success"
                  style={accordionStyles.assignNoteButton}
                  size="sm"
                  onClick={() => handleShowModal(assignation)}
                  disabled={assignation.note !== null} // Désactiver le bouton si une note est déjà attribuée
                >
                  {assignation.note !== null
                    ? "Note déjà attribuée"
                    : "Attribuer une Note"}
                </Button>
              </Accordion.Body>
            </Accordion.Item>
          </Card>
        ))}
      </Accordion>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Attribuer une Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{ note: "" }}
            validationSchema={validationSchema}
            onSubmit={handleAssignNote}
          >
            {({ errors, touched }) => (
              <FormikForm>
                <Form.Group controlId="formNote">
                  <Form.Label>Note</Form.Label>
                  <Field
                    type="number"
                    name="note"
                    placeholder="Entrez la note"
                    className={`form-control ${
                      touched.note && errors.note ? "is-invalid" : ""
                    }`}
                  />
                  <ErrorMessage
                    component="div"
                    name="note"
                    className="invalid-feedback"
                  />
                </Form.Group>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseModal}>
                    Annuler
                  </Button>
                  <Button variant="primary" type="submit">
                    Attribuer la Note
                  </Button>
                </Modal.Footer>
              </FormikForm>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AllAssignationsDevoir;
