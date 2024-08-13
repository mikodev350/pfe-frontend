import React, { useState } from 'react';
import { Modal, Button, Form, ListGroup } from 'react-bootstrap';
import Select from 'react-select';
import { useQuery } from 'react-query';
import { fetchForModelDevoirs, createAssignation, deleteAssignation, fetchAssignations } from '../../api/apiDevoir';
import { useMutation, useQueryClient } from 'react-query';
import { getToken } from '../../util/authUtils';
import { FiTrash2 } from 'react-icons/fi';

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

const DevoirModal = ({ show, handleClose, selectedStudentOrGroup, assignmentType, groupId }) => {
  const [selectedAssignments, setSelectedAssignments] = useState([]);
  const [showSelect, setShowSelect] = useState(false);
  const queryClient = useQueryClient();
  const token = React.useMemo(() => getToken(), []);

  // Récupérer les devoirs ou quiz disponibles selon le type d'assignation
  const {
    data: assignmentOptions,
    isLoading: isLoadingAssignments,
    error: errorAssignments,
  } = useQuery([assignmentType, token], () => fetchForModelDevoirs(token, assignmentType), {
    select: (response) => response.data.map(assignment => ({ value: assignment.id, label: assignment.titre })),
  });

  const fetchAssignationsWithLogic = async (groupId, assignmentType, token) => {
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
    () => fetchAssignationsWithLogic(groupId, assignmentType, token)
  );

  const mutation = useMutation(
    ({ entityData, token }) => createAssignation(entityData, token), {
      onSuccess: () => {
        queryClient.invalidateQueries([assignmentType]);
        handleClose();
      },
      onError: (error) => {
        console.error('Erreur lors de la création de l\'assignation:', error);
      },
  });

  const deleteMutation = useMutation(
    (assignationId) => deleteAssignation(assignationId, groupId, selectedStudentOrGroup.membres ? "GROUP" : "INDIVIDUEL", assignmentType, token), {
      onSuccess: () => {
        queryClient.invalidateQueries(['assignations', groupId, assignmentType]);
      },
      onError: (error) => {
        console.error('Erreur lors de la suppression de l\'assignation:', error);
      },
  });

  const handleAssignmentChange = (selectedOptions) => {
    setSelectedAssignments(selectedOptions);
  };

  const handleDelete = (assignationId) => {
    deleteMutation.mutate(assignationId);
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
                    <Button
                      variant="link"
                      style={styles.deleteButton}
                      onClick={() => handleDelete(assignment.id)}
                      title="Supprimer"
                    >
                      <FiTrash2 size={20} />
                    </Button>
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
              />
            </Form.Group>
            <Button variant="secondary" onClick={handleBack} style={styles.secondaryButton}>
              Retour
            </Button>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Annuler
        </Button>
        <Button variant="primary" onClick={onSubmit}>
          Assigner
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DevoirModal;
