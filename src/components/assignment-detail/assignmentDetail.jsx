import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Container, Row, Col, Form } from 'react-bootstrap';
import { FiTrash2, FiImage } from 'react-icons/fi';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { fetchDevoirById } from './../../api/apiDevoir';
import { getToken } from '../../util/authUtils';
import { uploadFile } from './../../api/apiUpload';
import { checkDevoir, putDevoir } from './../../api/apiReponseStudent';
import Retour from '../retour-arriere/Retour';

const StyledCard = styled(Card)`
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  background-color:#ffffff !important;
`;

const Header = styled(Card.Header)`
  background-color: #007bff;
  color: white;
  font-size: 1.5rem;
  text-align: center;
  border-radius: 15px 15px 0 0;
`;

const SubmitButton = styled(Button)`
  background-color: #28a745;
  border: none;
  padding: 10px 30px;
  border-radius: 5px;
  &:hover {
    background-color: #218838;
  }
`;

const ImagePreview = styled.div`
  position: relative;
  display: inline-block;
  margin: 10px;
  img {
    width: 120px;
    height: 120px;
    object-fit: cover;
    border-radius: 10px;
    transition: transform 0.3s ease;
    &:hover {
      transform: scale(1.1);
    }
  }
`;

const AssignmentDetail = () => {
    const { id } = useParams();
    const [assignment, setAssignment] = useState(null);
    const [images, setImages] = useState([]);
    const [canSubmit, setCanSubmit] = useState(true);
    const [isUpdate, setIsUpdate] = useState(false);
    const hiddenFileInput = useRef(null);
    const token = getToken();

    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const data = await fetchDevoirById(id, token, 'assignation'); 
                setAssignment(data);

                const checkResult = await checkDevoir(id, token);
                if (checkResult.update) {
                    alert("Vous avez déjà soumis ce devoir. Vous pouvez le mettre à jour.");
                    setCanSubmit(true);
                    setIsUpdate(true);
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

                for (let image of images) {
                    const uploadedImage = await uploadFile(image.raw, token);
                    uploadedImages.push(uploadedImage[0].id);
                }

                const answerHistoryEntry = {
                    attachement: uploadedImages,
                };

                const result = await putDevoir(id, answerHistoryEntry, token);
                if (isUpdate) {
                    alert('Votre devoir a été mis à jour avec succès.');
                } else {
                    alert('Images soumises avec succès et associées à l\'historique de réponses !');
                }

                setImages([]);
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
            <Retour />
            <Row className="mt-4">
                <Col>
                    <StyledCard>
                        <Header>{assignment.titre}</Header>
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
                                    <br />
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
                                            <ImagePreview key={index}>
                                                <img src={image.preview} alt={`Preview ${index}`} />
                                                <Button
                                                    variant="outline-danger"
                                                    onClick={() => removeImage(index)}
                                                    style={{ position: 'absolute', top: '5px', right: '5px' }}
                                                >
                                                    <FiTrash2 size={16} />
                                                </Button>
                                            </ImagePreview>
                                        ))}
                                    </div>
                                </Form.Group>
                                <div className='d-flex justify-content-center'>
                                    <SubmitButton onClick={handleSubmit} disabled={!canSubmit}>
                                        {isUpdate ? "Mettre à jour" : "Soumettre"}
                                    </SubmitButton>
                                </div>
                            </Form>
                        </Card.Body>
                    </StyledCard>
                </Col>
            </Row>
        </Container>
    );
};

export default AssignmentDetail;
