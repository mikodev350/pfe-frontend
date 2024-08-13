import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Container, Row, Col, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { FiTrash2, FiImage } from 'react-icons/fi';

const styles = {
    cardHeader: {
        backgroundColor: '#007bff',
        color: '#fff',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    cardBody: {
        padding: '20px',
        backgroundColor: '#f8f9fa',
    },
    cardText: {
        fontSize: '1rem',
        marginBottom: '10px',
    },
    button: {
        marginTop: '20px',
        display: 'block',
        width: '100%',
        padding: '10px 20px',
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#fff',
        backgroundColor: '#28a745',
        borderColor: '#28a745',
        borderRadius: '5px',
        transition: 'background-color 0.3s ease',
        cursor: 'pointer',
        textAlign: 'center',
    },
    buttonHover: {
        backgroundColor: '#218838',
    },
    statusText: {
        fontWeight: 'bold',
        color: '#dc3545',
    },
    loadingText: {
        textAlign: 'center',
        fontSize: '1.2rem',
        color: '#007bff',
    },
    imagePreviewContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        marginTop: '10px',
    },
    imagePreview: {
        position: 'relative',
        width: '100px',
        height: '100px',
        objectFit: 'cover',
        borderRadius: '4px',
        border: '1px solid #ddd',
    },
    removeButton: {
        position: 'absolute',
        top: '5px',
        right: '5px',
        backgroundColor: '#dc3545',
        borderColor: '#dc3545',
        color: '#fff',
        borderRadius: '50%',
        padding: '2px 6px',
    },
    addImageButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#17a2b8',
        color: '#fff',
        padding: '10px 15px',
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s ease',
    },
    addImageButtonHover: {
        backgroundColor: '#138496',
    },
    addImageIcon: {
        marginRight: '10px',
    },
};

function AssignmentDetail() {
    const { id } = useParams();
    const [assignment, setAssignment] = useState(null);
    const [images, setImages] = useState([]); // Stocke les images sélectionnées
    const hiddenFileInput = useRef(null);

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

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files); // Convertir les fichiers en tableau
        const newImages = files.map(file => ({
            preview: URL.createObjectURL(file), // Générer un aperçu
            raw: file // Stocker le fichier brut
        }));
        setImages([...images, ...newImages]); // Ajouter les nouvelles images aux précédentes
    };

    const handleClick = () => {
        hiddenFileInput.current.click();
    };

    const removeImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1); // Supprimer l'image sélectionnée
        setImages(newImages); // Mettre à jour l'état avec les images restantes
    };

    const handleSubmit = () => {
        if (images.length > 0) {
            // Logique pour soumettre les images via une API ou autre méthode
            console.log("Soumettre les images : ", images);
            alert('Images soumises avec succès !');
        } else {
            alert("Veuillez sélectionner des images à soumettre.");
        }
    };

    if (!assignment) {
        return <div style={styles.loadingText}>Chargement...</div>;
    }

    return (
        <Container>
            <Row className="mt-4">
                <Col>
                    <Card>
                        <Card.Header style={styles.cardHeader}>{assignment.title}</Card.Header>
                        <Card.Body style={styles.cardBody}>
                            <Card.Text style={styles.cardText}>
                                <strong>Date limite: </strong> {assignment.dueDate}
                            </Card.Text>
                            <Card.Text style={styles.cardText}>
                                <strong>Description: </strong> {assignment.description}
                            </Card.Text>
                            <Card.Text style={styles.cardText}>
                                <strong>Statut: </strong> <span style={styles.statusText}>{assignment.status}</span>
                            </Card.Text>
                            {assignment.status === 'En attente' && (
                                <Form>
                                    <Form.Group controlId="formFile" className="mb-3">
                                        <Form.Label>Sélectionner des images pour soumettre</Form.Label>
                                        <Button
                                            onClick={handleClick}
                                            style={styles.addImageButton}
                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.addImageButtonHover.backgroundColor}
                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.addImageButton.backgroundColor}
                                        >
                                            <FiImage size={20} style={styles.addImageIcon} />
                                            Ajouter des images
                                        </Button>
                                        <input
                                            type="file"
                                            accept="image/png, image/jpeg"
                                            ref={hiddenFileInput}
                                            onChange={handleFileChange}
                                            multiple // Permettre la sélection multiple
                                            style={{ display: "none" }}
                                        />
                                        <div style={styles.imagePreviewContainer}>
                                            {images.length > 0 && images.map((image, index) => (
                                                <div key={index} className="image-preview" style={{ position: 'relative' }}>
                                                    <img src={image.preview} alt={`Preview ${index}`} style={styles.imagePreview} />
                                                    <Button
                                                        variant="outline-danger"
                                                        onClick={() => removeImage(index)}
                                                        style={styles.removeButton}
                                                    >
                                                        <FiTrash2 size={16} />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </Form.Group>
                                    <div className='d-flex justify-content-center'>
                                        <Button
                                            variant="primary"
                                            style={styles.button}
                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
                                            onClick={handleSubmit}
                                        >
                                            Soumettre
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default AssignmentDetail;
