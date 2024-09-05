import React from 'react';
import { Modal, Button, Form, ListGroup } from 'react-bootstrap';
import Select from 'react-select';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { FiTrash2 } from 'react-icons/fi'; // Import de l'icône d'édition
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import {
  fetchForModelDevoirs,
  createAssignation,
  deleteAssignation,
  fetchAssignations,
} from '../../api/apiDevoir';
import { getToken } from '../../util/authUtils';
import { FaCheckCircle } from 'react-icons/fa';

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
  editButton: {
    background: 'none',
    border: 'none',
    color: '#007bff',
    cursor: 'pointer',
    marginRight: '10px',
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

const DevoirModal = ({ show, handleClose, selectedStudentOrGroup, assignmentType, groupId }) => {
  const [selectedAssignments, setSelectedAssignments] = React.useState([]);
  const [showSelect, setShowSelect] = React.useState(false);
  const queryClient = useQueryClient();
  const token = React.useMemo(() => getToken(), []);

  const {
    data: assignmentOptions,
    isLoading: isLoadingAssignments,
    error: errorAssignments,
  } = useQuery([assignmentType, token], () => fetchForModelDevoirs(token, assignmentType), {
    select: (response) => response.data.map((assignment) => ({ value: assignment.id, label: assignment.titre })),
  });

  const fetchAssignationsWithLogicForDevoir = async (groupId, assignmentType, token) => {
    if (!selectedStudentOrGroup) return [];
    const TypeElement = selectedStudentOrGroup.membres ? "GROUP" : "INDIVIDUEL";
  
    const response = await fetchAssignations(groupId, TypeElement, assignmentType, token);
    return response;
  };

  const {
    data: assignations,
    isLoading: isLoadingAssignations,
    error: errorAssignations,
  } = useQuery(
    ['assignations', groupId, assignmentType],
    () => fetchAssignationsWithLogicForDevoir(groupId, "DEVOIR", token)
  );
    console.log("assignations");

  console.log(assignations);
  

  const mutation = useMutation(
    ({ entityData, token }) => createAssignation(entityData, token, "DEVOIR"), {
      onSuccess: () => {
        queryClient.invalidateQueries([assignmentType]);
              toast.success("Le devoir a été assigné avec succès.");

        handleClose();
      },
      onError: (error) => {
              toast.error("Erreur lors de l'assignation du devoir.");

        console.error('Erreur lors de la création de l\'assignation:', error);
      },
  });

  const deleteMutation = useMutation(
    (assignationId,devoirId) => deleteAssignation(assignationId,devoirId,groupId, selectedStudentOrGroup.membres ? "GROUP" : "INDIVIDUEL", assignmentType), {
      onSuccess: () => {
        queryClient.invalidateQueries(['assignations', groupId, assignmentType]);
                toast.success("L'assignation a été supprimée avec succès.");

      },
      onError: (error) => {
                toast.error("Erreur lors de la suppression de l'assignation.");

        console.error('Erreur lors de la suppression de l\'assignation:', error);
      },
  });

  const handleAssignmentChange = (selectedOptions) => {
    setSelectedAssignments(selectedOptions);
  };

  // const handleDelete = (assignationId) => {
  //   deleteMutation.mutate(assignationId);
  // };

  const handleDelete = (assignationId,devoirId) => {
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
      deleteMutation.mutate(assignationId,devoirId);
      Swal.fire(
        'Supprimé!',
        'L\'assignation a été supprimée.',
        'success'
      );
    }
  });
};
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
        assignments: selectedAssignments.map(assignment => assignment.value),
        TypeOfasssignation: assignmentType.toUpperCase(),
      },
      token,
    });
  };

  const handleBack = () => {
    setShowSelect(false);
  };

  if (isLoadingAssignments || isLoadingAssignations) return <p>Chargement...</p>;
  if (errorAssignments) return <p>Erreur lors du chargement des {assignmentType}s: {errorAssignments.message}</p>;
  if (errorAssignations) return <p>Erreur lors du chargement des assignations: {errorAssignations.message}</p>;

  return (
    <>
    <ToastContainer />
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title style={styles.modalTitle}>Assigner un {assignmentType}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!showSelect ? (
          <>
            <ListGroup>
              {assignations && assignations.length > 0 ? (
                assignations.map((assignment, index) => (
                  <ListGroup.Item key={index} style={styles.listItem}>
                    <div>
                      <strong>{assignment.titre}</strong>
                      <div>{assignment.date}</div>
                    </div>
                    <div>
                      
                      {/* Bouton pour aller à la page de correction */}
                      <Link
      to={`/dashboard/devoir/correction?${selectedStudentOrGroup.membres ? `group=${groupId}` : `etudiant=${selectedStudentOrGroup.id}`}&devoir=${assignment.devoirId}`}
      style={styles.editButton}
      title="Corriger"
    >
      <FaCheckCircle size={20} />
    </Link>
                      {/* Bouton de suppression */}
                      <Button
                        variant="link"
                        style={styles.deleteButton}
                        onClick={() => handleDelete(assignment.id,assignment.devoirId)}
                        title="Supprimer"
                      >
                        <FiTrash2 size={20} />
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))
              ) : (
                <p>Aucun {assignmentType} assigné pour le moment.</p>
              )}
            </ListGroup>
            <Button variant="primary" onClick={() => setShowSelect(true)} style={styles.addButton}>
              Ajouter un {assignmentType}
            </Button>
          </>
        ) : (
          <>
            <Form.Group controlId="assignmentSelect">
              <Form.Label>Sélectionner les {assignmentType}s à assigner</Form.Label>
              <Select
                isMulti
                options={assignmentOptions}
                value={selectedAssignments}
                onChange={handleAssignmentChange}
                placeholder={`Sélectionnez les ${assignmentType}s`}
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
               <br />
            </Form.Group>
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
                borderColor: "#007bff",}}  onClick={onSubmit}>
          Assigner
        </Button>
      </Modal.Footer>
    </Modal>
    </>
  );
};

export default DevoirModal;
