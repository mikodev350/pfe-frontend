import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Container, Row, Col, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { FiTrash2, FiImage } from 'react-icons/fi';
import { fetchOneDevoir } from './../../api/apiDevoir';
import { getToken } from '../../util/authUtils';
import { uploadFile } from './../../api/apiUpload';
import { checkDevoir, putDevoir } from './../../api/apiReponseStudent'; // Import the functions

const AssignmentDetail = () => {
    const { id } = useParams();
    const [assignment, setAssignment] = useState(null);
    const [images, setImages] = useState([]);
    const [canSubmit, setCanSubmit] = useState(true); // State to track if user can submit
    const [isUpdate, setIsUpdate] = useState(false); // Track if the assignment is an update
    const hiddenFileInput = useRef(null);
    const token = getToken();

    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const data = await fetchOneDevoir(id, token);
                setAssignment(data);

                // Check if the student has already completed the devoir
                const checkResult = await checkDevoir(id, token);
                if (checkResult.update) {
                    alert("Vous avez déjà soumis ce devoir. Vous pouvez le mettre à jour.");
                    setCanSubmit(true);
                    setIsUpdate(true); // Mark this as an update
                } else {
                    setCanSubmit(true);
                    setIsUpdate(false);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération du devoir:", error);
            }
        };
        fetchAssignment();
    }, [id, token]);

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        const newImages = files.map(file => ({
            preview: URL.createObjectURL(file),
            raw: file
        }));
        setImages([...images, ...newImages]);
    };

    const handleClick = () => {
        hiddenFileInput.current.click();
    };

    const removeImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const handleSubmit = async () => {
        if (!canSubmit) {
            alert("Vous ne pouvez pas soumettre ce devoir.");
            return;
        }

        if (images.length > 0) {
            try {
                const uploadedImages = [];

                // Upload each image
                for (let image of images) {
                    const uploadedImage = await uploadFile(image.raw, token);
                    uploadedImages.push(uploadedImage[0].id); // Get the file ID
                }

                // Prepare the payload for submission
                const answerHistoryEntry = {
                    attachement: uploadedImages, // Array of uploaded file IDs
                };

                const result = await putDevoir(id, answerHistoryEntry, token);
                if (isUpdate) {
                    alert('Votre devoir a été mis à jour avec succès.');
                } else {
                    alert('Images soumises avec succès et associées à l\'historique de réponses !');
                }

                setImages([]); // Clear images after successful submission
            } catch (error) {
                console.error("Erreur lors de l'upload et de l'association des images:", error);
                alert("Une erreur est survenue lors de l'upload des images.");
            }
        } else {
            alert("Veuillez sélectionner des images à soumettre.");
        }
    };

    if (!assignment) {
        return <div>Chargement...</div>;
    }

    return (
        <Container>
            <Row className="mt-4">
                <Col>
                    <Card>
                        <Card.Header>{assignment.titre}</Card.Header>
                        <Card.Body>
                            <Card.Text>
                                <strong>Description: </strong>
                                <div dangerouslySetInnerHTML={{ __html: assignment.description }} />
                            </Card.Text>
                            <Card.Text>
                                <strong>Statut: </strong> <span>{assignment.status}</span>
                            </Card.Text>
                            <Form>
                                <Form.Group controlId="formFile" className="mb-3">
                                    <Form.Label>Sélectionner des images pour soumettre</Form.Label>
                                    <Button onClick={handleClick} disabled={!canSubmit}>
                                        <FiImage size={20} />
                                        {isUpdate ? "Mettre à jour les images" : "Ajouter des images"}
                                    </Button>
                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg"
                                        ref={hiddenFileInput}
                                        onChange={handleFileChange}
                                        multiple
                                        style={{ display: "none" }}
                                    />
                                    <div>
                                        {images.length > 0 && images.map((image, index) => (
                                            <div key={index} style={{ position: 'relative', display: 'inline-block', margin: '10px' }}>
                                                <img src={image.preview} alt={`Preview ${index}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                                <Button
                                                    variant="outline-danger"
                                                    onClick={() => removeImage(index)}
                                                    style={{ position: 'absolute', top: '5px', right: '5px' }}
                                                >
                                                    <FiTrash2 size={16} />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </Form.Group>
                                <div className='d-flex justify-content-center'>
                                    <Button variant="primary" onClick={handleSubmit} disabled={!canSubmit}>
                                        {isUpdate ? "Mettre à jour" : "Soumettre"}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AssignmentDetail;
