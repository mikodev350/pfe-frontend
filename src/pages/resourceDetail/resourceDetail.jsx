import React, { useState, useEffect } from "react";
import { Card, Col, Row, Button, Modal, Carousel, OverlayTrigger, Tooltip } from "react-bootstrap";
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import styled from 'styled-components';
import { FaSave } from "react-icons/fa";
import AudioPlayer from "../../components/audioPlayer/AudioPlayer";

const API_BASE_URL = "http://localhost:1337";

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



  console.log("--------------------------------------------------------------------------")
        console.log("resource")
        console.log(resource)
        console.log("--------------------------------------------------------------------------")
 


  const handleShow = (index) => {
    setCurrentImageIndex(index);
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const handleSaveResource = () => {
    console.log("Resource saved!");
    // Implement the save resource functionality here
  };

  const removeBaseUrl = (url) => {
    const baseUrl = "http://localhost:1337";
    return url.startsWith(baseUrl) ? url.replace(baseUrl, '') : url;
  };

  const fetchMediaFromCache = async (url) => {
    if (!url) return null;

    try {
            console.log("this is Url ");
      console.log(url);
      const cache = await caches.open('resource-files');
          // const cacheKey = removeBaseUrl(url);


      const response = await cache.match(url);
      console.log("response");
      console.log(response);

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
      if (resource && resource.images && Array.isArray(resource.images)) {
        const cachedImageUrls = await Promise.all(
          resource.images.map(async (image) => {

                    const imageUrl = navigator.onLine ? image.url : image;
            if (imageUrl) {
              const cachedUrl = await fetchMediaFromCache(imageUrl) || imageUrl;
              return { url: cachedUrl };
            }
            return { url: null };
          })
        );
        console.log("Final cachedImageUrls:", cachedImageUrls);
        setCachedImages(cachedImageUrls);
      }

      if (resource && resource.video || resource.video.url) {
        
      const videoUrl = navigator.onLine ? resource.video.url : resource.video;

        if (videoUrl) {
          const cachedUrl = await fetchMediaFromCache(videoUrl) || videoUrl;
          setCachedVideo({ url: cachedUrl });
        }
      }

      if (resource && resource.audio) {
        const audioUrl = navigator.onLine ? resource.audio.url : resource.audio;
        if (audioUrl) {
          console.log("audioUrl");
          console.log(audioUrl);
          const cachedUrl = await fetchMediaFromCache(audioUrl) || audioUrl;
          setCachedAudio({ url: cachedUrl });
        }
      }

      if (resource && resource.pdf || resource.pdf.url) {
                const pdfUrl = navigator.onLine ? resource.pdf.url : resource.pdf;
        if (pdfUrl) {
          const cachedUrl = await fetchMediaFromCache(pdfUrl) || pdfUrl;
          setCachedPDF({ url: cachedUrl });
        }
      }
    };

    cacheResources();
  }, [resource]);

  const renderMedia = (media) => {
    console.log("Rendering media:", media);
    if (!media || !media.url) return null;

    return (
      <Image
        src={media.url}
        alt={media.name || "Resource Image"}
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

  // const renderAudio = (audio) => {
  //   if (!audio || !audio.url) return null;


  //   console.log(audio.url)
  //   console.log("Rendering audio with src:", audio.url);

  //   console.log(audio);
  //   return (

  //     <audio controls className="w-100">
  //       <source src={audio} type='audio/mpeg' />
  //       Your browser does not support the audio element.
  //     </audio>
  //   );
  // };



const renderAudio = (audio) => {
  if (!audio || !audio.url) return null;

  // Assurez-vous que l'URL de l'audio est correcte
  console.log("Rendering audio with URL:", audio.url);
  
  console.log(audio);
  return (
    <audio controls className="w-100">
      <source src={audio.url} type="audio/mpeg" /> {/* Remplacez par le bon type MIME */}
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


// // ResourceDetails.jsx
// import React, { useState, useEffect } from "react";
// import { Card, Col, Row, Button, Modal, Carousel, OverlayTrigger, Tooltip } from "react-bootstrap";
// import Zoom from 'react-medium-image-zoom';
// import 'react-medium-image-zoom/dist/styles.css';
// import styled from 'styled-components';
// import { FaSave } from "react-icons/fa";

// const API_BASE_URL = "http://localhost:1337";

// const StyledCard = styled(Card)`
//   background-color: #f8f9fa;
//   border: 1px solid #ddd;
//   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//   border-radius: 8px;
// `;

// const StyledHeader = styled(Card.Header)`
//   background-color: #007bff;
//   color: white;
//   border-top-left-radius: 8px;
//   border-top-right-radius: 8px;
//   padding: 20px;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   height: 66px;
// `;

// const ButtonsContainer = styled.div`
//   display: flex;
//   gap: 10px;
// `;

// const SaveButton = styled(Button)`
//   background-color: transparent;
//   border: none;
//   color: white;
//   font-size: 1.5rem;
// `;

// const InnerCard = styled(Card)`
//   background-color: #fff;
//   border: 1px solid #ddd;
//   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//   border-radius: 4px;
// `;

// const Image = styled.img`
//   border-radius: 4px;
// `;

// const ResourceDetails = ({ resource }) => {
//   const [show, setShow] = useState(false);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [cachedImages, setCachedImages] = useState([]);
//   const [cachedVideo, setCachedVideo] = useState(null);
//   const [cachedAudio, setCachedAudio] = useState(null);
//   const [cachedPDF, setCachedPDF] = useState(null);

//   const handleShow = (index) => {
//     setCurrentImageIndex(index);
//     setShow(true);
//   };

//   const handleClose = () => setShow(false);

//   const handleSaveResource = () => {
//     console.log("Resource saved!");
//     // Implement the save resource functionality here
//   };

//   const removeBaseUrl = (url) => {
//     const baseUrl = "http://localhost:1337";
//     return url.startsWith(baseUrl) ? url.replace(baseUrl, '') : url;
//   };

//   const fetchMediaFromCache = async (url) => {
//     if (!url) return null;

//     try {
//       const cache = await caches.open('resource-files');
//       console.log("Cache opened:", cache);
//       const response = await cache.match(removeBaseUrl(url));
//       if (response) {
//         return URL.createObjectURL(await response.blob());
//       }
//     } catch (error) {
//       console.error(`Failed to fetch media from cache for URL: ${url}`, error);
//     }
//     return null;
//   };

//   useEffect(() => {
//     const cacheResources = async () => {
//       if (resource && resource.images && Array.isArray(resource.images)) {
//         const cachedImageUrls = await Promise.all(
//           resource.images.map(async (image) => {
//             const imageUrl = image ? `${API_BASE_URL}${image}` : null;
//             console.log("Constructed imageUrl:", imageUrl);
//             if (imageUrl) {
//               const cachedUrl = await fetchMediaFromCache(imageUrl) || imageUrl;
//               return { url: cachedUrl };
//             }
//             return { url: null };
//           })
//         );
//         console.log("Final cachedImageUrls:", cachedImageUrls);
//         setCachedImages(cachedImageUrls);
//       }

//       if (resource && resource.video && resource.video.url) {
//         const videoUrl = resource.video.url ? `${API_BASE_URL}${resource.video.url}` : null;
//         if (videoUrl) {
//           const cachedUrl = await fetchMediaFromCache(videoUrl) || videoUrl;
//           setCachedVideo({ url: cachedUrl });
//         }
//       }

//       if (resource && resource.audio && resource.audio.url) {
//         const audioUrl = resource.audio.url ? `${API_BASE_URL}${resource.audio.url}` : null;
//         if (audioUrl) {
//           const cachedUrl = await fetchMediaFromCache(audioUrl) || audioUrl;
//           setCachedAudio({ url: cachedUrl });
//         }
//       }

//       if (resource && resource.pdf && resource.pdf.url) {
//         const pdfUrl = resource.pdf.url ? `${API_BASE_URL}${resource.pdf.url}` : null;
//         if (pdfUrl) {
//           const cachedUrl = await fetchMediaFromCache(pdfUrl) || pdfUrl;
//           setCachedPDF({ url: cachedUrl });
//         }
//       }
//     };

//     cacheResources();
//   }, [resource]);

//   const renderMedia = (media) => {
//     console.log("Rendering media:", media);
//     if (!media || !media.url) return null;

//     return (
//       <Image
//         src={media.url}
//         alt={media.name || "Resource Image"}
//         className="img-fluid"
//         style={{ cursor: 'pointer' }}
//       />
//     );
//   };

//   const renderVideo = (video) => {
//     if (!video || !video.url) return null;

//     return (
//       <video controls width="100%">
//         <source src={video.url} type="video/mp4" />
//         Your browser does not support the video tag.
//       </video>
//     );
//   };

//   const renderAudio = (audio) => {
//     if (!audio || !audio.url) return null;

//     return (
//       <audio controls className="w-100">
//         <source src={audio.url} type="audio/mp3" />
//         Your browser does not support the audio element.
//       </audio>
//     );
//   };

//   const renderPDF = (pdf) => {
//     if (!pdf || !pdf.url) return null;

//     return (
//       <embed
//         src={pdf.url}
//         width="100%"
//         height="500px"
//         type="application/pdf"
//       />
//     );
//   };

//   return (
//     <StyledCard className="mt-4">
//       <StyledHeader>
//         <h2>{resource.nom}</h2>
//         <ButtonsContainer>
//           <OverlayTrigger
//             placement="top"
//             overlay={<Tooltip id="button-tooltip">Save Resource</Tooltip>}
//           >
//             <SaveButton onClick={handleSaveResource}>
//               <FaSave />
//             </SaveButton>
//           </OverlayTrigger>
//         </ButtonsContainer>
//       </StyledHeader>
//       <Card.Body>
//         <Row>
//           <Col md={6}>
//             <p><strong>Format:</strong> {resource.format}</p>
//             <p><strong>Note:</strong></p>
//             <div dangerouslySetInnerHTML={{ __html: resource.note }} />
//           </Col>
//           {cachedVideo && (
//             <Col md={6}>
//               <h3>Vidéo</h3>
//               {renderVideo(cachedVideo)}
//             </Col>
//           )}
//         </Row>
//         <Row className="mt-4">
//           <Col md={6}>
//             <h3>Parcours</h3>
//             {resource.parcours && resource.parcours.map((parcours) => (
//               <InnerCard key={parcours.id} className="mb-2">
//                 <Card.Body>
//                   <p>Nom du parcours: {parcours.nom}</p>
//                 </Card.Body>
//               </InnerCard>
//             ))}
//           </Col>
//           <Col md={6}>
//             <h3>Modules</h3>
//             {resource.modules && resource.modules.map((module) => (
//               <InnerCard key={module.id} className="mb-2">
//                 <Card.Body>
//                   <p>Nom du module: {module.nom}</p>
//                 </Card.Body>
//               </InnerCard>
//             ))}
//           </Col>
//         </Row>
//         <Row className="mt-4">
//           <Col md={6}>
//             <h3>Leçons</h3>
//             {resource.lessons && resource.lessons.map((lesson) => (
//               <InnerCard key={lesson.id} className="mb-2">
//                 <Card.Body>
//                   <p>Nom de la leçon: {lesson.nom}</p>
//                 </Card.Body>
//               </InnerCard>
//             ))}
//           </Col>
//           <Col md={6}>
//             {cachedAudio && (
//               <div>
//                 <h3>Audio</h3>
//                 {renderAudio(cachedAudio)}
//               </div>
//             )}
//             {cachedPDF && (
//               <div className="mt-4">
//                 <h3>PDF</h3>
//                 {renderPDF(cachedPDF)}
//               </div>
//             )}
//             {cachedImages && cachedImages.length > 0 && (
//               <div className="mt-4">
//                 <h3>Images</h3>
//                 <Row>
//                   {cachedImages.map((image, index) => (
//                     <Col md={4} key={index}>
//                       <Zoom>
//                         {renderMedia(image)}
//                       </Zoom>
//                       <Button variant="link" onClick={() => handleShow(index)}>
//                         Voir en plein écran
//                       </Button>
//                     </Col>
//                   ))}
//                 </Row>
//                 <Modal show={show} onHide={handleClose} size="lg" centered>
//                   <Modal.Header closeButton>
//                     <Modal.Title>Images</Modal.Title>
//                   </Modal.Header>
//                   <Modal.Body>
//                     <Carousel activeIndex={currentImageIndex} onSelect={(selectedIndex) => setCurrentImageIndex(selectedIndex)}>
//                       {cachedImages.map((image, index) => (
//                         <Carousel.Item key={index}>
//                           <img
//                             className="d-block w-100"
//                             src={image.url}
//                             alt={`Image ${index + 1}`}
//                           />
//                         </Carousel.Item>
//                       ))}
//                     </Carousel>
//                   </Modal.Body>
//                 </Modal>
//               </div>
//             )}
//             {resource.link && (
//               <div className="mt-4">
//                 <h3>Lien</h3>
//                 <a href={resource.link} target="_blank" rel="noopener noreferrer">{resource.link}</a>
//               </div>
//             )}
//           </Col>
//         </Row>
//       </Card.Body>
//     </StyledCard>
//   );
// };

// export default ResourceDetails;



// // // ResourceDetails.jsx
// import React, { useState, useEffect } from "react";
// import { Card, Col, Row, Button, Modal, Carousel, OverlayTrigger, Tooltip } from "react-bootstrap";
// import Zoom from 'react-medium-image-zoom';
// import 'react-medium-image-zoom/dist/styles.css';
// import styled from 'styled-components';
// import { FaSave } from "react-icons/fa";

// const API_BASE_URL = "http://localhost:1337";

// const StyledCard = styled(Card)`
//   background-color: #f8f9fa;
//   border: 1px solid #ddd;
//   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//   border-radius: 8px;
// `;

// const StyledHeader = styled(Card.Header)`
//   background-color: #007bff;
//   color: white;
//   border-top-left-radius: 8px;
//   border-top-right-radius: 8px;
//   padding: 20px;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   height: 66px;
// `;

// const ButtonsContainer = styled.div`
//   display: flex;
//   gap: 10px;
// `;

// const SaveButton = styled(Button)`
//   background-color: transparent;
//   border: none;
//   color: white;
//   font-size: 1.5rem;
// `;

// const InnerCard = styled(Card)`
//   background-color: #fff;
//   border: 1px solid #ddd;
//   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//   border-radius: 4px;
// `;

// const Image = styled.img`
//   border-radius: 4px;
// `;

// const ResourceDetails = ({ resource }) => {
//   const [show, setShow] = useState(false);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [cachedImages, setCachedImages] = useState([]);

//   const handleShow = (index) => {
//     setCurrentImageIndex(index);
//     setShow(true);
//   };

//   const handleClose = () => setShow(false);

//   const handleSaveResource = () => {
//     console.log("Resource saved!");
//     // Implement the save resource functionality here
//   };

//   const removeBaseUrl = (url) => {
//     const baseUrl = "http://localhost:1337";
//     return url.startsWith(baseUrl) ? url.replace(baseUrl, '') : url;
//   };

//   const fetchImageFromCache = async (url) => {
//     if (!url) return null;

//     try {
//       const cache = await caches.open('resource-files');
//       console.log("Cache opened:", cache);
//       const response = await cache.match(removeBaseUrl(url));
//       if (response) {
//         return URL.createObjectURL(await response.blob());
//       }
//     } catch (error) {
//       console.error(`Failed to fetch image from cache for URL: ${url}`, error);
//     }
//     return null;
//   };

//   useEffect(() => {
//     const cacheImages = async () => {
//       if (resource && resource.images && Array.isArray(resource.images)) {
//         const cachedImageUrls = await Promise.all(
//           resource.images.map(async (image) => {
//             const imageUrl = image ? `${API_BASE_URL}${image}` : null;
//             console.log("Constructed imageUrl:", imageUrl);
//             if (imageUrl) {
//               const cachedUrl = await fetchImageFromCache(imageUrl) || imageUrl;
//               return { url: cachedUrl };
//             }
//             return { url: null };
//           })
//         );
//         console.log("Final cachedImageUrls:", cachedImageUrls);
//         setCachedImages(cachedImageUrls);
//       }
//     };

//     cacheImages();
//   }, [resource]);

//   const renderMedia = (media) => {
//     console.log("Rendering media:", media);
//     if (!media || !media.url) return null;

//     return (
//       <Image
//         src={media.url}
//         alt={media.name || "Resource Image"}
//         className="img-fluid"
//         style={{ cursor: 'pointer' }}
//       />
//     );
//   };

//   const renderVideo = (video) => {
//     if (!video || !video.url) return null;

//     let src;
//     if (video.url.startsWith("blob:")) {
//       src = video.url;
//     } else if (video.url.startsWith("http://") || video.url.startsWith("https://")) {
//       src = video.url;
//     } else {
//       src = `${API_BASE_URL}${video.url}`;
//     }

//     return (
//       <video controls width="100%">
//         <source src={src} type={video.mime} />
//         Your browser does not support the video tag.
//       </video>
//     );
//   };

//   const renderAudio = (audio) => {
//     if (!audio || !audio.url) return null;

//     let src;
//     if (audio.url.startsWith("blob:")) {
//       src = audio.url;
//     } else if (audio.url.startsWith("http://") || audio.url.startsWith("https://")) {
//       src = audio.url;
//     } else {
//       src = `${API_BASE_URL}${audio.url}`;
//     }

//     return (
//       <audio controls className="w-100">
//         <source src={src} type={audio.type} />
//         Your browser does not support the audio element.
//       </audio>
//     );
//   };

//   const renderPDF = (pdf) => {
//     if (!pdf || !pdf.url) return null;

//     let src;
//     if (pdf.url.startsWith("blob:")) {
//       src = pdf.url;
//     } else if (pdf.url.startsWith("http://") || pdf.url.startsWith("https://")) {
//       src = pdf.url;
//     } else {
//       src = `${API_BASE_URL}${pdf.url}`;
//     }

//     return (
//       <embed
//         src={src}
//         width="100%"
//         height="500px"
//         type="application/pdf"
//       />
//     );
//   };

//   return (
//     <StyledCard className="mt-4">
//       <StyledHeader>
//         <h2>{resource.nom}</h2>
//         <ButtonsContainer>
//           <OverlayTrigger
//             placement="top"
//             overlay={<Tooltip id="button-tooltip">Save Resource</Tooltip>}
//           >
//             <SaveButton onClick={handleSaveResource}>
//               <FaSave />
//             </SaveButton>
//           </OverlayTrigger>
//         </ButtonsContainer>
//       </StyledHeader>
//       <Card.Body>
//         <Row>
//           <Col md={6}>
//             <p><strong>Format:</strong> {resource.format}</p>
//             <p><strong>Note:</strong></p>
//             <div dangerouslySetInnerHTML={{ __html: resource.note }} />
//           </Col>
//           {resource.video && (
//             <Col md={6}>
//               <h3>Vidéo</h3>
//               {renderVideo(resource.video)}
//             </Col>
//           )}
//         </Row>
//         <Row className="mt-4">
//           <Col md={6}>
//             <h3>Parcours</h3>
//             {resource.parcours && resource.parcours.map((parcours) => (
//               <InnerCard key={parcours.id} className="mb-2">
//                 <Card.Body>
//                   <p>Nom du parcours: {parcours.nom}</p>
//                 </Card.Body>
//               </InnerCard>
//             ))}
//           </Col>
//           <Col md={6}>
//             <h3>Modules</h3>
//             {resource.modules && resource.modules.map((module) => (
//               <InnerCard key={module.id} className="mb-2">
//                 <Card.Body>
//                   <p>Nom du module: {module.nom}</p>
//                 </Card.Body>
//               </InnerCard>
//             ))}
//           </Col>
//         </Row>
//         <Row className="mt-4">
//           <Col md={6}>
//             <h3>Leçons</h3>
//             {resource.lessons && resource.lessons.map((lesson) => (
//               <InnerCard key={lesson.id} className="mb-2">
//                 <Card.Body>
//                   <p>Nom de la leçon: {lesson.nom}</p>
//                 </Card.Body>
//               </InnerCard>
//             ))}
//           </Col>
//           <Col md={6}>
//             {resource.audio && (
//               <div>
//                 <h3>Audio</h3>
//                 {renderAudio(resource.audio)}
//               </div>
//             )}
//             {resource.pdf && (
//               <div className="mt-4">
//                 <h3>PDF</h3>
//                 {renderPDF(resource.pdf)}
//               </div>
//             )}
//             {cachedImages && cachedImages.length > 0 && (
//               <div className="mt-4">
//                 <h3>Images</h3>
//                 <Row>
//                   {cachedImages.map((image, index) => (
//                     <Col md={4} key={index}>
//                       <Zoom>
//                         {renderMedia(image)}
//                       </Zoom>
//                       <Button variant="link" onClick={() => handleShow(index)}>
//                         Voir en plein écran
//                       </Button>
//                     </Col>
//                   ))}
//                 </Row>
//                 <Modal show={show} onHide={handleClose} size="lg" centered>
//                   <Modal.Header closeButton>
//                     <Modal.Title>Images</Modal.Title>
//                   </Modal.Header>
//                   <Modal.Body>
//                     <Carousel activeIndex={currentImageIndex} onSelect={(selectedIndex) => setCurrentImageIndex(selectedIndex)}>
//                       {cachedImages.map((image, index) => (
//                         <Carousel.Item key={index}>
//                           <img
//                             className="d-block w-100"
//                             src={image.url}
//                             alt={`Image ${index + 1}`}
//                           />
//                         </Carousel.Item>
//                       ))}
//                     </Carousel>
//                   </Modal.Body>
//                 </Modal>
//               </div>
//             )}
//             {resource.link && (
//               <div className="mt-4">
//                 <h3>Lien</h3>
//                 <a href={resource.link} target="_blank" rel="noopener noreferrer">{resource.link}</a>
//               </div>
//             )}
//           </Col>
//         </Row>
//       </Card.Body>
//     </StyledCard>
//   );
// };

// export default ResourceDetails;
