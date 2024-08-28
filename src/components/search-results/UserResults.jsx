import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// Styled Components
// Styled Components
const StyledCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px;
  margin-bottom: 20px;
  background-color: #fff;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
  margin-right: 20px;

  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 15px;
  }
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 768px) {
    align-items: center;
  }
`;

const CardTitle = styled.h5`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 5px;
`;

const CardText = styled.p`
  margin-bottom: 5px;
  color: #555;
`;

const StyledButton = styled(Link)`
  align-self: center; /* Center the button horizontally */
  background-color: #10266F;
  border-color: #10266F;
  color: #fff;
  margin-top: 10px;
  padding: 10px 20px;
  text-decoration: none;
  text-align: center;
  border-radius: 4px;
  width: 100%; /* Make the button take the full width of its container */
  max-width: 150px; /* Limit the maximum width */

  &:hover {
    background-color: #0d214c;
    border-color: #0d214c;
  }

  @media (max-width: 768px) {
    padding: 10px 0;
  }
`;



const defaultImage = "https://www.google.com/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fvectors%2Fblank-profile-picture-mystery-man-973460%2F&psig=AOvVaw2nTzxt4TdjVkA7fTgDK03g&ust=1718197455295000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCNjXnbvO04YDFQAAAAAdAAAAABAE";

const UserResults = ({ results }) => {
  if (!results || results.length === 0) {
    return <div>No results found.</div>;
  }

return (
    <Container>
      <Row>
        {results.map((user) => (
          <Col key={user.id} sm={12}>
            <StyledCard>
              <ProfileImage
                src={`http://localhost:1337${user.profilePicture}` || defaultImage}
                alt={user.username}
              />
              <CardBody>
                <CardTitle>{user.username}</CardTitle>
                <CardText>{user.profil && user.profil.role}</CardText>
                <CardText>{user.email}</CardText>
                <CardText>{user.profil && user.profil.nomFormation}</CardText>
                <CardText>
                  {user.profil && user.profil.matieresEnseignees && user.profil.matieresEnseignees.join(', ')}
                </CardText>
                <StyledButton to={`/dashboard/find-profil/${user.id}`}>
                  Voir le profil
                </StyledButton>
              </CardBody>
            </StyledCard>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default UserResults;
