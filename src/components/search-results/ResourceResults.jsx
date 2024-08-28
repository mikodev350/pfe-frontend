import React from 'react';
import { Row, Col, Container, Badge } from 'react-bootstrap';
import { FaTools, FaBook, FaChalkboardTeacher, FaBookReader } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// Styled Components
const StyledCard = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #FFFFFF !important;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);

  &:hover {
    box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.15);
  }
`;

const StyledCardBody = styled.div`
  flex: 1;
  padding: 1.25rem;
`;

const ResourceResults = ({ results }) => {
  if (!Array.isArray(results) || results.length === 0) {
    return <div>No results found.</div>;
  }

  return (
    <Container>
      <Row>
        {results.map((result) => (
          <Col key={result.id} sm={12} md={6} lg={4} className="mb-4">
            <StyledCard>
              <StyledCardBody>
                <h5 className="text-primary">{result.name}</h5>
                <p>
                  <FaBook className="me-2" />
                  <strong>Parcours:</strong> {result.parcours}
                </p>
                <p>
                  <FaChalkboardTeacher className="me-2" />
                  <strong>Modules:</strong> {result.modules}
                </p>
                <p>
                  <FaBookReader className="me-2" />
                  <strong>Lessons:</strong> {result.lessons}
                </p>
                <p>
                  <FaTools className="me-2" />
                  <strong>Resources:</strong> {result.resources}
                </p>
              </StyledCardBody>
              <div className="d-flex justify-content-between p-3">
                <Badge as={Link} to={`/dashboard/resource-preview/${result.id}`} bg="info" className="me-2">
                  View Resource
                </Badge>
              </div>
            </StyledCard>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ResourceResults;
