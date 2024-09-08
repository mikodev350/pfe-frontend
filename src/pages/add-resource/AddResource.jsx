import React, { useState, useEffect, useRef } from "react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import Select, { components } from "react-select";
import { useFormik } from "formik";
import { validationSchema } from "../../validator/addResourceValidator";
import { fetchDataAndStore, getParcoursFromLocalStorage, getModulesFromLocalStorage, getLessonsFromLocalStorage } from "../../api/apiDataSelect";
import RichTextEditor from "../../components/richTextEditor/RichTextEditor";
import AudioPlayer from "../../components/audioPlayer/AudioPlayer";
import { FiImage, FiTrash2, FiVolume2, FiFile, FiVideo, FiLink, FiBook } from "react-icons/fi";
import { getToken } from "../../util/authUtils"; 
import { saveResource, addFileInToIndexedDB } from "../../api/apiResource";
import { useQueryClient } from "react-query";
import { uploadFile } from "../../api/apiUpload";
import "react-medium-image-zoom/dist/styles.css";
import Zoom from "react-medium-image-zoom";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

import styled from "styled-components";
import Retour from "../../components/retour-arriere/Retour";




  // Styled components
const StyledContainer = styled.div`
  padding: 20px;
  background-color: #ffffff; /* White background */
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 30px;
`;


const FormTitle = styled.h2`
  color: #10266F; /* Dark blue main color */
  margin-bottom: 30px;
  font-weight: bold;
  text-align: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const LargeButton = styled(Button)`
  padding: 15px 20px !important; // Increase padding for larger click area
  font-size: 1.2rem !important;
  border-radius: 35px !important;
  margin: 0 10px !important;
  flex: 1 !important;

  @media (max-width: 768px) {
    width: 100% !important; // Full width on smaller screens
    margin: 10px 0 !important; // Vertical margin when stacked
    font-size: 1.5rem !important; // Increase font size on smaller screens
  }
`;

const LargeButtonGroup = styled.div`
  display: flex !important;
  justify-content: center !important;
  flex-wrap: wrap !important;
  margin-top: 20px !important;
  width: 100% !important;

  @media (max-width: 768px) {
    flex-direction: column !important; // Stack buttons vertically
    align-items: center !important;
  }
`;


const ImagePreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
  
  justify-content: center;
`;

const ImageCard = styled.div`
  position: relative;
  width: 150px;
  height: 100px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const DeleteButton = styled(Button)`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 0, 0, 0.8);
  border: none;
  padding: 6px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 9999;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 0, 0, 1);
  }

  svg {
    width: 16px;
    height: 16px;
    color: white;
  }
