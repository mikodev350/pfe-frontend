import React from 'react';
import { Card, Row, Col, Container, Badge } from 'react-bootstrap';
import { FaChalkboardTeacher, FaBook, FaBookReader } from 'react-icons/fa';

const cardStyle = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
};

const cardBodyStyle = {
  flex: 1,
};

const UserResults = ({ results }) => {
    console.log('====================================');
    console.log(results);
    console.log('====================================');
  if (!Array.isArray(results) || results.length === 0) {
    return <div>No results found.</div>;
  }

  return (
    <Container>
      <Row>
        {results.map((result) => (
          <Col key={result.id} sm={12} md={6} lg={4} className="mb-4">
            <Card style={cardStyle}>
              <Card.Body style={cardBodyStyle}>
                <Card.Title className="text-primary">{result.username}</Card.Title>
                
                {result.type === 'student' && (
                  <>
                    <Card.Text>
                      <FaBook className="me-2" />
                      <strong>Parcours:</strong> {result.parcours}
                    </Card.Text>
                    <Card.Text>
                      <FaChalkboardTeacher className="me-2" />
                      <strong>Modules:</strong> {result.modules}
                    </Card.Text>
                    <Card.Text>
                      <FaBookReader className="me-2" />
                      <strong>Lessons:</strong> {result.lessons}
                    </Card.Text>
                  </>
                )}

                {result.type === 'teacher' && (
                  <>
                    <Card.Text>
                      <FaChalkboardTeacher className="me-2" />
                      <strong>Matières enseignées:</strong> {result.matieresEnseignees}
                    </Card.Text>
                    <Card.Text>
                      <FaBook className="me-2" />
                      <strong>Niveau(x) enseigné(s):</strong> {result.niveauEnseigne}
                    </Card.Text>
                    {result.niveauEnseigne.includes('Université') && (
                      <Card.Text>
                        <FaBookReader className="me-2" />
                        <strong>Spécialité enseignée:</strong> {result.specialiteEnseigne}
                      </Card.Text>
                    )}
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default UserResults;
