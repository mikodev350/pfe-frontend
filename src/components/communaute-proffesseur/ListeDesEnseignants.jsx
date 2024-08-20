import React, { useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FiMessageSquare, FiUserPlus, FiUserMinus } from 'react-icons/fi';

const styles = {
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
  status: {
    color: '#6c757d',
    marginRight: '20px',
    fontSize: '0.95rem',
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

const ListeDesEnseignants = () => {
  const [professors, setProfessors] = useState([
    { name: 'Prof. Alice', status: 'En ligne', isContact: true },
    { name: 'Prof. Bob', status: 'Hors ligne', isContact: false },
    { name: 'Prof. Charlie', status: 'En ligne', isContact: true },
    { name: 'Prof. David', status: 'Hors ligne', isContact: true },
    { name: 'Prof. Eva', status: 'En ligne', isContact: false },
  ]);

  const handleAddContact = (index) => {
    const updatedProfessors = [...professors];
    updatedProfessors[index].isContact = true;
    setProfessors(updatedProfessors);
  };

  const handleRemoveContact = (index) => {
    const updatedProfessors = [...professors];
    updatedProfessors[index].isContact = false;
    setProfessors(updatedProfessors);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Card style={styles.card}>
        <h3>Liste des Professeurs</h3>
        <ListGroup variant="flush">
          {professors.map((prof, index) => (
            <ListGroup.Item
              key={index}
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
                <span>{prof.name.charAt(6)}</span>
              </div>
              <div style={styles.name}>{prof.name}</div>
              <div style={styles.status}>{prof.status}</div>
              <div style={styles.actions}>
                <Button
                  variant="link"
                  style={styles.button}
                  onClick={() => alert(`Message à ${prof.name}`)}
                  title="Envoyer un message"
                >
                  <FiMessageSquare size={20} />
                </Button>
                {prof.isContact ? (
                  <Button
                    variant="link"
                    style={{ ...styles.button, color: '#dc3545' }}
                    onClick={() => handleRemoveContact(index)}
                    title="Retirer de la liste de contacts"
                  >
                    <FiUserMinus size={20} />
                  </Button>
                ) : (
                  <Button
                    variant="link"
                    style={{ ...styles.button, color: '#28a745' }}
                    onClick={() => handleAddContact(index)}
                    title="Ajouter à la liste de contacts"
                  >
                    <FiUserPlus size={20} />
                  </Button>
                )}
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
    </div>
  );
};

export default ListeDesEnseignants;
