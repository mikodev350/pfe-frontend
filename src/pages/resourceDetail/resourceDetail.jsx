import React, { useState } from "react";
import { Card, Col, Row, Button, Modal, Carousel } from "react-bootstrap";
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

const ResourceDetails = ({ resource }) => {
  const [show, setShow] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleShow = (index) => {
    setCurrentImageIndex(index);
    setShow(true);
  };

  const handleClose = () => setShow(false);

  return (
    <Card className="mt-4">
      <Card.Header>
        <h2>{resource.nom}</h2>
      </Card.Header>
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
              <video controls width="100%">
                <source src={`https://localhost:1337${resource.video.url}`} type={resource.video.mime} />
                Your browser does not support the video tag.
              </video>
            </Col>
          )}
        </Row>
        <Row className="mt-4">
          <Col md={6}>
            <h3>Parcours</h3>
            {resource.parcours.map((parcours) => (
              <Card key={parcours.id} className="mb-2">
                <Card.Body>
                  <p>Nom du parcours: {parcours.nom}</p>
                  {/* Affichez d'autres propriétés du parcours ici */}
                </Card.Body>
              </Card>
            ))}
          </Col>
          <Col md={6}>
            <h3>Modules</h3>
            {resource.modules.map((module) => (
              <Card key={module.id} className="mb-2">
                <Card.Body>
                  <p>Nom du module: {module.nom}</p>
                  {/* Affichez d'autres propriétés du module ici */}
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Row>
        <Row className="mt-4">
          <Col md={6}>
            <h3>Leçons</h3>
            {resource.lessons.map((lesson) => (
              <Card key={lesson.id} className="mb-2">
                <Card.Body>
                  <p>Nom de la leçon: {lesson.nom}</p>
                  {/* Affichez d'autres propriétés de la leçon ici */}
                </Card.Body>
              </Card>
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
                <iframe title="PDF Viewer" src={`http://localhost:1337${resource.pdf.url}`} width="100%" height="500px"></iframe>
              </div>
            )}
            {resource.images && resource.images.length > 0 && (
              <div className="mt-4">
                <h3>Images</h3>
                <Row>
                  {resource.images.map((image, index) => (
                    <Col md={4} key={index}>
                      <Zoom>
                        <img 
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
    </Card>
  );
};

export default ResourceDetails;
