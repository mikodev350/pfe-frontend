import React, { useState, useEffect, useRef, useMemo } from "react";
import { Button, Form, Container, Row, Col, Spinner } from "react-bootstrap";
import Select, { components } from "react-select";
import { useFormik } from "formik";
import { validationSchema } from "../../validator/addResourceValidator";
import { fetchDataAndStore, getParcoursFromLocalStorage, getModulesFromLocalStorage, getLessonsFromLocalStorage } from "../../api/apiDataSelect";
import RichTextEditor from "../../components/richTextEditor/RichTextEditor";
import AudioPlayer from "../../components/audioPlayer/AudioPlayer";
import { FiImage, FiTrash2, FiVolume2, FiFile, FiVideo, FiLink, FiBook } from "react-icons/fi";
import { getToken } from "../../util/authUtils";
import { uploadFile } from "../../api/apiUpload";
import { useParams, useNavigate } from "react-router-dom";
import { getResourceById, updateResource, addFileInToIndexedDB, syncOfflineChangesResource } from "../../api/apiResource";
import { useQueryClient } from "react-query";
import Swal from 'sweetalert2'; // Importation de SweetAlert

import styled from "styled-components";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Retour from "../../components/retour-arriere/Retour";


/**************************************************************************************************/
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
  padding: 15px 20px !important;
  font-size: 1.2rem !important;
  border-radius: 35px !important;
  margin: 0 10px !important;
  flex: 1 !important;

  @media (max-width: 768px) {
    width: 100% !important;
    margin: 10px 0 !important;
    font-size: 1.5rem !important;
  }
