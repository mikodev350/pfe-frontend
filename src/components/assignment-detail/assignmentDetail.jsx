import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';

function AssignmentDetail() {
    const { id } = useParams();
    const [assignment, setAssignment] = useState(null);

    useEffect(() => {
        // Simuler la récupération des détails du devoir depuis une API ou une source externe
        // Remplacer cela par un appel réel à une API
        const fetchAssignment = async () => {
            const data = {
                id: parseInt(id),
                title: 'Devoir 1',
                dueDate: '2024-08-20',
                description: 'Description du devoir 1',
                status: 'En attente'
            };
            setAssignment(data);
        };
        fetchAssignment();
    }, [id]);

    if (!assignment) {
        return <div>Chargement...</div>;
    }

    return (
        <Container>
            <Row className="mt-4">
                <Col>
                    <Card>
                        <Card.Header>{assignment.title}</Card.Header>
                        <Card.Body>
                            <Card.Text>
                                <strong>Date limite: </strong> {assignment.dueDate}
                            </Card.Text>
                            <Card.Text>
                                <strong>Description: </strong> {assignment.description}
                            </Card.Text>
                            <Card.Text>
                                <strong>Statut: </strong> {assignment.status}
                            </Card.Text>
                            {assignment.status === 'En attente' && (
                                <Link to={`/assignments/${assignment.id}/submit`}>
                                    <Button variant="primary">Soumettre</Button>
                                </Link>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default AssignmentDetail;
