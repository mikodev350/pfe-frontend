import React, { useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';
import { FiMessageSquare, FiFileText, FiBarChart2, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchStudents, fetchGroups, createGroup, updateGroup, deleteGroup } from '../../api/apiStudent';
import { Col, Row } from 'react-bootstrap';
import SearchForm from '../searchForm/SearchForm';
import { getToken } from '../../util/authUtils';
import DevoirModal from '../DevoirModalSend/DevoirModal';
import QuizModal from '../quiz-modal/QuizModal';

const styles = {
  tabsContainer: {
    marginBottom: '20px',
  },
  addButton: {
    marginLeft: 'auto',
    backgroundColor: '#007bff',
    color: '#ffffff',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '0.375rem',
    fontWeight: 'bold',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
  },
  cardHeader: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    color: 'black',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    padding: '20px 24px',
    borderBottom: '1px solid #007bff',
  },
  card: {
    backgroundColor: '#f1f1f1',
    borderRadius: '12px',
    padding: '25px',
    border: 'none',
    marginBottom: '30px',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 24px',
    borderBottom: '1px solid #e0e0e0',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    marginBottom: '15px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  iconContainer: {
    marginRight: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50px',
    height: '50px',
    backgroundColor: '#f0f0f0',
    borderRadius: '50%',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#007bff',
  },
  name: {
    flexGrow: 1,
    fontWeight: '600',
    color: '#333',
    fontSize: '1rem',
  },
  detail: {
    color: '#6c757d',
    marginRight: '20px',
    fontSize: '0.95rem',
  },
  date: {
    color: '#999',
    fontSize: '0.9rem',
    marginRight: '20px',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  button: {
    color: '#6c757d',
    border: 'none',
    background: 'none',
    padding: '0',
    margin: '0 8px',
    fontSize: '1.2rem',
    transition: 'color 0.2s ease',
  },
};

const SuiviPedagogique = () => {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [groupSearchValue, setGroupSearchValue] = useState(""); 
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [assignmentType, setAssignmentType] = useState(''); // 'Devoir' ou 'Quiz'
  const [selectedStudentOrGroup, setSelectedStudentOrGroup] = useState(null);

  const queryClient = useQueryClient();
  const token = React.useMemo(() => getToken(), []);

  const { data: students, error: studentError, isLoading: isLoadingStudents } = useQuery(
    ['students', searchValue],
    () => fetchStudents(searchValue, token)
  );

  const { data: groups, error: groupError, isLoading: isLoadingGroups } = useQuery(
    ['groups', groupSearchValue],
    () => fetchGroups(token, groupSearchValue)
  );

  const createGroupMutation = useMutation(
    (newGroup) => createGroup(newGroup, token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('groups');
      },
    }
  );

  const updateGroupMutation = useMutation(
    (updatedGroup) => updateGroup(updatedGroup.id, updatedGroup, token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('groups');
      },
    }
  );

  const deleteGroupMutation = useMutation(
    (groupId) => deleteGroup(groupId, token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('groups');
      },
    }
  );

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setGroupName('');
    setSelectedMembers([]);
  };

  const handleGroupNameChange = (e) => setGroupName(e.target.value);
  const handleMembersChange = (selectedOptions) => setSelectedMembers(selectedOptions);
  const handleSearch = (value) => setSearchValue(value);
  const handleGroupSearch = (value) => setGroupSearchValue(value);
  
  const handleOpenAssignmentModal = (type, entity) => {
    setAssignmentType(type); // 'Devoir' ou 'Quiz'
    setSelectedStudentOrGroup(entity);
    setShowAssignmentModal(true);
  };

  const handleCloseAssignmentModal = () => {
    setShowAssignmentModal(false);
    setAssignmentType('');
    setSelectedStudentOrGroup(null);
  };

  const handleSubmit = () => {
    const groupData = {
      nom: groupName,
      members: selectedMembers.map((member) => member.value),
    };

    if (isEditing) {
      updateGroupMutation.mutate({ id: selectedGroup.id, ...groupData });
    } else {
      createGroupMutation.mutate(groupData);
    }

    handleCloseModal();
  };

  const handleEditGroup = (group) => {
    setIsEditing(true);
    setSelectedGroup(group);
    setGroupName(group.nom);
    setSelectedMembers(group.membres.map((member) => ({
      value: member.id,
      label: member.username,
    })));
    setShowModal(true);
  };

  const handleDeleteGroup = (groupId) => {
    deleteGroupMutation.mutate(groupId);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={styles.tabsContainer}>
        <Tabs defaultActiveKey="individuels" id="etudiants-tabs" className="mb-3">
          <Tab eventKey="individuels" title="Étudiants Individuels">
            <Card style={styles.card}>
              <Row style={{ marginBottom: '20px' }}>
                <div className="d-flex flex-row-reverse">
                  <Col xs={12} md={12} lg={4}>
                    <SearchForm searchValue={searchValue} onSearch={handleSearch} />
                  </Col>
                </div>
              </Row>
              <h3>Étudiants Individuels</h3>

              {isLoadingStudents ? (
                <p>Chargement...</p>
              ) : studentError ? (
                <p>Erreur lors du chargement des étudiants: {studentError.message}</p>
              ) : (
                <ListGroup variant="flush">
                  {students?.map((student) => (
                    <ListGroup.Item
                      key={student.id}
                      style={styles.listItem}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.03)';
                        e.currentTarget.style.boxShadow = '0px 8px 16px rgba(0, 0, 0, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1.0)';
                        e.currentTarget.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.05)';
                      }}
                    >
                      <div style={styles.iconContainer}>
                        <span>{student.username.charAt(0)}</span>
                      </div>
                      <div style={styles.name}>{student.username}</div>
                      <div style={styles.detail}>{student.email}</div>
                      <div style={styles.actions}>
                        <Link to="/" style={styles.button} title="Message">
                          <FiMessageSquare size={20} />
                        </Link>
                        <Button
                          variant="link"
                          style={{ ...styles.button, color: '#17a2b8' }}
                          onClick={() => handleOpenAssignmentModal('Devoir', student)}
                          title="Assigner un Devoir"
                        >
                          <FiFileText size={20} />
                        </Button>
                        <Button
                          variant="link"
                          style={{ ...styles.button, color: '#ff6347' }} 
                          onClick={() => handleOpenAssignmentModal('Quiz', student)} 
                          title="Assigner un Quiz"
                        >
                          <FiBarChart2 size={20} />
                        </Button>
                        <Link to={`/student/progression/individuel/${student.id}`} style={styles.button} title="Progress">
                          <FiBarChart2 size={20} />
                        </Link>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card>
          </Tab>
          <Tab eventKey="groupes" title="Groupes d'Étudiants">
            <Card style={styles.card}>
              <Row style={{ marginBottom: '20px' }}>
                <div className="d-flex flex-row-reverse">
                  <Col xs={12} md={12} lg={4}>
                    <SearchForm searchValue={groupSearchValue} onSearch={handleGroupSearch} />
                  </Col>
                </div>
              </Row>
              <h3>Groupes d'Étudiants</h3>
              <Button style={styles.addButton} onClick={handleShowModal}>
                <FiPlus size={20} style={{ marginRight: '8px' }} />
                Créer un Groupe
              </Button>
              {isLoadingGroups ? (
                <p>Chargement...</p>
              ) : groupError ? (
                <p>Erreur lors du chargement des groupes: {groupError.message}</p>
              ) : (
                <ListGroup variant="flush">
                  {groups?.map((group) => (
                    <ListGroup.Item
                      key={group.id}
                      style={styles.listItem}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.03)';
                        e.currentTarget.style.boxShadow = '0px 8px 16px rgba(0, 0, 0, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1.0)';
                        e.currentTarget.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.05)';
                      }}
                    >
                      <div style={styles.iconContainer}>
                        <span>{group.nom.charAt(0)}</span>
                      </div>
                      <div style={styles.name}>
                        {group.nom}
                        <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>
                          {group.membres && group.membres.length > 0 ? (
                            <span>
                              Membres: {group.membres.map((member) => member.username).join(', ')}
                            </span>
                          ) : (
                            <p>Aucun membre</p>
                          )}
                        </div>
                      </div>
                      <div style={styles.detail}>
                        <span>Professeur: {group.professeur.username}</span>
                      </div>
                      <div style={styles.actions}>
                        <Link to={`/student/progression/group/${group.id}`} style={styles.button} title="Progress">
                          <FiBarChart2 size={20} />
                        </Link>
                        <Button
                          variant="link"
                          style={{ ...styles.button, color: '#17a2b8' }}
                          onClick={() => handleOpenAssignmentModal('Devoir', group)}
                          title="Assigner un Devoir"
                        >
                          <FiFileText size={20} />
                        </Button>
                        <Button
                          variant="link"
                          style={{ ...styles.button, color: '#ff6347' }} 
                          onClick={() => handleOpenAssignmentModal('Quiz', group)} 
                          title="Assigner un Quiz"
                        >
                          <FiBarChart2 size={20} />
                        </Button>
                        <Button
                          variant="link"
                          style={{ ...styles.button, color: '#007bff' }}
                          onClick={() => handleEditGroup(group)}
                          title="Modifier le Groupe"
                        >
                          <FiEdit2 size={20} />
                        </Button>
                        <Button
                          variant="link"
                          style={{ ...styles.button, color: '#dc3545' }}
                          onClick={() => handleDeleteGroup(group.id)}
                          title="Supprimer le Groupe"
                        >
                          <FiTrash2 size={20} />
                        </Button>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card>
          </Tab>
        </Tabs>
      </div>

      {/* Modal pour créer ou modifier un groupe */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Modifier le Groupe' : 'Créer un Nouveau Groupe'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="groupName">
              <Form.Label>Nom du Groupe</Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrez le nom du groupe"
                value={groupName}
                onChange={handleGroupNameChange}
              />
            </Form.Group>
            <Form.Group controlId="groupMembers" className="mt-3">
              <Form.Label>Sélectionner les Membres</Form.Label>
              <Select
                isMulti
                options={students?.map((student) => ({
                  value: student.id,
                  label: student.username,
                }))}
                value={selectedMembers}
                onChange={handleMembersChange}
                placeholder="Sélectionnez les membres"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {isEditing ? 'Modifier' : 'Créer'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal pour assigner un devoir */}
      {(showAssignmentModal && assignmentType === 'Devoir') &&
       <DevoirModal 
        show={showAssignmentModal && assignmentType === 'Devoir'} 
        handleClose={handleCloseAssignmentModal} 
        selectedStudentOrGroup={selectedStudentOrGroup}
        assignmentType={assignmentType} 
        groupId={selectedStudentOrGroup?.id} 
      /> }
     
       {(showAssignmentModal && assignmentType === 'Quiz') &&
        <QuizModal 
        show={showAssignmentModal && assignmentType === 'Quiz'} 
        handleClose={handleCloseAssignmentModal} 
        selectedStudentOrGroup={selectedStudentOrGroup}
        groupId={selectedStudentOrGroup?.id} 
      /> }

      {/* Modal pour assigner un quiz */}
     
    </div>
  );
};

export default SuiviPedagogique;