`;



const formatOptions = [
  { value: 'cours', label: 'Cours' },
  { value: 'devoir', label: 'Devoir' },
  { value: 'ressource numérique', label: 'Ressource Numérique' }
];

const CheckboxOption = (props) => (
  <components.Option {...props}>
    <input type="checkbox" checked={props.isSelected} onChange={() => null} />{" "}
    <label>{props.label}</label>
  </components.Option>
);

export default function AddResource() {
    const navigate = useNavigate(); // Use the useNavigate hook

  const [parcoursOptions, setParcoursOptions] = useState([]);
  const [moduleOptions, setModuleOptions] = useState([]);
  const [lessonOptions, setLessonOptions] = useState([]);
  const [resources, setResources] = useState([]);
  const [images, setImages] = useState([]); // Multiple images
  const [audioFile, setAudioFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfPreview, setPdfPreview] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [link, setLink] = useState("");
  const [referenceLivre, setReferenceLivre] = useState("");
  const [displayLinkInput, setDisplayLinkInput] = useState(false);
  const [displayBookInput, setDisplayBookInput] = useState(false);

  const hiddenFileInputImage = useRef(null);
  const hiddenFileInputAudio = useRef(null);
  const hiddenFileInputPdf = useRef(null);
  const hiddenFileInputVideo = useRef(null);

  const token = React.useMemo(() => getToken(), []);
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchDataAndStore(token);
        setParcoursOptions(getParcoursFromLocalStorage().map(p => ({ value: p.id, label: p.name })));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    const handleOnline = async () => {
      try {
        // await syncOfflineChangesResource(token, queryClient);
        console.log("Synced offline changes successfully.");
      } catch (error) {
        console.error("Error syncing offline changes:", error);
      }
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [token, queryClient]);

  const formik = useFormik({
    initialValues: {
      nom: "",
      format: "",
      parcours: [],
      modules: [],
      lessons: [],
      note: "",
      youtubeLink: "",
      images: [], // Change to multiple images
      audio: "",
      pdf: "",
      video: "",
      link: "",
      referenceLivre: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();

        // Upload images
        const uploadedImages = [];
        for (let image of images) {
          if (!navigator.onLine) {
            const id = await addFileInToIndexedDB(image.preview, image.raw);
            uploadedImages.push({ id, offline: true });
          } else {
            const uploadedImage = await uploadFile(image.raw, token);
            uploadedImages.push(uploadedImage[0]);
          }
        }
        values.images = uploadedImages;

        // Upload audio
        if (audioFile) {
          if (!navigator.onLine) {
            const id = await addFileInToIndexedDB(audioFile.preview,audioFile.raw);
            values.audio = { id, offline: true };
          } else {
            const uploadedAudio = await uploadFile(audioFile.raw, token);
            values.audio = uploadedAudio[0];
          }
        }

        // Upload PDF
        if (pdfFile) {
          if (!navigator.onLine) {
            const id = await addFileInToIndexedDB(pdfFile.preview,pdfFile.raw);
            values.pdf = { id, offline: true };
          } else {
            const uploadedPdf = await uploadFile(pdfFile.raw, token); 
            values.pdf = uploadedPdf[0];
          }
        }

        // Upload video
        if (videoFile) {
          if (!navigator.onLine) {
            const id = await addFileInToIndexedDB(videoFile.preview,videoFile.raw);
            values.video = { id, offline: true };
          } else {
            const uploadedVideo = await uploadFile(videoFile.raw, token);
            values.video = uploadedVideo[0];
          }
        }

        if (!navigator.onLine) {
          // Save resource offline
          await saveResource(values, token);
        } else {
          // Save resource online
          const response = await saveResource(values, token);
          if (response && response.data) {
            console.log('Resource created successfully:', response);
            setResources([...resources, response.data]);
            formik.resetForm();
            setImages([]); // Reset images
            setAudioFile(null);
            setPdfFile(null);
            setPdfPreview("");
            setVideoFile(null);
            setVideoPreview("");
            setLink("");
            setReferenceLivre("");
            setDisplayLinkInput(false);
            setDisplayBookInput(false);

               toast.success("Ressource enregistrée avec succès !");
        navigate("/dashboard/resources");
          } else {
            throw new Error("Failed to save resource");
                    toast.error("Erreur lors de l'enregistrement de la ressource.");

          }
        }
      } catch (error) {
        console.error("Error saving resource:", error);
      }
    },
  });

  const handleParcoursChange = (selectedParcours) => {
    formik.setFieldValue("parcours", selectedParcours.map(p => p.value));
    const selectedParcoursIds = selectedParcours.map(p => p.value);
    const filteredModules = getModulesFromLocalStorage().filter(m => selectedParcoursIds.includes(m.idparcour));
    setModuleOptions(filteredModules.map(m => ({ value: m.id, label: m.name })));
    setLessonOptions([]); 
  };

  const handleModulesChange = (selectedModules) => {
    formik.setFieldValue("modules", selectedModules.map(m => m.value));
    const selectedModulesIds = selectedModules.map(m => m.value);
    const filteredLessons = getLessonsFromLocalStorage().filter(l => selectedModulesIds.includes(l.idmodule));
    setLessonOptions(filteredLessons.map(l => ({ value: l.id, label: l.name })));
  };

  const handleLessonsChange = (selectedLessons) => {
    formik.setFieldValue("lessons", selectedLessons.map(l => l.value));
  };

  const handleDescriptionChange = (content) => {
    formik.setFieldValue("note", content);
  };

 const handleFileChange = (event, type) => {
  const files = Array.from(event.target.files);
  setDisplayLinkInput(false);
  setDisplayBookInput(false);
  if (files.length > 0) {
    if (type === "image") {
      const newImages = files.map(file => ({
        preview: URL.createObjectURL(file),
        raw: file
      }));
      setImages([...images, ...newImages]); // Ajoute de nouvelles images
      formik.setFieldValue("images", [...images, ...newImages].map(image => image.raw)); // Met à jour les valeurs de formik avec des images brutes
    } else {
      const file = files[0];
      const url = URL.createObjectURL(file);
      if (type === "audio") {
        setAudioFile({ preview: url, raw: file });
        formik.setFieldValue("audio", file);
      } else if (type === "pdf") {
        setPdfFile({ preview: url, raw: file });
        setPdfPreview(url);
        formik.setFieldValue("pdf", file);
      } else if (type === "video") {
        setVideoFile({ preview: url, raw: file });
        setVideoPreview(url);
        formik.setFieldValue("video", file);
      }
    }
  }
};


  const handleClick = (type) => {
    if (type === "image") {
      hiddenFileInputImage.current.click();
    } else if (type === "audio") {
      hiddenFileInputAudio.current.click();
    } else if (type === "pdf") {
      hiddenFileInputPdf.current.click();
    } else if (type === "video") {
      hiddenFileInputVideo.current.click();
    }
  };

const removeFile = (type, index) => {
  if (type === "image") {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    formik.setFieldValue("images", newImages.map(image => image.raw));
  } else if (type === "audio") {
    setAudioFile(null);
    formik.setFieldValue("audio", "");
  } else if (type === "pdf") {
    setPdfFile(null);
    setPdfPreview("");
    formik.setFieldValue("pdf", "");
  } else if (type === "video") {
    setVideoFile(null);
    setVideoPreview("");
    formik.setFieldValue("video", "");
  }
};


  const handleLinkChange = (event) => {
    const value = event.target.value;
    setLink(value);
    formik.setFieldValue("link", value);
    if (value) {
      setDisplayBookInput(false);
    }
  };

  const handleReferenceLivreChange = (event) => {
    const value = event.target.value;
    setReferenceLivre(value);
    formik.setFieldValue("referenceLivre", value);
    if (value) {
      setDisplayLinkInput(false);
    }
  };

  const handleFormatChange = (selectedOption) => {
    formik.setFieldValue('format', selectedOption.value);
  };

  return (
 <StyledContainer className="mt-4">
  <Retour />
   <ToastContainer />
      {/* <StyledCard>     */}
            <FormTitle>Ajouter une ressource</FormTitle>

          <Row className="justify-content-md-center">
        <Col md={8}>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group controlId="nom">
              <Form.Label>Nom de la ressource</Form.Label>
              <Form.Control
                type="text"
                name="nom"
                value={formik.values.nom}
                onChange={formik.handleChange}
                isInvalid={!!formik.errors.nom}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.nom}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="format">
              <Form.Label>Format</Form.Label>
              <Select
                options={formatOptions}
                value={formatOptions.find(option => option.value === formik.values.format)}
                onChange={handleFormatChange}
                classNamePrefix="select"
                placeholder="Select format"
                             styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  borderColor: state.isFocused ? '#0066cc' : '#ced4da',
                  borderRadius: '20px',
                  height: '45px', // Reduced height
                  boxShadow: 'none',
                  '&:hover': {
                    borderColor: '#0056b3',
                  },
                }),
                placeholder: (baseStyles) => ({
                  ...baseStyles,
                  color: '#6c757d',
                  fontSize: '14px', // Slightly smaller font size
                }),
                multiValue: (baseStyles) => ({
                  ...baseStyles,
                  backgroundColor: '#e9ecef',
                  borderRadius: '10px',
                }),
                menu: (baseStyles) => ({
                  ...baseStyles,
                  borderRadius: '20px',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                }),
                option: (baseStyles, state) => ({
                  ...baseStyles,
                  backgroundColor: state.isFocused ? '#f8f9fa' : 'white',
                  color: '#495057',
                  '&:active': {
                    backgroundColor: '#0066cc',
                    color: 'white',
                  },
                }),
              }}
                isInvalid={!!formik.errors.format}
              />
              {formik.errors.format && (
                <div className="text-danger">{formik.errors.format}</div>
              )}
            </Form.Group>

            <Form.Group controlId="parcours">
              <Form.Label>Parcours</Form.Label>
              <Select
                isMulti
                options={parcoursOptions}
                name="parcours"
                onChange={handleParcoursChange}
                classNamePrefix="select"
                             styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  borderColor: state.isFocused ? '#0066cc' : '#ced4da',
                  borderRadius: '20px',
                  height: '45px', // Reduced height
                  boxShadow: 'none',
                  '&:hover': {
                    borderColor: '#0056b3',
                  },
                }),
                placeholder: (baseStyles) => ({
                  ...baseStyles,
                  color: '#6c757d',
                  fontSize: '14px', // Slightly smaller font size
                }),
                multiValue: (baseStyles) => ({
                  ...baseStyles,
                  backgroundColor: '#e9ecef',
                  borderRadius: '10px',
                }),
                menu: (baseStyles) => ({
                  ...baseStyles,
                  borderRadius: '20px',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                }),
                option: (baseStyles, state) => ({
                  ...baseStyles,
                  backgroundColor: state.isFocused ? '#f8f9fa' : 'white',
                  color: '#495057',
                  '&:active': {
                    backgroundColor: '#0066cc',
                    color: 'white',
                  },
                }),
              }}
                components={{ Option: CheckboxOption }}
              />
              {formik.errors.parcours && (
                <div className="text-danger">{formik.errors.parcours}</div>
              )}
            </Form.Group>

            <Form.Group controlId="modules">
              <Form.Label>Modules</Form.Label>
              <Select
                isMulti
                options={moduleOptions}
                name="modules"
                onChange={handleModulesChange}
                classNamePrefix="select"
                             styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  borderColor: state.isFocused ? '#0066cc' : '#ced4da',
                  borderRadius: '20px',
                  height: '45px', // Reduced height
                  boxShadow: 'none',
                  '&:hover': {
                    borderColor: '#0056b3',
                  },
                }),
                placeholder: (baseStyles) => ({
                  ...baseStyles,
                  color: '#6c757d',
                  fontSize: '14px', // Slightly smaller font size
                }),
                multiValue: (baseStyles) => ({
                  ...baseStyles,
                  backgroundColor: '#e9ecef',
                  borderRadius: '10px',
                }),
                menu: (baseStyles) => ({
                  ...baseStyles,
                  borderRadius: '20px',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                }),
                option: (baseStyles, state) => ({
                  ...baseStyles,
                  backgroundColor: state.isFocused ? '#f8f9fa' : 'white',
                  color: '#495057',
                  '&:active': {
                    backgroundColor: '#0066cc',
                    color: 'white',
                  },
                }),
              }}
                components={{ Option: CheckboxOption }}
              />
              {formik.errors.modules && (
                <div className="text-danger">{formik.errors.modules}</div>
              )}
            </Form.Group>

            <Form.Group controlId="lessons">
              <Form.Label>Leçons</Form.Label>
              <Select
                isMulti
                options={lessonOptions}
                name="lessons"
                onChange={handleLessonsChange}
                classNamePrefix="select"
                             styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  borderColor: state.isFocused ? '#0066cc' : '#ced4da',
                  borderRadius: '20px',
                  height: '45px', // Reduced height
                  boxShadow: 'none',
                  '&:hover': {
                    borderColor: '#0056b3',
                  },
                }),
                placeholder: (baseStyles) => ({
                  ...baseStyles,
                  color: '#6c757d',
                  fontSize: '14px', // Slightly smaller font size
                }),
                multiValue: (baseStyles) => ({
                  ...baseStyles,
                  backgroundColor: '#e9ecef',
                  borderRadius: '10px',
                }),
                menu: (baseStyles) => ({
                  ...baseStyles,
                  borderRadius: '20px',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                }),
                option: (baseStyles, state) => ({
                  ...baseStyles,
                  backgroundColor: state.isFocused ? '#f8f9fa' : 'white',
                  color: '#495057',
                  '&:active': {
                    backgroundColor: '#0066cc',
                    color: 'white',
                  },
                }),
              }}
                components={{ Option: CheckboxOption }}
              />
              {formik.errors.lessons && (
                <div className="text-danger">{formik.errors.lessons}</div>
              )}
            </Form.Group>

            <Form.Group controlId="note">
              <Form.Label>Note</Form.Label>
              <RichTextEditor initialValue={formik.values.note} getValue={handleDescriptionChange} />
              {formik.errors.note && (
                <div className="text-danger">{formik.errors.note}</div>
              )}
            </Form.Group>
{/* **************************************************************************************** */}
<Form.Group>
  <Form.Label>Options de téléchargement :</Form.Label>
  <Row className="justify-content-center">
    <Col xs={12} sm={6} md={4} className="d-flex justify-content-center mb-3">
      <Button
        onClick={() => handleClick("image")}
        className={`btn-tab-images ${images.length > 0 ? "active-images" : ""}`}
        disabled={!!(audioFile || pdfPreview || videoPreview || link || referenceLivre)}
      >
        <FiImage size={35} />
      </Button>
      <input
        type="file"
        accept="image/png, image/jpeg"
        ref={hiddenFileInputImage}
        onChange={(event) => handleFileChange(event, "image")}
        multiple
        style={{ display: "none" }}
      />
    </Col>

    <Col xs={12} sm={6} md={4} className="d-flex justify-content-center mb-3">
<Button
  onClick={() => handleClick("audio")}
  className={`btn-tab-audio ${audioFile ? "active-audio" : ""}`}
  disabled={!!(images.length > 0 || pdfPreview || videoPreview || link || referenceLivre)}
>
  <FiVolume2 size={35} />
</Button>
      <input
        type="file"
        accept="audio/*"
        ref={hiddenFileInputAudio}
        onChange={(event) => handleFileChange(event, "audio")}
        style={{ display: "none" }}
      />
    </Col>

    <Col xs={12} sm={6} md={4} className="d-flex justify-content-center mb-3">
      <Button
        onClick={() => handleClick("pdf")}
        className={`btn-tab-googleDrive ${pdfFile ? "active-googleDrive" : ""}`}
        disabled={!!(audioFile || images.length > 0 || videoPreview || link || referenceLivre)}
      >
        <FiFile size={35} />
      </Button>
      <input
        type="file"
        accept="application/pdf"
        ref={hiddenFileInputPdf}
        onChange={(event) => handleFileChange(event, "pdf")}
        style={{ display: "none" }}
      />
    </Col>

    <Col xs={12} sm={6} md={4} className="d-flex justify-content-center mb-3">
      <Button
        onClick={() => handleClick("video")}
        className={`btn-tab-video ${videoFile ? "active-video" : ""}`}
        disabled={!!(audioFile || images.length > 0 || pdfPreview || link || referenceLivre)}
      >
        <FiVideo size={35} />
      </Button>
      <input
        type="file"
        accept="video/*"
        ref={hiddenFileInputVideo}
        onChange={(event) => handleFileChange(event, "video")}
        style={{ display: "none" }}
      />
    </Col>

    <Col xs={12} sm={6} md={4} className="d-flex justify-content-center mb-3">
      <Button
        onClick={() => {
          setDisplayLinkInput(true);
          setDisplayBookInput(false);
        }}
        className={`btn-tab-link ${displayLinkInput ? "active-link" : ""}`}
        disabled={!!(audioFile || images.length > 0 || pdfPreview || videoPreview || referenceLivre)}
      >
        <FiLink size={35} />
      </Button>
    </Col>

    <Col xs={12} sm={6} md={4} className="d-flex justify-content-center mb-3">
      <Button
        onClick={() => {
          setDisplayBookInput(true);
          setDisplayLinkInput(false);
        }}
        className={`btn-tab-book ${displayBookInput ? "active-book" : ""}`}
        disabled={!!(audioFile || images.length > 0 || pdfPreview || videoPreview || link)}
      >
        <FiBook size={35} />
      </Button>
    </Col>
  </Row>
</Form.Group>


{/* **************************************************************************************** */}
            {displayLinkInput && (
              <Form.Group controlId="link">
                <Form.Label>Lien externe</Form.Label>
                <Form.Control
                  type="text"
                  name="link"
                  value={formik.values.link}
                  onChange={handleLinkChange}
                  isInvalid={!!formik.errors.link}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.link}
                </Form.Control.Feedback>
              </Form.Group>
            )}

            {displayBookInput && (
              <Form.Group controlId="referenceLivre">
                <Form.Label>Référence du livre</Form.Label>
                <Form.Control
                  type="text"
                  name="referenceLivre"
                  value={formik.values.referenceLivre}
                  onChange={handleReferenceLivreChange}
                  isInvalid={!!formik.errors.referenceLivre}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.referenceLivre}
                </Form.Control.Feedback>
              </Form.Group>
            )}

          {/* ********************************************************************** */}
         <ImagePreviewContainer>
      {images.length > 0 &&
        images.map((image, index) => (
          <ImageCard key={index}>
             <DeleteButton
              variant="danger"
              onClick={(e) => {
                e.stopPropagation(); // Prevents the click from opening the modal
                removeFile("image", index);
              }}
            >
              <FiTrash2 size={16} />
            </DeleteButton>
            <Zoom>
              <img src={image.preview} alt={`Preview ${index}`} />
            </Zoom>
           
          </ImageCard>
        ))}
    </ImagePreviewContainer>
          {/*  *************************************************************************/}
            {audioFile && (
              <div className="audio-preview">
                <AudioPlayer audioFile={audioFile.preview} />
                <div className="d-flex justify-content-center">
                <Button variant="outline-danger"   onClick={() => removeFile("audio")}>
                  <FiTrash2 size={24} /> Supprimer l'audio
                </Button>
                </div>
              </div>
            )}

            {pdfPreview && (
              <div className="pdf-preview">
                <iframe src={pdfPreview} width="100%" height="500px" title="PDF Preview" />
                                <div className="d-flex justify-content-center">
                <Button variant="outline-danger" className="d-flex justify-content-center"   onClick={() => removeFile("pdf")}>
                  <FiTrash2 size={24} /> Supprimer le PDF
                </Button>
                </div>
              </div>
            )}

            {videoPreview && (
              <div className="video-preview">
                <video src={videoPreview} controls width="100%" />
                                                <div className="d-flex justify-content-center">
                <Button variant="outline-danger" className="d-flex justify-content-center" onClick={() => removeFile("video")}>
                  <FiTrash2 size={24} /> Supprimer la vidéo
                </Button>
                </div>
              </div>
            )}

            <Container>
      <Row>
        <LargeButtonGroup>
                  <LargeButton variant="secondary" onClick={() => navigate("/dashboard/resources")}>
              Annuler
            </LargeButton>
            <LargeButton type="submit" variant="primary">
              Enregistrer 
            </LargeButton>
        </LargeButtonGroup>
      </Row>
    </Container>

          </Form>
        </Col>
      </Row>
    </StyledContainer>
  );

}




