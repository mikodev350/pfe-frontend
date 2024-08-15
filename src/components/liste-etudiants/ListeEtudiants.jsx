import React, { useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';
import { FiMessageSquare, FiFileText, FiBarChart2, FiPlus, FiEdit2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { fetchStudents } from '../../api/apiStudent'; // Assurez-vous que le chemin est correct
import { Col, Row } from 'react-bootstrap';
import SearchForm from '../../components/searchForm/SearchForm'; // Assurez-vous que le chemin est correct

// Styles en ligne
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

const groupesEtudiants = [
  { id: 1, nom: 'Groupe 1', role: 'Projet JavaScript', date: '21.08.2023', membres: ['Alice Dupont', 'Bob Martin'] },
  { id: 2, nom: 'Groupe 2', role: 'Projet React', date: '20.08.2023', membres: ['Claire Dubois'] },
];

const ListeEtudiants = () => {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchValue, setSearchValue] = useState(""); // Ajout de l'état de recherche

  // Utilisation de React Query pour récupérer les étudiants avec la recherche
  const { data, error, isLoading } = useQuery(
    ['students', searchValue],
    () => fetchStudents(searchValue, localStorage.getItem('token'))
  );

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setGroupName('');
    setSelectedMembers([]);
  };

  const handleGroupNameChange = (e) => setGroupName(e.target.value);

  const handleMembersChange = (selectedOptions) => {
    setSelectedMembers(selectedOptions);
  };

  const handleSearch = (value) => {
    setSearchValue(value);
  };

  const handleSubmit = () => {
    if (isEditing) {
      console.log('Groupe modifié :', selectedGroup, 'Nouveau nom :', groupName, 'Nouveaux membres:', selectedMembers);
    } else {
      console.log('Nouveau groupe créé :', groupName, 'avec les membres:', selectedMembers);
    }
    handleCloseModal(); // Utilisation de handleCloseModal pour fermer et réinitialiser
  };

  const handleEditGroup = (groupe) => {
    setIsEditing(true);
    setSelectedGroup(groupe);
    setGroupName(groupe.nom);
    setSelectedMembers(groupe.membres.map((membre) => ({
      value: data?.find((etudiant) => etudiant.username === membre).id,
      label: membre,
    })));
    setShowModal(true);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={styles.tabsContainer}>
        
        <Tabs defaultActiveKey="individuels" id="etudiants-tabs" className="mb-3">
          <Tab eventKey="individuels" title="Étudiants Individuels">
            <Card style={styles.card}>

                <Row style={{ marginBottom: '20px' }}>
    <div  className="d-flex flex-row-reverse">
          <Col xs={12} md={12} lg={4}>
            <SearchForm searchValue={searchValue} onSearch={handleSearch} />
          </Col>
    </div>

        </Row>
              <h3>Étudiants Individuels</h3>
            
              {isLoading ? (
                <p>Chargement...</p>
              ) : error ? (
                <p>Erreur lors du chargement des étudiants: {error.message}</p>
              ) : (
                <ListGroup variant="flush">
                  {data?.map((etudiant) => (
                    <ListGroup.Item
                      key={etudiant.id}
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
                        <span>{etudiant.username.charAt(0)}</span>
                      </div>
                      <div style={styles.name}>{etudiant.username}</div>
                      <div style={styles.detail}>{etudiant.email}</div>
                      <div style={styles.actions}>
                        <Link to="/" style={styles.button} title="Message">
                          <FiMessageSquare size={20} />
                        </Link>
                        <Link to="/" style={styles.button} title="Quiz/Devoirs">
                          <FiFileText size={20} />
                        </Link>
                        <Link to={`/student/progression/student/${etudiant.id}`} style={styles.button} title="Progress">
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
              <Button style={styles.addButton} onClick={handleShowModal}>
                <FiPlus size={20} style={{ marginRight: '8px' }} />
                Créer un Groupe
              </Button>
              <h3>Groupes d'Étudiants</h3>
              <ListGroup variant="flush">
                {groupesEtudiants.map((groupe) => (
                  <ListGroup.Item
                    key={groupe.id}
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
                      <span>{groupe.nom.charAt(0)}</span>
                    </div>
                    <div style={styles.name}>
                      {groupe.nom}
                      <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>
                        Membres: {groupe.membres.join(', ')}
                      </div>
                    </div>
                    <div style={styles.detail}>{groupe.role}</div>
                    <div style={styles.actions}>
                      <Link to="/" style={styles.button} title="Message">
                        <FiMessageSquare size={20} />
                      </Link>
                      <Link to="/" style={styles.button} title="Quiz/Devoirs">
                        <FiFileText size={20} />
                      </Link>
                      <Link to={`/student/progression/group/${groupe.id}`} style={styles.button} title="Progress">
                        <FiBarChart2 size={20} />
                      </Link>
                      <Button
                        variant="link"
                        style={{ ...styles.button, color: '#007bff' }}
                        onClick={() => handleEditGroup(groupe)}
                        title="Modifier le Groupe"
                      >
                        <FiEdit2 size={20} />
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
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
                options={data?.map((etudiant) => ({
                  value: etudiant.id,
                  label: etudiant.username,
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
    </div>
  );
};

export default ListeEtudiants;
