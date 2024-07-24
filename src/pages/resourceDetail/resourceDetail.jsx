import React, { useState } from "react";
import { Card, Col, Row, Button, Modal, Carousel, OverlayTrigger, Tooltip } from "react-bootstrap";
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import GenerateLinkButton from "../../components/GenerateLinkButton/GenerateLinkButton";
import { cloneResource } from "../../api/apiResource";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import { FaSave } from "react-icons/fa";

const StyledCard = styled(Card)`
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const StyledHeader = styled(Card.Header)`
  background-color: #007bff;
  color: white;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
      height: 66px;

`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const SaveButton = styled(Button)`
  background-color: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
`;

const InnerCard = styled(Card)`
  background-color: #fff;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
`;

const Image = styled.img`
  border-radius: 4px;
`;

const ResourceDetails = ({ resource, isFromLink, token }) => {
  const [show, setShow] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleShow = (index) => {
    setCurrentImageIndex(index);
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const handleSaveResource = async () => {
    try {
      const newResource = await cloneResource(resource.id, token);
      toast.success("Resource saved successfully!");
      console.log("New Resource:", newResource); // For debugging purposes
    } catch (error) {
      console.error("Error saving resource:", error);
      toast.error("Error saving resource");
    }
  };

  return (
    <StyledCard className="mt-4">
      <ToastContainer />
      <StyledHeader>
        <h2>{resource.nom}</h2>
        <ButtonsContainer>
          {isFromLink && (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id="button-tooltip">Save Resource</Tooltip>}
            >
              <SaveButton onClick={handleSaveResource}>
                <FaSave />
              </SaveButton>
            </OverlayTrigger>
          )}
          {!isFromLink && <GenerateLinkButton resourceId={resource.id} />}
        </ButtonsContainer>
      </StyledHeader>
      <Card.Body>
        <Row>
          <Col md={6}>
            <p><strong>Format:</strong> {resource.format}</p>
            <p><strong>Note:</strong></p>
            <div dangerouslySetInnerHTML={{ __html: resource.note }} />
          </Col>
{resource.video && (
  <Col md={6}>
    <h3>Vidéo</h3>
    {console.log("Video URL:", `http://localhost:1337${resource.video.url}`)}
    {console.log("Video MIME type:", resource.video.mime)}
    <video controls width="100%">
      <source src={`http://localhost:1337${resource.video.url}`} type={resource.video.mime} />
      Your browser does not support the video tag.
    </video>
  </Col>
)}

        </Row>
        <Row className="mt-4">
          <Col md={6}>
            <h3>Parcours</h3>
            {resource.parcours && resource.parcours.map((parcours) => (
              <InnerCard key={parcours.id} className="mb-2">
                <Card.Body>
                  <p>Nom du parcours: {parcours.nom}</p>
                </Card.Body>
              </InnerCard>
            ))}
          </Col>
          <Col md={6}>
            <h3>Modules</h3>
            {resource.modules && resource.modules.map((module) => (
              <InnerCard key={module.id} className="mb-2">
                <Card.Body>
                  <p>Nom du module: {module.nom}</p>
                </Card.Body>
              </InnerCard>
            ))}
          </Col>
        </Row>
        <Row className="mt-4">
          <Col md={6}>
            <h3>Leçons</h3>
            {resource.lessons && resource.lessons.map((lesson) => (
              <InnerCard key={lesson.id} className="mb-2">
                <Card.Body>
                  <p>Nom de la leçon: {lesson.nom}</p>
                </Card.Body>
              </InnerCard>
            ))}
          </Col>
          <Col md={6}>
            {resource.audio && (
              <div>
                <h3>Audio</h3>
                <audio controls src={`http://localhost:1337${resource.audio.url}`} className="w-100">
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
            {resource.pdf && (
  <div className="mt-4">
    <h3>PDF</h3>
    <embed
      src={`http://localhost:1337${resource.pdf.url}`}
      width="100%"
      height="500px"
      type="application/pdf"
    />
  </div>
)}
            {resource.images && resource.images.length > 0 && (
              <div className="mt-4">
                <h3>Images</h3>
                <Row>
                  {resource.images.map((image, index) => (
                    <Col md={4} key={index}>
                      <Zoom>
                        <Image
                          src={`http://localhost:1337${image.url}`}
                          alt={`Image ${index + 1}`}
                          className="img-fluid"
                          style={{ cursor: 'pointer' }}
                        />
                      </Zoom>
                      <Button variant="link" onClick={() => handleShow(index)}>
                        Voir en plein écran
                      </Button>
                    </Col>
                  ))}
                </Row>
                <Modal show={show} onHide={handleClose} size="lg" centered>
                  <Modal.Header closeButton>
                    <Modal.Title>Images</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Carousel activeIndex={currentImageIndex} onSelect={(selectedIndex) => setCurrentImageIndex(selectedIndex)}>
                      {resource.images.map((image, index) => (
                        <Carousel.Item key={index}>
                          <img
                            className="d-block w-100"
                            src={`http://localhost:1337${image.url}`}
                            alt={`Image ${index + 1}`}
                          />
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  </Modal.Body>
                </Modal>
              </div>
            )}
            {resource.link && (
              <div className="mt-4">
                <h3>Lien</h3>
                <a href={resource.link} target="_blank" rel="noopener noreferrer">{resource.link}</a>
              </div>
            )}
          </Col>
        </Row>
      </Card.Body>
    </StyledCard>
  );
};

export default ResourceDetails;
