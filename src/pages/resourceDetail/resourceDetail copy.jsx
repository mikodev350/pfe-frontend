import React, { useState, useEffect } from "react";
import { Card, Col, Row, Button, Modal, Carousel, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Viewer } from '@react-pdf-viewer/core';


import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import styled from 'styled-components';
import { FaSave } from "react-icons/fa";
import GenerateLinkButton from "../../components/GenerateLinkButton/GenerateLinkButton";
const StyledCard = styled(Card)`
  background-color: #ffffff !important;
  border: 1px solid #ddd;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin-bottom: 20px;
  padding: 20px;
`;


const InfoCard = styled(Card)`
  background-color: #ffffff !important;
  border: 1px solid #ddd !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2) !important; /* Plus d'ombre pour un effet de profondeur accentué */
  border-radius: 8px !important;
  padding: 15px !important;
  margin-bottom: 10px !important;
`;

const InfoTitle = styled.h4`
  font-size: 1.2rem;
  font-weight: bold;
  color: #10266F;
  margin-bottom: 15px;
`;

const InfoContent = styled.div`
  font-size: 1rem !important;
  color: #333 !important;
  margin-bottom: 10px !important;
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between; /* Space between title and button */
  align-items: center;
  background: linear-gradient(135deg, #10266F, #007bff); /* Gradient background */
  padding: 15px 20px; /* Padding for some spacing */
  border-radius: 8px; /* Rounded corners */
  margin-bottom: 20px; /* Spacing below the container */
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  color: white; /* White color for contrast against the background */
  margin: 0;
`;

const SaveButton = styled(Button)`
  background-color: #ffffff !important; /* White background */
  border: none;
  color: #007bff !important; /* Blue icon color */
  font-size: 1.5rem;
  width: 50px !important;
  height: 50px !important;
  padding: 0; /* Remove inner padding */
  border-radius: 50% !important; /* Fully rounded button */
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: #e6f0ff !important; /* Lighter blue on hover */
  }
`;

const InnerCardBody = styled(Card.Body)`
  padding: 15px !important; /* Renforcer le padding */
  color: #333 !important; /* Couleur du texte */
  font-size: 1rem !important; /* Taille du texte */
`;




const InnerCard = styled(Card)`
  background-color: #ffffff !important;
  border: 1px solid #ddd !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2) !important; /* Plus d'ombre pour un effet de profondeur accentué */
  border-radius: 8px !important;
  padding: 15px !important;
  margin-bottom: 10px !important;
`;


const SectionTitle = styled.h3`
  color: #10266F; /* Bleu foncé principal */
  margin-top: 20px;
  margin-bottom: 15px;
  font-weight: bold;
`;
const Image = styled.img`
  border-radius: 4px !important;
  width: 100px !important; 
  height: 100px !important; 
  object-fit: cover !important;

  @media (max-width: 768px) {
    width: 80px !important; /* Réduction de la taille pour les écrans plus petits */
    height: 80px !important;
  }

  @media (max-width: 576px) {
    width: 60px !important; /* Réduction supplémentaire pour les très petits écrans */
    height: 60px !important;
  }
`;

const NoteTitle = styled.p`
  font-size: 1.5rem; /* Increases the font size */
  font-weight: bold;
  color: #10266F; /* Adjust the color to match your theme */
  margin-bottom: 10px; /* Optional spacing */
`;
















