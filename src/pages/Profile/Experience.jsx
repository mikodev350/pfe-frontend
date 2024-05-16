
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
const Experience = () => {
  return (
    <Container className="mt-4 container-profile">
      <Card className="nonBorder">
        <Card.Body >
          <Card.Title className="text-primary">Experience</Card.Title>
          <Card >
            <Card.Body>
              <Card.Title className="text-dark">Microsoft</Card.Title>
              <Card.Subtitle>Oct 2011 - Current</Card.Subtitle>
              <p><strong>Position:</strong> Senior Developer</p>
              <p><strong>Description:</strong> Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos placeat, dolorum ullam ipsam, sapiente suscipit dicta eius velit amet aspernatur asperiores modi quidem expedita fugit.</p>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <Card.Title className="text-dark">Sun Microsystems</Card.Title>
              <Card.Subtitle>Nov 2004 - Nov 2011</Card.Subtitle>
              <p><strong>Position:</strong> Systems Admin</p>
              <p><strong>Description:</strong> Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos placeat, dolorum ullam ipsam, sapiente suscipit dicta eius velit amet aspernatur asperiores modi quidem expedita fugit.</p>
            </Card.Body>
          </Card>
        </Card.Body>
      </Card>
    </Container>
  );
};

const Education = () => {
  return (
    <Container className="mt-4 container-profile">
      <Card className="nonBorder">
        <Card.Body>
          <Card.Title className="text-primary">Education</Card.Title>
          <Card>
            <Card.Body>
              <Card.Title>University Of Washington</Card.Title>
              <Card.Subtitle>Sep 1993 - June 1999</Card.Subtitle>
              <p><strong>Degree:</strong> Masters</p>
              <p><strong>Field Of Study:</strong> Computer Science</p>
              <p><strong>Description:</strong> Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos placeat, dolorum ullam ipsam, sapiente suscipit dicta eius velit amet aspernatur asperiores modi quidem expedita fugit.</p>
            </Card.Body>
          </Card>
        </Card.Body>
      </Card>
    </Container>
  );
};

export { Experience, Education };
