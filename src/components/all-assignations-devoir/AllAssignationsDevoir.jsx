import React, { useState } from "react";
import { Accordion, Card, Button, Modal, Form } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  fetchFilteredAnswerHistories,
  sendAssignationNote,
} from "../../api/apiReponseStudent";
import styled from "styled-components";
import Retour from "../retour-arriere/Retour";

// Styled Components
const StyledCard = styled(Card)`
  margin-bottom: 10px;
  border-radius: 10px;
  overflow: hidden;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const StyledAccordionHeader = styled(Accordion.Header)`
  background-color: #FFB352;
  color: #ffffff;
  padding: 10px;
  font-weight: bold;
  cursor: pointer;
`;

const StyledAccordionBody = styled(Accordion.Body)`
  padding: 15px;
  background-color: #f8f9fa;
`;

const AssignNoteButton = styled(Button)`
  margin-top: 10px;
  background-color: #28a745;
  color: #ffffff;
  border-radius: 4px;
  padding: 8px 15px;
  font-size: 14px;

  &:hover {
    background-color: #218838;
  }
`;

const AttachmentImage = styled.img`
  max-width: 100px;
  margin-right: 10px;
  cursor: zoom-in;
  border-radius: 5px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const ModalTitle = styled(Modal.Title)`
  font-weight: bold;
`;

const CustomModalFooter = styled(Modal.Footer)`
  display: flex;
  justify-content: space-between;
`;



/*****************************/ 

const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  color: #10266F;
  text-align: center;
  margin-bottom: 20px;
`;

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
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);
  const [selectedAssignation, setSelectedAssignation] = useState(null);

  const { data: assignations, isLoading } = useQuery(
    ["assignations", { group, etudiant, devoir }],
    () => fetchFilteredAnswerHistories({ group, etudiant, devoir })
  );

  const mutation = useMutation(
    (noteData) => sendAssignationNote(noteData.assignationId, noteData.note),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["assignations", { group, etudiant, devoir }]);
        handleCloseModal();
      },
    }
  );

  const handleShowModal = (assignation) => {
    setSelectedAssignation(assignation);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAssignation(null);
  };

  const handleAssignNote = (values) => {
    mutation.mutate({ assignationId: selectedAssignation?.assignationId, note: values.note });
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="p-3">
      <Retour />
          <Title>Corriger les Devoirs</Title>

      <Accordion defaultActiveKey="0">
        {assignations.map((assignation, index) => (
          <StyledCard key={assignation.assignationId}>
            <Accordion.Item eventKey={index.toString()}>
              <StyledAccordionHeader>
                <span>{assignation.devoir}</span>
              </StyledAccordionHeader>
              <StyledAccordionBody>
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

                {assignation.reponse_etudiants &&
                  assignation.reponse_etudiants.length > 0 && (
                    <div>
                      <strong>Réponses:</strong>
                      {assignation.reponse_etudiants.map(
                        (history, historyIndex) => (
                          <div key={historyIndex}>
                            <div className="d-flex">
                              {history.attachements &&
                                history.attachements.length > 0 &&
                                history.attachements.map(
                                  (attachment, attachmentIndex) => (
                                    <Zoom key={attachmentIndex}>
                                      <AttachmentImage
                                        src={`http://localhost:1337${attachment.url}`}
                                        alt={attachment.name}
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

                <AssignNoteButton
                  size="sm"
                  onClick={() => handleShowModal(assignation)}
                  disabled={assignation.note !== null} // Désactiver le bouton si une note est déjà attribuée
                >
                  {assignation.note !== null
                    ? "Note déjà attribuée"
                    : "Attribuer une Note"}
                </AssignNoteButton>
              </StyledAccordionBody>
            </Accordion.Item>
          </StyledCard>
        ))}
      </Accordion>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <ModalTitle>Attribuer une Note</ModalTitle>
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
                <CustomModalFooter>
                  <Button variant="secondary" onClick={handleCloseModal}>
                    Annuler
                  </Button>
                  <Button variant="primary" type="submit">
                    Attribuer la Note
                  </Button>
                </CustomModalFooter>
              </FormikForm>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AllAssignationsDevoir;
