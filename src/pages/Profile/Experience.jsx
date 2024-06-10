import React from 'react';
import { Container, Card } from 'react-bootstrap';

const Experience = ({ experiences }) => {
  return (
    <Container className="mt-4 container-profile">
      <Card className="nonBorder">
        <Card.Body>
          <Card.Title className="text-primary">Experience</Card.Title>
          {experiences.map((exp, index) => (
            <Card key={index}>
              <Card.Body>
                <Card.Title className="text-dark">{exp.titrePoste} at {exp.entreprise}</Card.Title>
                <Card.Subtitle>{exp.dateDebut} - {exp.dateFin}</Card.Subtitle>
                <p><strong>Location:</strong> {exp.localisation}</p>
                <p><strong>Description:</strong> {exp.descriptionPoste}</p>
              </Card.Body>
            </Card>
          ))}
        </Card.Body>
      </Card>
    </Container>
  );
};



export default Experience ;
