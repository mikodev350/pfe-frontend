import React, { useState, useEffect } from "react";
import { Card, Col, Row, Button, Modal, Carousel, OverlayTrigger, Tooltip } from "react-bootstrap";
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
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

const ResourceDetails = ({ resource }) => {
  const [show, setShow] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cachedImages, setCachedImages] = useState([]);
  const [cachedVideo, setCachedVideo] = useState(null);
  const [cachedAudio, setCachedAudio] = useState(null);
  const [cachedPDF, setCachedPDF] = useState(null);

  const handleShow = (index) => {
    setCurrentImageIndex(index);
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const handleSaveResource = () => {
    console.log("Resource saved!");
    // Implement the save resource functionality here
  };

  const fetchMediaFromCache = async (url) => {
    if (!url) return null;

    try {
      const cache = await caches.open('resource-files');
      const response = await cache.match(url);
      if (response) {
        return URL.createObjectURL(await response.blob());
      }
    } catch (error) {
      console.error(`Failed to fetch media from cache for URL: ${url}`, error);
    }
    return null;
  };

 useEffect(() => {
  const cacheResources = async () => {
    if (resource.isLocalUpload) {
      // Utiliser les fichiers locaux directement
            console.log("----------------------------------------------------")

      console.log("resource.images")
      console.log(resource.images)
                  console.log("----------------------------------------------------")

      setCachedImages(resource.images.map((image) => {
        if (image instanceof Blob || image instanceof File) {
          return { url: URL.createObjectURL(image) };
        }
        console.error("L'image locale n'est pas un Blob ou un File :", image);
        return { url: null };
      }));

      if (resource.video && (resource.video instanceof Blob || resource.video instanceof File)) {
        setCachedVideo({ url: URL.createObjectURL(resource.video) });
      } else {
        console.error("La vidéo locale n'est pas un Blob ou un File :", resource.video);
      }

      if (resource.audio && (resource.audio instanceof Blob || resource.audio instanceof File)) {
        setCachedAudio({ url: URL.createObjectURL(resource.audio) });
      } else {
        console.error("L'audio local n'est pas un Blob ou un File :", resource.audio);
      }

      if (resource.pdf && (resource.pdf instanceof Blob || resource.pdf instanceof File)) {
        setCachedPDF({ url: URL.createObjectURL(resource.pdf) });
      } else {
        console.error("Le PDF local n'est pas un Blob ou un File :", resource.pdf);
      }
    } else {
      // Utiliser les fichiers du serveur ou du cache
      if (resource && resource.images && Array.isArray(resource.images)) {
        const cachedImageUrls = await Promise.all(
          resource.images.map(async (image) => {
            const imageUrl = navigator.onLine ? `http://localhost:1337${image?.url}` : image;
            if (imageUrl && !navigator.onLine) {
              const cachedUrl = await fetchMediaFromCache(imageUrl);
              return { url: cachedUrl || imageUrl };
            }
            return { url: imageUrl };
          })
        );
        setCachedImages(cachedImageUrls);
      }

      if (resource && resource.video?.url) {
        const videoUrl = navigator.onLine ? `http://localhost:1337${resource.video.url}` : resource.video;
        if (videoUrl && !navigator.onLine) {
          const cachedUrl = await fetchMediaFromCache(videoUrl);
          setCachedVideo({ url: cachedUrl || videoUrl });
        } else {
          setCachedVideo({ url: videoUrl });
        }
      }

      if (resource && resource.audio?.url) {
        const audioUrl = navigator.onLine ? `http://localhost:1337${resource.audio.url}` : resource.audio;
        if (audioUrl && !navigator.onLine) {
          const cachedUrl = await fetchMediaFromCache(audioUrl);
          setCachedAudio({ url: cachedUrl || audioUrl });
        } else {
          setCachedAudio({ url: audioUrl });
        }
      }

      if (resource && resource.pdf?.url) {
        const pdfUrl = navigator.onLine ? resource.pdf.url : resource.pdf;
        if (pdfUrl) {
          const cachedUrl = await fetchMediaFromCache(pdfUrl);
          setCachedPDF({ url: cachedUrl || pdfUrl });
        }
      }
    }
  };

  cacheResources();
}, [resource]);


  const renderMedia = (media) => {
    if (!media || !media.url) return null;
    return (
      <Image
        src={media.url}
        alt="Resource Image"
        className="img-fluid"
        style={{ cursor: 'pointer' }}
      />
    );
  };

  const renderVideo = (video) => {
    if (!video || !video.url) return null;
    return (
      <video controls width="100%">
        <source src={video.url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  };

  const renderAudio = (audio) => {
    if (!audio || !audio.url) return null;
    return (
      <audio controls className="w-100">
        <source src={audio.url} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    );
  };

  const renderPDF = (pdf) => {
    if (!pdf || !pdf.url) return null;
    return (
      <embed
        src={pdf.url}
        width="100%"
        height="500px"
        type="application/pdf"
      />
    );
  };

  return (
    <StyledCard className="mt-4">
      <StyledHeader>
        <h2>{resource.nom}</h2>
        <ButtonsContainer>
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="button-tooltip">Save Resource</Tooltip>}
          >
            <SaveButton onClick={handleSaveResource}>
              <FaSave />
            </SaveButton>
          </OverlayTrigger>
        </ButtonsContainer>
      </StyledHeader>
      <Card.Body>
        <Row>
          <Col md={6}>
            <p><strong>Format:</strong> {resource.format}</p>
            <p><strong>Note:</strong></p>
            <div dangerouslySetInnerHTML={{ __html: resource.note }} />
          </Col>
          {cachedVideo && (
            <Col md={6}>
              <h3>Vidéo</h3>
              {renderVideo(cachedVideo)}
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
            {cachedAudio && (
              <div>
                <h3>Audio</h3>
                {renderAudio(cachedAudio)}
              </div>
            )}
            {cachedPDF && (
              <div className="mt-4">
                <h3>PDF</h3>
                {renderPDF(cachedPDF)}
              </div>
            )}
            {cachedImages && cachedImages.length > 0 && (
              <div className="mt-4">
                <h3>Images</h3>
                <Row>
                  {cachedImages.map((image, index) => (
                    <Col md={4} key={index}>
                      <Zoom>
                        {renderMedia(image)}
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
                      {cachedImages.map((image, index) => (
                        <Carousel.Item key={index}>
                          <img
                            className="d-block w-100"
                            src={image.url}
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