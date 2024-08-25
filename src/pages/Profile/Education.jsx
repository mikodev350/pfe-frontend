import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { FaGraduationCap } from 'react-icons/fa';

const Education = ({ educations }) => {
  return (
    <Container className="mt-4 container-profile">
      <Card className="nonBorder">
        <Card.Body>
          <Card.Title className="section-title">
            <FaGraduationCap /> Education
          </Card.Title>
          {educations.length > 0 ? (
            educations.map((edu, index) => (
              <Card key={index} className="mb-3 education-card-content">
                <Card.Body>
                  <Card.Title className="education-title">{edu.ecole}</Card.Title>
                  <Card.Subtitle className="text-muted mb-2">
                    {edu.diplome} - {edu.dateDebut} to {edu.dateFin ? edu.dateFin : 'Present'}
                  </Card.Subtitle>
                  <p className="text-secondary"><strong>Field Of Study:</strong> {edu.domaineEtude}</p>
                  <p className="text-dark description-text"><strong>Description:</strong> {edu.descriptionProgramme}</p>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>No education details available.</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Education;