`;

const LargeButtonGroup = styled.div`
  display: flex !important;
  justify-content: center !important;
  flex-wrap: wrap !important;
  margin-top: 20px !important;
  width: 100% !important;

  @media (max-width: 768px) {
    flex-direction: column !important;
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

/***************************************************************************************************/  
const formatOptions = [
  { value: 'cours', label: 'Cours' },
  { value: 'devoir', label: 'Devoir' },
  { value: 'ressource numérique', label: 'Ressource Numérique' },
];


const fetchMediaFromCache = async (url) => {
  if (!url) return null;

  try {
    const cache = await caches.open('resource-files');
    const response = await cache.match(url);

    alert(response)
    if (response) {
      const blobUrl = URL.createObjectURL(await response.blob());
      return blobUrl;
    }
  } catch (error) {
    console.error(`Failed to fetch media from cache for URL: ${url}`, error);
  }
  return null;
};


const CheckboxOption = (props) => (
  <components.Option {...props}>
    <input type="checkbox" checked={props.isSelected} onChange={() => null} />{" "}
    <label>{props.label}</label>
  </components.Option>
);

export default function UpdateResource() {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const [parcoursOptions, setParcoursOptions] = useState([]);
  const [moduleOptions, setModuleOptions] = useState([]);
  const [lessonOptions, setLessonOptions] = useState([]);

  const [images, setImages] = useState([]);
  const [audioFile, setAudioFile] = useState({ preview: "", id: null, raw: null });
  const [pdfFile, setPdfFile] = useState({ preview: "", id: null, raw: null });
  const [videoFile, setVideoFile] = useState({ preview: "", id: null, raw: null });
  const [link, setLink] = useState("");
  const [referenceLivre, setReferenceLivre] = useState("");
  const [displayLinkInput, setDisplayLinkInput] = useState(false);
  const [displayBookInput, setDisplayBookInput] = useState(false);

  const hiddenFileInputImage = useRef(null);
  const hiddenFileInputAudio = useRef(null);
  const hiddenFileInputPdf = useRef(null);
  const hiddenFileInputVideo = useRef(null);

  const token = useMemo(() => getToken(), []);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOnline = async () => {
      try {
        await syncOfflineChangesResource(token, queryClient);
        console.log("Synced offline changes successfully.");
      } catch (error) {
        console.error("Error syncing offline changes:", error);
      }
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [token, queryClient]);
const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
  initialValues: {
    nom: "",
    format: "",
    parcours: [],
    modules: [],
    lessons: [],
    note: "",
    youtubeLink: "",
    images: [],
    audio: "",
    pdf: "",
    video: "",
    link: "",
    referenceLivre: "",
  },
  validationSchema: validationSchema,
  onSubmit: async (values) => {
      setIsSubmitting(true); // Activer le loader

    try {
      const updatedValues = { ...values };
  


      // Gérer les images

      const newImages = await Promise.all(
        updatedValues.images.map(async (image) => {


          /*************************************************************************************/ 
        if (image.raw) {
          if (!navigator.onLine) {
            const id = await addFileInToIndexedDB(image.preview, image.raw);
            return { id, offline: true };
          } else {
            const uploadedImage = await uploadFile(image.raw, token);
            return { id: uploadedImage[0].id };
          }
        } else {
          if (!navigator.onLine) {
           // Comparer avec les images existantes dans formik.values
    const existingImage = formik.values.images.find((img) => img.id === image.id);
    
    if (existingImage) {
      return { id: existingImage.id , url:existingImage.url }; // Garder l'image existante, ne pas la modifier
    }
            }
          return { id: image.id }; // Conserver l'identifiant de l'image existante
        }
      }));


    
      updatedValues.images = newImages;
      // Gérer le fichier audio
      if (audioFile.raw) {
        if (!navigator.onLine) {
          const id = await addFileInToIndexedDB(audioFile.preview, audioFile.raw);
          updatedValues.audio = { id, offline: true };
        } else {
          const uploadedAudio = await uploadFile(audioFile.raw, token);
          updatedValues.audio = { preview: uploadedAudio[0].url, id: uploadedAudio[0].id };
        }
      } else if (audioFile.id) {
        updatedValues.audio = { id: audioFile.id }; // Conserver l'identifiant de l'audio existant
      }

      // Gérer le fichier PDF
                    console.log("pdfFile")

              console.log(pdfFile)

      if (pdfFile.raw) {
        if (!navigator.onLine) {
          const id = await addFileInToIndexedDB(pdfFile.preview, pdfFile.raw);
          updatedValues.pdf = { id, offline: true };
        } else {
          const uploadedPdf = await uploadFile(pdfFile.raw, token);
          updatedValues.pdf = { preview: uploadedPdf[0].url, id: uploadedPdf[0].id };
        }
      } else if (pdfFile.id) {
        updatedValues.pdf = { id: pdfFile.id }; // Conserver l'identifiant du PDF existant
      }

      // Gérer le fichier vidéo
      if (videoFile.raw) {
        if (!navigator.onLine) {
          const id = await addFileInToIndexedDB(videoFile.preview, videoFile.raw);
          updatedValues.video = { id, offline: true };
        } else {
          const uploadedVideo = await uploadFile(videoFile.raw, token);
          updatedValues.video = { preview: uploadedVideo[0].url, id: uploadedVideo[0].id };
        }
      } else if (videoFile.id) {
        updatedValues.video = { id: videoFile.id }; // Conserver l'identifiant de la vidéo existante
      }

      // Soumettre les valeurs mises à jour
      const response = await updateResource(id, updatedValues, token);
       if (response && response.data) {
                  Swal.fire({
            icon: 'success',
            title: 'Ressource mise à jour avec succès !',
            showConfirmButton: false,
            timer: 1500
          });
        formik.resetForm();
        setImages([]);
        setAudioFile({ preview: "", id: null, raw: null });
        setPdfFile({ preview: "", id: null, raw: null });
        setVideoFile({ preview: "", id: null, raw: null });
        setLink("");
        setReferenceLivre("");
        setDisplayLinkInput(false);
        setDisplayBookInput(false);
 setIsSubmitting(false);
        navigate("/dashboard/resources"); // Navigate after success
      } else {
        throw new Error("Failed to update resource");
      }
    } catch (error) {
 Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'La mise à jour de la ressource a échoué. Veuillez réessayer.',
        });        console.error("Error updating resource:", error);   
       }
  },
});


