import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchAcceptedInvitationFriend,  } from '../../api/apiInvitation';
import {
  cancelFriendRequest,
} from "../../api/apiFriendRequest";
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FiMessageSquare, FiUserMinus } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { getToken } from '../../util/authUtils';

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
  const queryClient = useQueryClient();
  const token = getToken();

  const { data: friends, isLoading, isError } = useQuery(
    ['acceptedRelations', 'AMIS'],
    () => fetchAcceptedInvitationFriend('AMIS')
  );

  const cancelFriendRequestMutation = useMutation(
    (id) => cancelFriendRequest(id, token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['acceptedRelations', 'AMIS']);
      },
      onError: (error) => {
        Swal.fire('Erreur', `Erreur lors de la suppression: ${error.message}`, 'error');
      },
    }
  );

  const handleRemoveFriend = (friendId) => {
    Swal.fire({
      title: 'Êtes-vous sûr de vouloir retirer cet ami?',
      showCancelButton: true,
      confirmButtonText: 'Oui, retirer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        cancelFriendRequestMutation.mutate(friendId);
      }
    });
  };

  if (isLoading) return <div>Chargement...</div>;
  if (isError) return <div>Erreur lors du chargement des données.</div>;

  return (
    <div style={{ padding: '20px' }}>
      <Card style={styles.card}>
        <h3>Liste d'Amis</h3>
        <ListGroup variant="flush">
          {friends.map((friend, index) => (
            <ListGroup.Item
              key={index}
              style={styles.listItem}
            >
              <div style={styles.iconContainer}>
                <span>{friend.destinataire.username.charAt(0)}</span>
              </div>
              <div style={styles.name}>{friend.destinataire.username}</div>
              <div style={styles.actions}>
                <Button
                  variant="link"
                  style={styles.button}
                  onClick={() => alert(`Message à ${friend.destinataire.username}`)}
                  title="Envoyer un message"
                >
                  <FiMessageSquare size={20} />
                </Button>
                <Button
                  variant="link"
                  style={{ ...styles.button, color: '#dc3545' }}
                  onClick={() => handleRemoveFriend(friend.destinataire.id)}
                  title="Retirer de la liste d'amis"
                  disabled={cancelFriendRequestMutation.isLoading}
                >
                  <FiUserMinus size={20} />
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
    </div>
  );
};

export default AmisList;
