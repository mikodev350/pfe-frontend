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

const AmisList = () => {
  const [friends, setFriends] = useState([
    { name: 'Alice', status: 'En ligne', isFriend: true },
    { name: 'Bob', status: 'Hors ligne', isFriend: false },
    { name: 'Charlie', status: 'En ligne', isFriend: true },
    { name: 'David', status: 'Hors ligne', isFriend: true },
    { name: 'Eva', status: 'En ligne', isFriend: false },
  ]);

  const handleAddFriend = (index) => {
    const updatedFriends = [...friends];
    updatedFriends[index].isFriend = true;
    setFriends(updatedFriends);
  };

  const handleRemoveFriend = (index) => {
    const updatedFriends = [...friends];
    updatedFriends[index].isFriend = false;
    setFriends(updatedFriends);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Card style={styles.card}>
        <h3>Liste d'Amis</h3>
        <ListGroup variant="flush">
          {friends.map((friend, index) => (
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
                <span>{friend.name.charAt(0)}</span>
              </div>
              <div style={styles.name}>{friend.name}</div>
              <div style={styles.status}>{friend.status}</div>
              <div style={styles.actions}>
                <Button
                  variant="link"
                  style={styles.button}
                  onClick={() => alert(`Message à ${friend.name}`)}
                  title="Envoyer un message"
                >
                  <FiMessageSquare size={20} />
                </Button>
                {friend.isFriend ? (
                  <Button
                    variant="link"
                    style={{ ...styles.button, color: '#dc3545' }}
                    onClick={() => handleRemoveFriend(index)}
                    title="Retirer de la liste d'amis"
                  >
                    <FiUserMinus size={20} />
                  </Button>
                ) : (
                  <Button
                    variant="link"
                    style={{ ...styles.button, color: '#28a745' }}
                    onClick={() => handleAddFriend(index)}
                    title="Ajouter à la liste d'amis"
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

export default AmisList;
