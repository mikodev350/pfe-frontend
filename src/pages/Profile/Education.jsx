import { Container, Card } from 'react-bootstrap';

const Education = ({ educations }) => {
  return (
    <Container className="mt-4 container-profile">
      <Card className="nonBorder">
        <Card.Body>
          <Card.Title className="text-primary">Education</Card.Title>
          {educations.map((edu, index) => (
            <Card key={index}>
              <Card.Body>
                <Card.Title>{edu.ecole}</Card.Title>
                <Card.Subtitle>{edu.diplome} - {edu.dateDebut} to {edu.dateFin}</Card.Subtitle>
                <p><strong>Field Of Study:</strong> {edu.domaineEtude}</p>
                <p><strong>Description:</strong> {edu.descriptionProgramme}</p>
              </Card.Body>
            </Card>
          ))}
        </Card.Body>
      </Card>
    </Container>
  );
};

export  default Education;
