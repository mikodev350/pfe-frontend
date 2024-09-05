import React, { useState } from 'react';
import { Modal, Button, Form, ListGroup } from 'react-bootstrap';
import Select from 'react-select';
import { useQuery } from 'react-query';
import { useMutation, useQueryClient } from 'react-query';
import { getToken } from '../../util/authUtils';
import { getQuizzes } from '../../api/apiQuiz';
import { FiTrash2 } from 'react-icons/fi';
import {  createAssignation, deleteAssignation, fetchAssignations } from '../../api/apiDevoir';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const styles = {
  modalTitle: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    marginBottom: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  deleteButton: {
    background: 'none',
    border: 'none',
    color: '#dc3545',
    cursor: 'pointer',
  },
  addButton: {
    marginTop: '15px',
    backgroundColor: '#007bff',
    color: '#ffffff',
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
    color: '#ffffff',
  },
};

const QuizModal = ({ show, handleClose, selectedStudentOrGroup, groupId }) => {
  const [selectedQuizzes, setSelectedQuizzes] = useState([]);
  const [showSelect, setShowSelect] = useState(false);
  const queryClient = useQueryClient();
  const token = React.useMemo(() => getToken(), []);

  // Récupérer les quiz disponibles
  const {
    data: quizOptions,
    isLoading: isLoadingQuizzes,
    error: errorQuizzes,
  } = useQuery(['quiz', token], () => getQuizzes({token}), {
    select: (response) => response.map(quiz => ({ value: quiz.id, label: quiz.titre })),
  });

  // const fetchAssignationsWithLogic = async (groupId, token) => {
  //   const TypeElement = selectedStudentOrGroup.membres ? "GROUP" : "INDIVIDUEL";
  //   const response = await fetchAssignations(groupId, TypeElement,'QUIZ' ,token);
  //   return response;
  // };

  /**************************************************************************************************************/ 

  
/************************************************************************************************************************/
const fetchAssignationsWithLogic = async (groupId, token) => {
  if (!selectedStudentOrGroup) return [];

  console.log("sdfsdfsefsef")
  const TypeElement = selectedStudentOrGroup.membres ? "GROUP" : "INDIVIDUEL";
  const response = await fetchAssignations(groupId, TypeElement, 'QUIZ', token);
  return response;
};

/***************************************************************************************/  






  const {
    data: assignations,
    isLoading: isLoadingAssignations,
    error: errorAssignations,
  } = useQuery(
    ['assignationsQuiz', groupId],
    () => fetchAssignationsWithLogic(groupId, token)
  );

  const mutation = useMutation(
    ({ entityData, token }) => createAssignation(entityData, token,"QUIZ"), {
      onSuccess: () => {
        queryClient.invalidateQueries(['quiz']);
        toast.success("Le quiz a été assigné avec succès.");
        handleClose();

      },
      onError: (error) => {
                toast.error('Erreur lors de l\'assignation du quiz.');

        console.error('Erreur lors de la création de l\'assignation:', error);
      },
  });

const deleteMutation = useMutation(
  ({ assignationId, quizId }) => deleteAssignation(assignationId, quizId, groupId, selectedStudentOrGroup.membres ? "GROUP" : "INDIVIDUEL", "QUIZ"), {
    onSuccess: () => {
      // Invalide la bonne clé de requête
      queryClient.invalidateQueries(['assignationsQuiz', groupId]);
              toast.success('Le quiz a été supprimé avec succès.');

    },
    onError: (error) => {
              toast.error('Erreur lors de la suppression du quiz.');

      console.error('Erreur lors de la suppression de l\'assignation:', error);
    },
  }
);


  const handleQuizChange = (selectedOptions) => {
    setSelectedQuizzes(selectedOptions);
  };

  /******************************************************************************************************/ 
  // const handleDelete = (assignationId) => {
  //   deleteMutation.mutate(assignationId);
  // };

  // Fonction de suppression avec SweetAlert
const handleDelete = (assignationId, quizId) => {
  Swal.fire({
    title: 'Êtes-vous sûr ?',
    text: "Vous ne pourrez pas annuler cette action !",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
      // Utilisation d'un objet pour passer assignationId et quizId
      deleteMutation.mutate({ assignationId, quizId });
      Swal.fire(
        'Supprimé!',
        'Le quiz a été supprimé avec succès.',
        'success'
      );
    }
  });
};

  /**********************************************************************************************************************/ 

  const onSubmit = () => {
    const entity = selectedStudentOrGroup;
    const entityData = entity.membres
      ? { 
          entityId: entity.id, 
          userIds: entity.membres.map(membre => membre.id), 
          type: "GROUP" 
        }
      : { 
          entityId: entity.id, 
          userIds: [entity.id], 
          type: "INDIVIDUEL" 
        };

    mutation.mutate({
      entityData: {
        ...entityData,
      assignments: selectedQuizzes.map((quiz) => quiz.value)
      },
      token,
    });
  };

  const handleBack = () => {
    setShowSelect(false);
  };

  if (isLoadingQuizzes || isLoadingAssignations) return <p>Chargement...</p>;
  if (errorQuizzes) return <p>Erreur lors du chargement des quiz: {errorQuizzes.message}</p>;
  if (errorAssignations) return <p>Erreur lors du chargement des assignations: {errorAssignations.message}</p>;

  return (<>
  <ToastContainer />
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title style={styles.modalTitle}>Assigner un Quiz</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!showSelect ? (
          <>
            <ListGroup>
              {assignations && assignations.length > 0 ? (
                assignations.map((quiz, index) => (
                  <ListGroup.Item key={index} style={styles.listItem}>
                    <div>
                      <strong>{quiz.titre}</strong>
                      <div>{quiz.date}</div>
                    </div>
                    <Button
                      variant="link"
                      style={styles.deleteButton}
                      onClick={() => handleDelete(quiz.id,quiz.quizzId)}
                      title="Supprimer"
                    >
                      <FiTrash2 size={20} />
                    </Button>
                  </ListGroup.Item>
                ))
              ) : (
                <p>Aucun quiz assigné pour le moment.</p>
              )}
            </ListGroup>
            <Button variant="primary" onClick={() => setShowSelect(true)} style={styles.addButton}>
              Ajouter un Quiz
            </Button>
          </>
        ) : (
          <>
            <Form.Group controlId="quizSelect">
              <Form.Label>Sélectionner les Quiz à assigner</Form.Label>
              <Select
                isMulti
                options={quizOptions}
                value={selectedQuizzes}
                onChange={handleQuizChange}
                placeholder="Sélectionnez les quiz"
                            styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  borderColor: state.isFocused ? '#0066cc' : '#ced4da',
                  borderRadius: '20px',
                  height: '45px', // Reduced height
                  boxShadow: 'none',
                  '&:hover': {
                    borderColor: '#0056b3',
                  },
                }),
                placeholder: (baseStyles) => ({
                  ...baseStyles,
                  color: '#6c757d',
                  fontSize: '14px', // Slightly smaller font size
                }),
                multiValue: (baseStyles) => ({
                  ...baseStyles,
                  backgroundColor: '#e9ecef',
                  borderRadius: '10px',
                }),
                menu: (baseStyles) => ({
                  ...baseStyles,
                  borderRadius: '20px',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                }),
                option: (baseStyles, state) => ({
                  ...baseStyles,
                  backgroundColor: state.isFocused ? '#f8f9fa' : 'white',
                  color: '#495057',
                  '&:active': {
                    backgroundColor: '#0066cc',
                    color: 'white',
                  },
                }),
              }}
              />
            </Form.Group>
                        <br />

            <Button variant="secondary" onClick={handleBack} style={styles.secondaryButton}>
              Retour
            </Button>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>

        <Button variant="primary"        
          style={{   
            width: "100%",
                height: "52px",
                backgroundColor: "#007bff",
                borderColor: "#007bff",}} 
                onClick={onSubmit}>
          Assigner
        </Button>
      </Modal.Footer>
    </Modal>
    </>
  );
};

export default QuizModal;