/******************************************************************************************************************/
useEffect(() => {
  const fetchData = async () => {
    try {
      await fetchDataAndStore(token);
      const parcours = getParcoursFromLocalStorage();
      setParcoursOptions(parcours.map((p) => ({ value: p.id, label: p.name })));

      const resource = await getResourceById(id, token, "update");
      console.log("***********************resource*********************************************");
      console.log(resource);

      let cachedImages = [];
      let cachedAudioUrl = null;
      let cachedPdfUrl = null;
      let cachedVideoUrl = null;

      if (!navigator.onLine) {
        cachedImages = await Promise.all(
          resource.images.map(async (image) => {
            const cachedUrl = await fetchMediaFromCache(image?.url || image);
            
            return { preview: cachedUrl || image, id: image.id, raw: null };
          })
        );
        // alert(JSON.stringify(cachedImages))
        cachedAudioUrl = await fetchMediaFromCache(resource.audio?.url || resource.audio);
        cachedPdfUrl = await fetchMediaFromCache(resource.pdf?.url || resource.pdf);
        cachedVideoUrl = await fetchMediaFromCache(resource.video?.url || resource.video);
      } else {
        cachedImages = resource.images
          ? resource.images.map((image) => ({
              preview: image.url,
              id: image.id,
              raw: null,
            }))
          : null;
        cachedAudioUrl = resource.audio ? resource.audio.url : null;
        cachedPdfUrl = resource.pdf ? resource.pdf.url : null;
        cachedVideoUrl = resource.video ? resource.video.url : null;
      }

      
 if (cachedPdfUrl && !cachedPdfUrl.startsWith("blob")) {
  try {
    const response = await fetch(`http://localhost:1337${cachedPdfUrl}`);
    if (!response.ok) {
      throw new Error("Failed to fetch PDF");
    }
    const blob = await response.blob();
    cachedPdfUrl = URL.createObjectURL(blob);
  } catch (error) {
    console.error("Error fetching PDF:", error);
    cachedPdfUrl = null; // Reset cachedPdfUrl if there's an error
  }
}
console.log("PDF URL:", cachedPdfUrl); // Check if the URL is correct




      console.log('====================================');
            console.log("cachedImages");

      console.log(cachedImages);
      console.log('====================================');
      formik.setValues({
        nom: resource.nom || "",
        format: resource.format || "",
        parcours: resource.parcours ? resource.parcours.map((p) => p.id) : [],
        modules: resource.modules ? resource.modules.map((m) => m.id) : [],
        lessons: resource.lessons ? resource.lessons.map((l) => l.id) : [],
        note: resource.note || "",
        youtubeLink: resource.youtubeLink || "",
        images: resource.images || [],
        audio: resource.audio ? resource.audio.url : "",
        pdf: cachedPdfUrl
          ? { preview: cachedPdfUrl, id: resource.pdf.id, raw: null }
          : null,
        video: resource.video ? resource.video.url : "",
        link: resource.link || "",
        referenceLivre: resource.referenceLivre || "",
      });


      if (cachedImages) {
 const imageData= resource.images.map((image)=>({
          preview:image.url,
          raw: images
         }))
         setImages(imageData)
      } 
  if (cachedAudioUrl) {
    setAudioFile({ preview: cachedAudioUrl, id: resource.audio.id, raw: null });
} else if (resource.audio && resource.audio.url) {
    setAudioFile({ preview: resource.audio.url, id: resource.audio.id, raw: null });
}
     if (cachedPdfUrl) {
    setPdfFile({ preview: cachedPdfUrl, id: resource.pdf.id, raw: null });
} else if (resource.pdf && resource.pdf.url) {
    setPdfFile({ preview: resource.pdf.url, id: resource.pdf.id, raw: null });
}

     if (cachedVideoUrl) {
    setVideoFile({ preview: cachedVideoUrl, id: resource.video.id, raw: null });
} else if (resource.video && resource.video.url) {
    setVideoFile({ preview: resource.video.url, id: resource.video.id, raw: null });
}

      setLink(resource.link || "");
      setReferenceLivre(resource.referenceLivre || "");

      const selectedParcoursIds = resource.parcours.map((p) => p.id);
      const filteredModules = getModulesFromLocalStorage().filter((m) =>
        selectedParcoursIds.includes(m.idparcour)
      );
      setModuleOptions(filteredModules.map((m) => ({ value: m.id, label: m.name })));

      const selectedModulesIds = resource.modules.map((m) => m.id);
      const filteredLessons = getLessonsFromLocalStorage().filter((l) =>
        selectedModulesIds.includes(l.idmodule)
      );
      setLessonOptions(filteredLessons.map((l) => ({ value: l.id, label: l.name })));



    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  fetchData();
}, [id, token]);



const handleParcoursChange = (selectedParcours) => {
    formik.setFieldValue("parcours", selectedParcours.map((p) => p.value).filter(Boolean));
    const selectedParcoursIds = selectedParcours.map((p) => p.value).filter(Boolean);
    const filteredModules = getModulesFromLocalStorage().filter((m) => selectedParcoursIds.includes(m.idparcour));
    setModuleOptions(filteredModules.map((m) => ({ value: m.id, label: m.name })));
    setLessonOptions([]);
  };

  const handleModulesChange = (selectedModules) => {
    formik.setFieldValue("modules", selectedModules.map((m) => m.value).filter(Boolean));
    const selectedModulesIds = selectedModules.map((m) => m.value).filter(Boolean);
    const filteredLessons = getLessonsFromLocalStorage().filter((l) => selectedModulesIds.includes(l.idmodule));
    setLessonOptions(filteredLessons.map((l) => ({ value: l.id, label: l.name })));
  };

  const handleLessonsChange = (selectedLessons) => {
    formik.setFieldValue("lessons", selectedLessons.map((l) => l.value).filter(Boolean));
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
        setImages([...images, ...newImages]);
        formik.setFieldValue("images", [...images, ...newImages]);
      } else {
        const file = files[0];
        const url = URL.createObjectURL(file);
        if (type === "audio") {
          setAudioFile({ preview: url, raw: file });
          formik.setFieldValue("audio", file);
        } else if (type === "pdf") {
          setPdfFile({ preview: url, raw: file });
          formik.setFieldValue("pdf", file);
        } else if (type === "video") {
          setVideoFile({ preview: url, raw: file });
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
      setAudioFile({ preview: "", raw: null });
      formik.setFieldValue("audio", null); // Set to null when removed
    } else if (type === "pdf") {
      setPdfFile({ preview: "", raw: null });
      formik.setFieldValue("pdf", null); // Set to null when removed
    } else if (type === "video") {
      setVideoFile({ preview: "", raw: null });
      formik.setFieldValue("video", null); // Set to null when removed
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

  const handleBookReferenceChange = (event) => {
    const value = event.target.value;
    setReferenceLivre(value);
    formik.setFieldValue("referenceLivre", value);
    if (value) {
      setDisplayLinkInput(false);
    }
  };

  const handleFormatChange = (selectedOption) => {
    formik.setFieldValue("format", selectedOption.value);
  };

  return (
    <StyledContainer>
      <Retour />
            <ToastContainer /> {/* Add this to display toast notifications */}

            <FormTitle>Modifier une ressource</FormTitle>

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
                value={formatOptions.find((option) => option.value === formik.values.format)}
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
                onChange={handleParcoursChange}
                classNamePrefix="select"
                components={{ Option: CheckboxOption }}
                value={parcoursOptions.filter((p) => formik.values.parcours.includes(p.value))}
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
                onChange={handleModulesChange}
                classNamePrefix="select"
                components={{ Option: CheckboxOption }}
                value={moduleOptions.filter((m) => formik.values.modules.includes(m.value))}
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
                value={lessonOptions.filter((l) => formik.values.lessons.includes(l.value))}
              />
              {formik.errors.lessons && (
                <div className="text-danger">{formik.errors.lessons}</div>
              )}
            </Form.Group>

            <Form.Group controlId="note">
              <Form.Label>Note</Form.Label>
              <RichTextEditor initialValue={formik.values.note} getValue={handleDescriptionChange} isUpdate={true} />
              {formik.errors.note && (
                <div className="text-danger">{formik.errors.note}</div>
              )}
            </Form.Group>

         <Form.Group>
  <Form.Label>Options de téléchargement :</Form.Label>
  <Row className="justify-content-center">
    <Col xs={12} sm={6} md={4} className="d-flex justify-content-center mb-3">
      <Button
        onClick={() => handleClick("image")}
        className={`btn-tab-images ${images.length > 0 ? "active-images" : ""}`}
        disabled={!!(audioFile.preview || pdfFile.preview || videoFile.preview || link || referenceLivre)}
      >
        <span>
          <FiImage size={35} />
        </span>
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
        className={`btn-tab-audio ${audioFile.preview ? "active-audio" : ""}`}
        disabled={!!(images.length > 0 || pdfFile.preview || videoFile.preview || link || referenceLivre)}
      >
        <span>
          <FiVolume2 size={35} />
        </span>
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
        className={`btn-tab-googleDrive ${pdfFile.preview ? "active-googleDrive" : ""}`}
        disabled={!!(audioFile.preview || images.length > 0 || videoFile.preview || link || referenceLivre)}
      >
        <span>
          <FiFile size={35} />
        </span>
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
        className={`btn-tab-video ${videoFile.preview ? "active-video" : ""}`}
        disabled={!!(audioFile.preview || images.length > 0 || pdfFile.preview || link || referenceLivre)}
      >
        <span>
          <FiVideo size={35} />
        </span>
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
        className={`btn-tab-link ${displayLinkInput  || formik.values.link ? "active-link" : ""}`}
        disabled={!!(audioFile.preview || images.length > 0 || pdfFile.preview || videoFile.preview || referenceLivre)}
      >
        <span>
          <FiLink size={35} />
        </span>
      </Button>
    </Col>

    <Col xs={12} sm={6} md={4} className="d-flex justify-content-center mb-3">
      <Button
        onClick={() => {
          setDisplayBookInput(true);
          setDisplayLinkInput(false);
        }}
        className={`btn-tab-book ${displayBookInput || formik.values.referenceLivre ? "active-book" : ""}`}
        disabled={!!(audioFile.preview || images.length > 0 || pdfFile.preview || videoFile.preview || link)}
      >
        <span>
          <FiBook size={35} />
        </span>
      </Button>
    </Col>
  </Row>
</Form.Group>


            {(displayLinkInput || formik.values.link) && (
              <Form.Group controlId="link">
                <Form.Label>Lien externe</Form.Label>
                <Form.Control
                  type="text"
                  name="link"
                  value={formik.values.link}
                  onChange={handleLinkChange}
                  isInvalid={!!formik.errors.link}
                />
                <Form.Control.Feedback type="invalid">{formik.errors.link}</Form.Control.Feedback>
              </Form.Group>
            )}

            {(displayBookInput || formik.values.referenceLivre)  && (
              <Form.Group controlId="referenceLivre">
                <Form.Label>Référence du livre</Form.Label>
                <Form.Control
                  type="text"
                  name="referenceLivre"
                  value={formik.values.referenceLivre}
                  onChange={handleBookReferenceChange}
                  isInvalid={!!formik.errors.referenceLivre}
                />
                <Form.Control.Feedback type="invalid">{formik.errors.referenceLivre}</Form.Control.Feedback>
              </Form.Group>
            )}


            <ImagePreviewContainer>
  {images.length > 0 &&
  images.map((image, index) => (
    <ImageCard key={index}>
      <DeleteButton
        variant="danger"
        onClick={(e) => {
          e.stopPropagation();
          removeFile("image", index);
        }}
      >
        <FiTrash2 size={16} />
      </DeleteButton>
      {image.preview && (
        <Zoom>
          <img
            src={
              image.preview.startsWith('http://localhost:1337') || image.preview.startsWith('blob:')
                ? image.preview  // Si l'URL est déjà complète ou un blob, utilisez-la telle quelle
                : `http://localhost:1337${image.preview}`  // Si l'URL est incomplète, ajoutez localhost
            }
            alt={`Preview ${index}`}
          />
        </Zoom>
      )}
    </ImageCard>
  ))}
</ImagePreviewContainer>


    

    {/* <ImagePreviewContainer>
  {images.length > 0 &&
  images.map((image, index) => (
    <ImageCard key={index}>
      <DeleteButton
        variant="danger"
        onClick={(e) => {
          e.stopPropagation();
          removeFile("image", index);
        }}
      >
        <FiTrash2 size={16} />
      </DeleteButton>
        {image.preview && (
                <Zoom>

          <img
            src={
              typeof image.preview === 'string' && image.preview.startsWith('blob')
                ? image.preview
                : `http://localhost:1337${image.preview}`
            }
            alt={`Preview ${index}`}
          />
        </Zoom>
)}
    </ImageCard>
  ))}

</ImagePreviewContainer> */}



            {/* {audioFile.preview && (
              <div className="audio-preview">
                <AudioPlayer audioFile={audioFile.preview?.startsWith('blob') ? audioFile.preview : `http://localhost:1337${audioFile.preview}`} />
            <div className="d-flex justify-content-center">
                <Button variant="outline-danger" onClick={() => removeFile("audio")}>
                  <FiTrash2 size={24} /> Supprimer l'audio
                </Button>
                </div>
              </div>
            )} */}
{/* ************************************************************************************* */}
{audioFile.preview && (
  <div className="audio-preview">
    <AudioPlayer
      audioFile={
        audioFile.preview.startsWith('blob')
          ? audioFile.preview
          : `http://localhost:1337${audioFile.preview}` // URL de l'audio si pas modifié
      }
    />
    <Button variant="outline-danger" onClick={() => removeFile("audio")}>
      <FiTrash2 size={24} /> Supprimer l'audio
    </Button>
  </div>
)}


{/* ********************************************************************************************* */}
            {/* {pdfFile.preview && (
              <div className="pdf-preview">
                <iframe title="PDF Preview" src={pdfFile.preview?.startsWith('blob') ? pdfFile.preview : `http://localhost:1337${pdfFile.preview}`} width="100%" height="500px" />
         <div className="d-flex justify-content-center">
                <Button variant="outline-danger" onClick={() => removeFile("pdf")}>
                  <FiTrash2 size={24} /> Supprimer le PDF
                </Button>
                </div>
              </div>
            )} */}
{pdfFile.preview && (
  <div className="pdf-preview">
    <iframe
      title="PDF Preview"
      src={pdfFile.preview.startsWith('blob') ? pdfFile.preview : `http://localhost:1337${pdfFile.preview}`}
      width="100%"
      height="500px"
    />
    <Button variant="outline-danger" onClick={() => removeFile("pdf")}>
      <FiTrash2 size={24} /> Supprimer le PDF
    </Button>
  </div>
)}


{/* ************************************************************************* */}
            {/* {videoFile.preview && (
              <div className="video-preview">
                <video src={videoFile.preview?.startsWith('blob') ? videoFile.preview : `http://localhost:1337${videoFile.preview}`} controls width="100%" />
                <Button variant="outline-danger" onClick={() => removeFile("video")}>
                  <FiTrash2 size={24} /> Supprimer la vidéo
                </Button>
              </div>
            )} */}


{videoFile.preview && (
  <div className="video-preview">
    <video
      src={videoFile.preview.startsWith('blob') ? videoFile.preview : `http://localhost:1337${videoFile.preview}`}
      controls
      width="100%"
    />
    <Button variant="outline-danger" onClick={() => removeFile("video")}>
      <FiTrash2 size={24} /> Supprimer la vidéo
    </Button>
  </div>
)}




           <LargeButtonGroup>
              <LargeButton variant="secondary" onClick={() => navigate("/dashboard/resources")}>
                Annuler
              </LargeButton>

              <LargeButton type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? <Spinner animation="border" size="sm" /> : "Mettre à jour"}
              </LargeButton>
            </LargeButtonGroup>
          </Form>
        </Col>
      </Row>
    </StyledContainer>
  );
}



