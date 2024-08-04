// MediaDisplay.jsx
import React, { useState, useEffect } from "react";
import { Row, Col, Modal, Carousel, Button } from "react-bootstrap";
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

const MediaDisplay = ({ resource }) => {
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
      cachedImages.forEach((img) => img.url && URL.revokeObjectURL(img.url));
      cachedVideo && cachedVideo.url && URL.revokeObjectURL(cachedVideo.url);
      cachedAudio && cachedAudio.url && URL.revokeObjectURL(cachedAudio.url);
      cachedPDF && cachedPDF.url && URL.revokeObjectURL(cachedPDF.url);

      if (resource.isLocalUpload) {
        if (resource.images && Array.isArray(resource.images)) {
          setCachedImages(resource.images.map((image) => {
            if (image instanceof Blob || image instanceof File) {
              return { url: URL.createObjectURL(image) };
            }
            console.error("L'image locale n'est pas un Blob ou un File :", image);
            return { url: null };
          }));
        }

        if (resource.video && (resource.video instanceof Blob || resource.video instanceof File)) {
          setCachedVideo({ url: URL.createObjectURL(resource.video) });
        } else {
          setCachedVideo(null);
          console.error("La vidéo locale n'est pas un Blob ou un File :", resource.video);
        }

        if (resource.audio && (resource.audio instanceof Blob || resource.audio instanceof File)) {
          setCachedAudio({ url: URL.createObjectURL(resource.audio) });
        } else {
          setCachedAudio(null);
          console.error("L'audio local n'est pas un Blob ou un File :", resource.audio);
        }

        if (resource.pdf && (resource.pdf instanceof Blob || resource.pdf instanceof File)) {
          setCachedPDF({ url: URL.createObjectURL(resource.pdf) });
        } else {
          setCachedPDF(null);
          console.error("Le PDF local n'est pas un Blob ou un File :", resource.pdf);
        }
      } else {
        if (resource && resource.images && Array.isArray(resource.images)) {
          const cachedImageUrls = await Promise.all(
            resource.images.map(async (image) => {
              const imageUrl = `http://localhost:1337${image?.url}`;
              if (navigator.onLine) {
                return { url: imageUrl };
              } else {
                const cachedUrl = await fetchMediaFromCache(imageUrl);
                return { url: cachedUrl || imageUrl };
              }
            })
          );
          setCachedImages(cachedImageUrls);
        }

        if (resource && resource.video?.url) {
          const videoUrl = `http://localhost:1337${resource.video.url}`;
          if (navigator.onLine) {
            setCachedVideo({ url: videoUrl });
          } else {
            const cachedUrl = await fetchMediaFromCache(videoUrl);
            setCachedVideo({ url: cachedUrl || videoUrl });
          }
        }

        if (resource && resource.audio?.url) {
          const audioUrl = `http://localhost:1337${resource.audio.url}`;
          if (navigator.onLine) {
            setCachedAudio({ url: audioUrl });
          } else {
            const cachedUrl = await fetchMediaFromCache(audioUrl);
            setCachedAudio({ url: cachedUrl || audioUrl });
          }
        }

        if (resource && resource.pdf?.url) {
          const pdfUrl = resource.pdf.url;
          if (navigator.onLine) {
            setCachedPDF({ url: pdfUrl });
          } else {
            const cachedUrl = await fetchMediaFromCache(pdfUrl);
            setCachedPDF({ url: cachedUrl || pdfUrl });
          }
        }
      }
    };

    cacheResources();

    return () => {
      cachedImages.forEach((img) => img.url && URL.revokeObjectURL(img.url));
      cachedVideo && cachedVideo.url && URL.revokeObjectURL(cachedVideo.url);
      cachedAudio && cachedAudio.url && URL.revokeObjectURL(cachedAudio.url);
      cachedPDF && cachedPDF.url && URL.revokeObjectURL(cachedPDF.url);
    };
  }, [resource]);

  const renderMedia = (media) => {
    if (!media || !media.url) return null;
    return (
      <img
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
    <div>
      <Row className="mt-4">
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
        {cachedVideo && (
          <div className="mt-4">
            <h3>Vidéo</h3>
            {renderVideo(cachedVideo)}
          </div>
        )}
        {cachedAudio && (
          <div className="mt-4">
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
      </Row>
    </div>
  );
};

export default MediaDisplay;
