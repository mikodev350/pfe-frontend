import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchAcceptedInvitationFriend } from '../../api/apiInvitation';
import { cancelFriendRequest } from "../../api/apiFriendRequest";
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FiMessageSquare, FiUserMinus } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { getToken } from '../../util/authUtils';
import { getIdOfConverstation } from "../../api/apiConversation";
import { useNavigate, Link } from 'react-router-dom';

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
  noTeachersCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.05)',
  },
};

const TeacherList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = getToken();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const { data: teachers, isLoading, isError } = useQuery(
    ['acceptedRelations', 'COACHING'],
    () => fetchAcceptedInvitationFriend('COACHING')
  );

  const cancelCoachingRequestMutation = useMutation(
    (id) => cancelFriendRequest(id, token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['acceptedRelations', 'COACHING']);
      },
      onError: (error) => {
        Swal.fire('Erreur', `Erreur lors de la suppression: ${error.message}`, 'error');
      },
    }
  );

  const goToChat = async (teacherId) => {
    Swal.fire({
      title: 'Voulez-vous vraiment commencer une conversation?',
      text: "Vous serez redirigé vers la page de chat.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, commencer',
      cancelButtonText: 'Non, annuler',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const conversationId = await getIdOfConverstation(teacherId);
          if (windowWidth < 900) {
            navigate(`/chat/${conversationId}`);  // Mobile version
          } else {
            navigate(`/chat?id=${conversationId}`);  // Desktop version
          }
        } catch (error) {
          Swal.fire('Erreur', 'Erreur lors de la récupération de la conversation.', 'error');
        }
      }
    });
  };

  const handleRemoveTeacher = (teacherId) => {
    Swal.fire({
      title: 'Êtes-vous sûr de vouloir retirer ce professeur?',
      showCancelButton: true,
      confirmButtonText: 'Oui, retirer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        cancelCoachingRequestMutation.mutate(teacherId);
      }
    });
  };

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (isLoading) return <div>Chargement...</div>;
  if (isError) return <div>Erreur lors du chargement des données.</div>;

  return (
    <div style={{ padding: '20px' }}>
      <Card style={styles.card}>
        <h3>Liste des coaches</h3>

        {teachers.length === 0 ? (
          <div style={styles.noTeachersCard}>
            <h5>Aucun professeur disponible</h5>
            <p>Vous n'avez pas encore ajouté de professeur à votre liste.</p>
          </div>
        ) : (
          <ListGroup variant="flush">
            {teachers.map((teacher, index) => (
              <ListGroup.Item
                key={index}
                style={styles.listItem}
              >
                <div style={styles.iconContainer}>
                  <span>{teacher.destinataire.username.charAt(0)}</span>
                </div>

                {/* Use Link to go to the teacher's profile */}
                <Link to={`/dashboard/find-profil/${teacher.destinataire.id}`} style={styles.name}>
                  {teacher.destinataire.username}
                </Link>

                <div style={styles.actions}>
                  <Button
                    variant="link"
                    style={styles.button}
                    onClick={() => goToChat(teacher.destinataire.id)}
                    title="Envoyer un message"
                  >
                    <FiMessageSquare size={20} />
                  </Button>
                  <Button
                    variant="link"
                    style={{ ...styles.button, color: '#dc3545' }}
                    onClick={() => handleRemoveTeacher(teacher.destinataire.id)}
                    title="Retirer de la liste des professeurs"
                    disabled={cancelCoachingRequestMutation.isLoading}
                  >
                    <FiUserMinus size={20} />
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card>
    </div>
  );
};

export default TeacherList;
