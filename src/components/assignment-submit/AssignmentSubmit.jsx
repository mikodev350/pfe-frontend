import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

function AssignmentSubmit() {
    const { id } = useParams();
    const [assignment, setAssignment] = useState(null);
    const [file, setFile] = useState(null);

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

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = () => {
        if (file) {
            console.log("Soumettre le devoir", assignment.id, file);
            // Logique pour soumettre le fichier via une API
        } else {
            alert("Veuillez sélectionner un fichier à soumettre.");
        }
    };

    if (!assignment) {
        return <div>Chargement...</div>;
    }

    return (
        <Container>
            <Row className="mt-4">
                <Col>
                    <h2>Soumettre {assignment.title}</h2>
                    <Form>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Sélectionner un fichier</Form.Label>
                            <Form.Control type="file" onChange={handleFileChange} />
                        </Form.Group>
                        <Button variant="primary" onClick={handleSubmit}>
                            Soumettre
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default AssignmentSubmit;
