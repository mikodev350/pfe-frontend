import React from 'react';
import { Card, Row, Col, Container, Button } from 'react-bootstrap';
import { FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const goo = {
  card: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '20px',
    marginBottom: '20px',
    backgroundColor: '#fff',
  },
  img: {
    width: '150px',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '50%',
    marginRight: '20px',
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  cardText: {
    marginBottom: '5px',
    color: '#555',
  },
  button: {
    alignSelf: 'start',
    backgroundColor: '#007bff',
    borderColor: '#007bff',
    color: '#fff',
    marginTop: '10px',
  },
};


const defaultImage="https://www.google.com/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fvectors%2Fblank-profile-picture-mystery-man-973460%2F&psig=AOvVaw2nTzxt4TdjVkA7fTgDK03g&ust=1718197455295000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCNjXnbvO04YDFQAAAAAdAAAAABAE"
const UserResults = ({ results }) => {
  if (!results || results.length === 0) {
    return <div>No results found.</div>;
  }
  console.log(results)
  return (
    <Container>
      <Row>
        {results.map((user) => (
          <Col key={user.id} sm={12}>
            <Card style={goo.card}>
              <img
                src={`http://localhost:1337${user.profilePicture}` || defaultImage}
                alt={user.username}
                style={goo.img}
              />
              <Card.Body style={goo.cardBody}>
                <Card.Title style={goo.cardTitle}>
                  {user.username}
                </Card.Title>
                <Card.Text style={goo.cardText}>
                  {user.profil && user.profil.role}
                </Card.Text>
                <Card.Text style={goo.cardText}>
                  {user.email}
                </Card.Text>
                <Card.Text style={goo.cardText}>
                  {user.profil && user.profil.nomFormation}
                </Card.Text>
                <Card.Text style={goo.cardText}>
                  {user.profil && user.profil.matieresEnseignees && user.profil.matieresEnseignees.join(', ')}
                </Card.Text>
                <Button as={Link} to={`/dashboard/find-profil/${user.id}`} style={goo.button}>
                  View Profile
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default UserResults;
