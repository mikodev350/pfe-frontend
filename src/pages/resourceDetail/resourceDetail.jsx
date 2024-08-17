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
          const pdfUrl = resource.pdf.url;
          setCachedPDF({ url: pdfUrl });
        }
      } else {
        if (resource.images && Array.isArray(resource.images)) {
          const offlineImageUrls = await Promise.all(
            resource.images.map(async (image) => {
               const imageUrl = navigator.onLine ? `http://localhost:1337${image?.url}` : image.url;

              const cachedUrl = await fetchMediaFromCache(imageUrl);
              return { url: cachedUrl || image.url };
            })
          );
          setCachedImages(offlineImageUrls);
        }

        if (resource.video) {
      const videoUrl = navigator.onLine ? `http://localhost:1337${resource.video?.url}` : resource.video.url;
          const cachedUrl = await fetchMediaFromCache(videoUrl);
          setCachedVideo({ url: cachedUrl || resource.video.url });
        }

        if (resource.audio) {
         const audiodUrl = navigator.onLine ? `http://localhost:1337${resource.audio?.url}` : resource.audio.url;
          const cachedUrl = await fetchMediaFromCache(audiodUrl);
          setCachedAudio({ url: cachedUrl || resource.audio.url });
        }

        if (resource.pdf) {
                   const pdf = navigator.onLine ? `http://localhost:1337${resource.pdf?.url}` : resource.pdf.url;

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
    return <embed src={pdf.url} width="100%" height="500px" type="application/pdf" />;
  };

  const renderBlobImages = () => {
    if (blobObject.images.length > 0) {
      return blobObject.images.map((image, index) => (
        <Col md={4} key={index}>
          <Zoom>
            <Image src={image} alt={`Image ${index + 1}`} className="img-fluid" />
          </Zoom>
          <Button variant="link" onClick={() => handleShow(index)}>Voir en plein écran</Button>
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
    if (blobObject.pdf) {
      return (
        <div className="mt-4">
          <h3>PDF</h3>
          <embed src={blobObject.pdf} width="100%" height="500px" type="application/pdf" />
        </div>
      );
    }
    return null;
  };

  return (
    <StyledCard className="mt-4">
      <StyledHeader>
        <h2>{resource.nom}</h2>
        <ButtonsContainer>
          <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip">Save Resource</Tooltip>}>
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
          <Col md={6}>
              {(navigator.onLine && !isLocalUpdate)|| (!navigator.onLine && !isLocalUpdate) ? renderVideo(cachedVideo) :(!navigator.onLine && isLocalUpdate)? renderBlobVideo():null}

          </Col>
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
            {(navigator.onLine && !isLocalUpdate)|| (!navigator.onLine && !isLocalUpdate) ? renderAudio(cachedAudio) :(!navigator.onLine && isLocalUpdate)? renderBlobAudio():null}
            {(navigator.onLine && !isLocalUpdate)|| (!navigator.onLine && !isLocalUpdate) ? renderPDF(cachedPDF) :(!navigator.onLine && isLocalUpdate)? renderBlobPDF():null}
            {(navigator.onLine && !isLocalUpdate)|| (!navigator.onLine && !isLocalUpdate)? (
              <div className="mt-4">
                <h3>Images</h3>
                <Row>{cachedImages.map((image, index) => (
                  <Col md={4} key={index}>
                    <Zoom>
                      {renderMedia(image)}
                    </Zoom>
                    <Button variant="link" onClick={() => handleShow(index)}>
                      Voir en plein écran
                    </Button>
                  </Col>
                ))}</Row>
              </div>
            ) :(!navigator.onLine && isLocalUpdate)? renderBlobImages():(null)}
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






// import React, { useState, useEffect } from "react";
// import { Card, Col, Row, Button, Modal, Carousel, OverlayTrigger, Tooltip } from "react-bootstrap";
// import Zoom from 'react-medium-image-zoom';
// import 'react-medium-image-zoom/dist/styles.css';
// import styled from 'styled-components';
// import { FaSave } from "react-icons/fa";


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
//   const [blobOblect, setBlobOblect] = useState({
//     images:[],
//     video:"",
//     audio:"",
//     pdf:"",
//   });





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
//             console.log("this is Url ");
//       console.log(url);
//       const cache = await caches.open('resource-files');
//           // const cacheKey = removeBaseUrl(url);


//       const response = await cache.match(url);
      
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
//         if (resource.isLocalUpload) {
 
//             if (resource.images && !navigator.onLine) {
//           for (let  image of resource.images) {
//                   blobOblect.images.push(image)}

//             }else if(resource.audio ){
//               setBlobOblect({audio:resource.audio})
//             }
//             else if(resource.video ){
//                             setBlobOblect({video:resource.video})
//             }
//             else if(resource.video ){
//                             setBlobOblect({video:resource.video})
//             }
//               else if(resource.pdf ){
//                             setBlobOblect({pdf:resource.pdf})
//             }
            
//       if (resource && resource.images && Array.isArray(resource.images)) {


//         const cachedImageUrls = await Promise.all(
//           resource.images.map(async (image) => {

//                     const imageUrl = navigator.onLine ? `http://localhost:1337${image?.url}` : image;
//                     console.log("this is image urll");
//             if (imageUrl && !navigator.onLine) {
//               const cachedUrl = await fetchMediaFromCache(imageUrl) ;
//               return { url: cachedUrl };
//             }else if (imageUrl && navigator.onLine){
//                             return { url: imageUrl };
//             }
//             return { url: null };
//           })
//         );

//         setCachedImages(cachedImageUrls);
//       }

//       if ((resource && resource.video) || resource.video?.url) {
        
//       const videoUrl = navigator.onLine ? `http://localhost:1337${resource.video?.url}` : resource.video;
      

//         if (videoUrl && !navigator.onLine) {
//           const cachedUrl = await fetchMediaFromCache(videoUrl) || videoUrl;
//           setCachedVideo({ url: cachedUrl });
//         }else if (videoUrl && navigator.onLine){
//           setCachedVideo({ url: videoUrl });
//             }
//       }

//       if (resource && resource.audio) {
//         const audioUrl = navigator.onLine ? `http://localhost:1337${resource.audio?.url}` : resource.audio;
//         if (audioUrl  && !navigator.onLine ) {
//           const cachedUrl = await fetchMediaFromCache(audioUrl) || audioUrl;
//           setCachedAudio({ url: cachedUrl });
//         }
//         else if (audioUrl && navigator.onLine){
//           setCachedAudio({ url: audioUrl });
//              }
//       }


//       // /thiiss forr tomorrooozzzz/ 
//       if ((resource && resource.pdf) || resource.pdf?.url) {
//                 const pdfUrl = navigator.onLine ? resource.pdf?.url : resource.pdf;
//         if (pdfUrl) {
//           const cachedUrl = await fetchMediaFromCache(pdfUrl) || pdfUrl;
//           setCachedPDF({ url: cachedUrl });
//         }
//       }
//       }else{

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

  










// const renderAudio = (audio) => {
//   if (!audio || !audio.url) return null;

//   // Assurez-vous que l'URL de l'audio est correcte
//   console.log("Rendering audio with URL:", audio.url);
  
//   console.log(audio);
//   return (
//     <audio controls className="w-100">
//       <source src={audio.url} type="audio/mpeg" /> {/* Remplacez par le bon type MIME */}
//       Your browser does not support the audio element.
//     </audio>
//   );
// };




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






// /******************************************************************************************************************************/
//   // Fonction pour afficher les images à partir de blobOblect
//     const renderBlobImages = () => {
//     if (blobOblect.images.length > 0) {
//       return (
//         <div className="mt-4">
//           <h3>Images</h3>
//           <Row>
//             {blobOblect.images.map((image, index) => (
//               <Col md={4} key={index}>
//                 <Image src={image} alt={`Image ${index + 1}`} />
//               </Col>
//             ))}
//           </Row>
//         </div>
//       );
//     }
//     return null;
//   };

//   // Fonction pour afficher la vidéo à partir de blobOblect
//   const renderBlobVideo = () => {
//     if (blobOblect.video) {
//       return (
//         <div className="mt-4">
//           <h3>Vidéo</h3>
//           <video controls width="100%">
//             <source src={blobOblect.video} type="video/mp4" />
//             Votre navigateur ne supporte pas la balise vidéo.
//           </video>
//         </div>
//       );
//     }
//     return null;
//   };

//   // Fonction pour afficher l'audio à partir de blobOblect
//   const renderBlobAudio = () => {
//     if (blobOblect.audio) {
//       return (
//         <div className="mt-4">
//           <h3>Audio</h3>
//           <audio controls className="w-100">
//             <source src={blobOblect.audio} type="audio/mpeg" />
//             Votre navigateur ne supporte pas l'élément audio.
//           </audio>
//         </div>
//       );
//     }
//     return null;
//   };

//   // Fonction pour afficher le PDF à partir de blobOblect
//   const renderBlobPDF = () => {
//     if (blobOblect.pdf) {
//       return (
//         <div className="mt-4">
//           <h3>PDF</h3>
//           <embed
//             src={blobOblect.pdf}
//             width="100%"
//             height="500px"
//             type="application/pdf"
//           />
//         </div>
//       );
//     }
//     return null;
//   }; 
// /*****************************************************************************************************************************/ 




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

//               {blobOblect.images.length > 0 ? (
//   <div className="mt-4">
//     <h3>Images</h3>
//     {renderBlobImages()}
//     <Modal show={show} onHide={handleClose} size="lg" centered>
//       <Modal.Header closeButton>
//         <Modal.Title>Images</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Carousel activeIndex={currentImageIndex} onSelect={(selectedIndex) => setCurrentImageIndex(selectedIndex)}>
//           {blobOblect.images.map((image, index) => (
//             <Carousel.Item key={index}>
//               <img
//                 className="d-block w-100"
//                 src={image}
//                 alt={`Image ${index + 1}`}
//               />
//             </Carousel.Item>
//           ))}
//         </Carousel>
//       </Modal.Body>
//     </Modal>
//   </div>) 
//   : blobOblect.video ? (
//           renderBlobVideo()
//         ) : blobOblect.audio ? (
//           renderBlobAudio()
//         ) : blobOblect.pdf ? (
//           renderBlobPDF()
//         ) : (
//           <p>Aucun média disponible</p>
//         )}
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



//       // if (resource.isLocalUpload) {


