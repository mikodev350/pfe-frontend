import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { FaBriefcase } from 'react-icons/fa';

const Experience = ({ experiences }) => {
  return (
    <Container className="mt-4 container-profile">
      <Card className="nonBorder">
        <Card.Body>
          <Card.Title className="section-title">
            <FaBriefcase /> Experience
          </Card.Title>
          {experiences.length > 0 ? (
            experiences.map((exp, index) => (
              <Card key={index} className="mb-3 experience-card-content">
                <Card.Body>
                  <Card.Title className="experience-title">
                    {exp.titrePoste} at {exp.entreprise}
                  </Card.Title>
                  <Card.Subtitle className="text-muted mb-2">
                    {exp.dateDebut} - {exp.dateFin ? exp.dateFin : 'Present'}
                  </Card.Subtitle>
                  <p className="text-secondary"><strong>Location:</strong> {exp.localisation}</p>
                  <p className="text-dark description-text"><strong>Description:</strong> {exp.descriptionPoste}</p>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>No experiences available.</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Experience;