const PdfViewer = ({ pdfUrl }) => {
  const [blobUrl, setBlobUrl] = useState(null);

  useEffect(() => {
    // Fonction pour télécharger le PDF en tant que Blob
    const fetchPdfAsBlob = async () => {
      try {
        const response = await fetch(pdfUrl);
        const blob = await response.blob();

        // Créer une URL Blob pour afficher le PDF
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
      } catch (error) {
        console.error('Erreur lors du téléchargement du PDF', error);
      }
    };

    // Appeler la fonction de téléchargement
    fetchPdfAsBlob();

    // Nettoyer l'URL blob lorsqu'il n'est plus utilisé
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [pdfUrl]);

  if (!blobUrl) {
    return <p>Chargement du PDF...</p>; // Afficher un message pendant le chargement
  }

  return (
    <iframe
      src={blobUrl}
      width="100%"
      height="600px"
      frameBorder="0"
      title="PDF Viewer"
      style={{ border: 'none' }}
    ></iframe>
  );
};

const ResourceDetails = ({ resource , isFromLink, token}) => {
  const [show, setShow] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cachedImages, setCachedImages] = useState([]);
  const [cachedVideo, setCachedVideo] = useState(null);
  const [cachedAudio, setCachedAudio] = useState(null);
  const [cachedPDF, setCachedPDF] = useState(null);
    const [isLocalUpdate, setIsLocalUpdate] = useState(false);

  const [blobObject, setBlobObject] = useState({
    images: [],
    video: "",
    audio: "",
    pdf: "",
  });

  const handleShow = (index) => {
    setCurrentImageIndex(index);
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const handleSaveResource = () => {
    console.log("Resource saved!");
    // Implémenter la fonctionnalité de sauvegarde ici
  };

  const fetchMediaFromCache = async (url) => {
    console.log("-----------------------------------------------")
    console.log('URL demandée :', url);
    console.log("-----------------------------------------------")    
    if (!url) return null;


    try {
      const cache = await caches.open('resource-files');
      const response = await cache.match(url);

      console.log('URL demandée :', url);
      console.log('Réponse du cache :', response);

      if (response) {
        const blobUrl = URL.createObjectURL(await response.blob());
        console.log('Blob URL créée :', blobUrl);
        return blobUrl;
      }
    } catch (error) {
      console.error(`Failed to fetch media from cache for URL: ${url}`, error);
    }
    return null;
  };

  useEffect(() => {
    const cacheResources = async () => {
      if (resource.isLocalUpload) {
        setIsLocalUpdate(true);
        setBlobObject({
          images: resource.images || [],
          video: resource.video || "",
          audio: resource.audio || "",
          pdf: resource.pdf || "",
        });
      } else if (navigator.onLine) {
        if (resource.images && Array.isArray(resource.images)) {
          const onlineImageUrls = await Promise.all(
            resource.images.map(async (image) => {
              const imageUrl = `http://localhost:1337${image.url}`;
              return { url: imageUrl };
            })
          );
          setCachedImages(onlineImageUrls);
        }

        if (resource.video) {
          const videoUrl = `http://localhost:1337${resource.video.url}`;
          setCachedVideo({ url: videoUrl });
        }

        if (resource.audio) {
          const audioUrl = `http://localhost:1337${resource.audio.url}`;
          setCachedAudio({ url: audioUrl });
        }

        if (resource.pdf) {
          const pdfUrl = `http://localhost:1337${resource.pdf.url}`;
          setCachedPDF({ url: pdfUrl });
        }
      } else {
        if (resource.images && Array.isArray(resource.images)) {
          const offlineImageUrls = await Promise.all(
            resource.images.map(async (image) => {
              
              const imageUrl = navigator.onLine ? `http://localhost:1337${image?.url}` : (image?.url || image);
              const cachedUrl = await fetchMediaFromCache(imageUrl);
              return { url: cachedUrl || image.url };
            })
          );
          setCachedImages(offlineImageUrls);
        }

        if (resource.video) {
          console.log("resource.video")
          console.log(resource.video)
      const videoUrl = navigator.onLine ? `http://localhost:1337${resource.video?.url}` :  (resource?.video.url || resource.video);
                console.log("----------------------------------------")
      console.log("videoUrl")
          console.log(videoUrl)
                          console.log("----------------------------------------")

      const cachedUrl = await fetchMediaFromCache(videoUrl);
          setCachedVideo({ url: cachedUrl || resource.video.url });
        }

        if (resource.audio) {
         const audiodUrl = navigator.onLine ? `http://localhost:1337${resource.audio?.url}` :  (resource?.audio.url|| resource?.audio) ;
          const cachedUrl = await fetchMediaFromCache(audiodUrl);
          setCachedAudio({ url: cachedUrl || resource.audio.url });
        }

        if (resource.pdf) {
                                       console.log("resource.pdf")

                             console.log(resource.pdf)

                   const pdf = navigator.onLine ? `http://localhost:1337${resource.pdf?.url}` :  (resource.pdf.url|| resource?.pdf);
               

          const cachedUrl = await fetchMediaFromCache(pdf);
          setCachedPDF({ url: cachedUrl || resource.pdf.url });
        }
      }
    };

    cacheResources();
  }, [resource]);

  const renderMedia = (media) => {
    if (!media || !media.url) return null;
    return <Image src={media.url} alt="Resource" className="img-fluid" />;
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
    
    if(navigator.onLine) { return (     
       <PdfViewer pdfUrl={pdf.url} />
)}else{

  return (
        <div className="mt-4">
          <h3>PDF</h3>
          <iframe
      src={pdf.url}
      width="100%"
      height="600px"
      frameBorder="0"
      title="PDF Viewer"
      style={{ border: 'none' }}
    ></iframe>
    </div>
      );

}
   
  // return (
  //   <iframe 
  //     src={`http://localhost:1337${pdf.url}`} 
  //     width="100%" 
  //     height="500px"
  //     frameBorder="0"

  //   >
  //   </iframe>
  // );
//  return( <div style={{ width: '100%', height: '500px' }}>
//       <iframe
//         src={`http://localhost:1337${pdf.url}`}
//         width="100%"
//         height="100%"
//         style={{ border: 'none' }}
//         title="PDF Viewer"
//       />
//     </div>)
    // return (<embed src={`http://localhost:1337${pdf.url}`} width="100%" height="500px" type="application/pdf" />);
  };

  const renderBlobImages = () => {
    if (blobObject.images.length > 0) {
      return blobObject.images.map((image, index) => (
        <Col md={4} key={index}>
          <Zoom>
            <Image src={image} alt={`Image ${index + 1}`} className="img-fluid" />
          </Zoom>
          {/* <Button variant="link" onClick={() => handleShow(index)}>Voir en plein écran</Button> */}
        </Col>
      ));
    }
    return null;
  };

  const renderBlobVideo = () => {
    if (blobObject.video) {
      return (
        <div className="mt-4">
          <h3>Vidéo</h3>
          <video controls width="100%">
            <source src={blobObject.video} type="video/mp4" />
            Votre navigateur ne supporte pas la balise vidéo.
          </video>
        </div>
      );
    }
    return null;
  };

  const renderBlobAudio = () => {
    if (blobObject.audio) {
      return (
        <div className="mt-4">
          <h3>Audio</h3>
          <audio controls className="w-100">
            <source src={blobObject.audio} type="audio/mpeg" />
            Votre navigateur ne supporte pas l'élément audio.
          </audio>
        </div>
      );
    }
    return null;
  };

  const renderBlobPDF = () => {
        console.log("Blob PDF Object:", blobObject.pdf);

    console.log("------------blobObject.pdf-- offligneee ---------------------------------");
    console.log(blobObject.pdf);
        console.log("------------blobObject-- offligneee ---------------------------------")
        console.log(blobObject);
    console.log("------------------------------------------------------");

    if (blobObject.pdf) {
      console.log(blobObject.pdf);
      
      return (
        <div className="mt-4">
          <h3>PDF</h3>
 <iframe
      src={blobObject.pdf}
      width="100%"
      height="600px"
      frameBorder="0"
      title="PDF Viewer"
      style={{ border: 'none' }}
    ></iframe>          
          <PdfViewer  pdfUrl={blobObject.pdf}/>
        </div>
      );
    }
    return null;
  };

   return (
    <>
         <TitleContainer>
        <Title>{resource.nom}</Title>
       
        {isFromLink && (
 <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip">Save Resource</Tooltip>}>
          <SaveButton onClick={handleSaveResource}>
            <FaSave />
          </SaveButton>
        </OverlayTrigger>           
          )}
          {!isFromLink && <GenerateLinkButton resourceId={resource.id} />}
      </TitleContainer>
   
    <StyledCard className="mt-4">
     
      <Card.Body>
        <Row>
          <Col md={6}>
                     <InfoCard>
      <InfoContent>
        <strong>Format:</strong> {resource.format}
      </InfoContent>
      <InfoTitle>Note:</InfoTitle>
      <InfoContent dangerouslySetInnerHTML={{ __html: resource.note }} />
    </InfoCard>
          </Col>

          <Col md={6}>
            {isLocalUpdate ? renderBlobVideo() : renderVideo(cachedVideo)}
            {isLocalUpdate ? renderBlobAudio() : renderAudio(cachedAudio)}
            {isLocalUpdate ? renderBlobPDF() : renderPDF(cachedPDF)}
             {resource.referenceLivre && (
                <InfoCard>
                  <InfoTitle>Référence du Livre:</InfoTitle>
                  <InfoContent>{resource.referenceLivre}</InfoContent>
                </InfoCard>
              )}

              {resource.link && (
                <InfoCard>

                      <InfoTitle>Lien :</InfoTitle>

    <a
      href={resource.link}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: "#007bff", textDecoration: "underline", cursor: "pointer" }}
    >
      {resource.link}
    </a>
   </InfoCard>
)}

{
  isLocalUpdate ? (
    <div className="mt-4">
      <SectionTitle>Images</SectionTitle>
      <Row className="d-flex justify-content-center">
        {renderBlobImages()}
      </Row>
    </div>
  ) : cachedImages && cachedImages.length > 0 ? (
    <div className="mt-4">
      <SectionTitle>Images</SectionTitle>
      <Row className="d-flex justify-content-center">
        {cachedImages.map((image, index) => (
          <Col key={index}>
            <Zoom>
              {renderMedia(image)}
            </Zoom>
          </Col>
        ))}
      </Row>
    </div>
  ) : null
}


  
          </Col>
        </Row>
        <Row className="mt-4">
          <Col md={6}>
            <SectionTitle>Parcours</SectionTitle>
            {resource.parcours && resource.parcours.map((parcours) => (
              <InnerCard key={parcours.id} className="mb-2">
                <InnerCardBody>
                  <p><strong>Nom du parcours:</strong> {parcours.nom}</p>
                </InnerCardBody>
              </InnerCard>
            ))}
          </Col>
          <Col md={6}>
            <SectionTitle>Modules</SectionTitle>
            {resource.modules && resource.modules.map((module) => (
              <InnerCard key={module.id} className="mb-2">
                <InnerCardBody>
                  <p><strong>Nom du module:</strong> {module.nom}</p>
                </InnerCardBody>
              </InnerCard>
            ))}
          </Col>
        </Row>
        <Row className="mt-4">
          <Col md={6}>
            <SectionTitle>Leçons</SectionTitle>
            {resource.lessons && resource.lessons.map((lesson) => (
              <InnerCard key={lesson.id} className="mb-2">
                <InnerCardBody>
                  <p><strong>Nom de la leçon: </strong>{lesson.nom}</p>
                </InnerCardBody>
              </InnerCard>
            ))}
          </Col>
          
        </Row>
      </Card.Body>
    </StyledCard>
     </>
  );
};

export default ResourceDetails;

