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
import { saveResource, syncOfflineChangesResource, addFileInToIndexedDB } from "../../api/apiResource";
import { useQueryClient } from "react-query";
import { uploadFile } from "../../api/apiUpload";

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
        await syncOfflineChangesResource(token, queryClient);
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
                        console.log("image.raw")

            console.log(image.raw)
                        console.log("image")

            console.log(image)

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
          } else {
            throw new Error("Failed to save resource");
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
        setImages([...images, ...newImages]); // Append new images
        formik.setFieldValue("images", [...images, ...newImages].map(image => image.raw)); // Update formik values with raw images
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
    <Container>
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

            <Form.Group>
              <Form.Label>Options de téléchargement :</Form.Label>
              <div className="d-flex justify-content-center">
                <Button
                  onClick={() => handleClick("image")}
                  className={`btn-tab-images ${images.length > 0 ? "active-images" : ""}`}
                  disabled={!!(audioFile || pdfPreview || videoPreview || link || referenceLivre)}
                >
                  <span>
                    <FiImage size={35} />
                    Télécharger des images
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

                <Button
                  onClick={() => handleClick("audio")}
                  className={`btn-tab-audio ${audioFile ? "active-audio" : ""}`}
                  disabled={!!(images.length > 0 || pdfPreview || videoPreview || link || referenceLivre)}
                >
                  <span>
                    <FiVolume2 size={35} />
                    Télécharger un audio
                  </span>
                </Button>
                <input
                  type="file"
                  accept="audio/*"
                  ref={hiddenFileInputAudio}
                  onChange={(event) => handleFileChange(event, "audio")}
                  style={{ display: "none" }}
                />

                <Button
                  onClick={() => handleClick("pdf")}
                  className={`btn-tab-googleDrive ${pdfFile ? "active-googleDrive" : ""}`}
                  disabled={!!(audioFile || images.length > 0 || videoPreview || link || referenceLivre)}
                >
                  <span>
                    <FiFile size={35} />
                    Télécharger un PDF
                  </span>
                </Button>
                <input
                  type="file"
                  accept="application/pdf"
                  ref={hiddenFileInputPdf}
                  onChange={(event) => handleFileChange(event, "pdf")}
                  style={{ display: "none" }}
                />

                <Button
                  onClick={() => handleClick("video")}
                  className={`btn-tab-video ${videoFile ? "active-video" : ""}`}
                  disabled={!!(audioFile || images.length > 0 || pdfPreview || link || referenceLivre)}
                >
                  <span>
                    <FiVideo size={35} />
                    Télécharger une vidéo
                  </span>
                </Button>
                <input
                  type="file"
                  accept="video/*"
                  ref={hiddenFileInputVideo}
                  onChange={(event) => handleFileChange(event, "video")}
                  style={{ display: "none" }}
                />

                <Button
                  onClick={() => {
                    setDisplayLinkInput(true);
                    setDisplayBookInput(false);
                  }}
                  className={`btn-tab-link ${displayLinkInput ? "active-link" : ""}`}
                  disabled={!!(audioFile || images.length > 0 || pdfPreview || videoPreview || referenceLivre)}
                >
                  <span>
                    <FiLink size={35} />
                    Ajouter un lien
                  </span>
                </Button>

                <Button
                  onClick={() => {
                    setDisplayBookInput(true);
                    setDisplayLinkInput(false);
                  }}
                  className={`btn-tab-book ${displayBookInput ? "active-book" : ""}`}
                  disabled={!!(audioFile || images.length > 0 || pdfPreview || videoPreview || link)}
                >
                  <span>
                    <FiBook size={35} />
                    Ajouter une référence de livre
                  </span>
                </Button>
              </div>
            </Form.Group>

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

            <div className="image-preview-container">
              {images.length > 0 && images.map((image, index) => (
                <div className="image-preview" key={index}>
                  <img src={image.preview} alt={`Preview ${index}`} className="thumbnail-image" />
                  <Button variant="outline-danger" onClick={() => removeFile("image", index)}>
                    <FiTrash2 size={24} /> Supprimer
                  </Button>
                </div>
              ))}
            </div>

            {audioFile && (
              <div className="audio-preview">
                <AudioPlayer audioFile={audioFile.preview} />
                <Button variant="outline-danger" onClick={() => removeFile("audio")}>
                  <FiTrash2 size={24} /> Supprimer l'audio
                </Button>
              </div>
            )}

            {pdfPreview && (
              <div className="pdf-preview">
                <iframe src={pdfPreview} width="100%" height="500px" title="PDF Preview" />
                <Button variant="outline-danger" onClick={() => removeFile("pdf")}>
                  <FiTrash2 size={24} /> Supprimer le PDF
                </Button>
              </div>
            )}

            {videoPreview && (
              <div className="video-preview">
                <video src={videoPreview} controls width="100%" />
                <Button variant="outline-danger" onClick={() => removeFile("video")}>
                  <FiTrash2 size={24} /> Supprimer la vidéo
                </Button>
              </div>
            )}

            <Button type="submit" className="mt-3">Enregistrer la ressource</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}



// import React, { useState, useEffect, useRef } from "react";
// import { Button, Form, Container, Row, Col } from "react-bootstrap";
// import Select, { components } from "react-select";
// import { useFormik } from "formik";
// import { validationSchema } from "../../validator/addResourceValidator";
// import { fetchDataAndStore, getParcoursFromLocalStorage, getModulesFromLocalStorage, getLessonsFromLocalStorage } from "../../api/apiDataSelect";
// import RichTextEditor from "../../components/richTextEditor/RichTextEditor";
// import AudioPlayer from "../../components/audioPlayer/AudioPlayer";
// import { FiImage, FiTrash2, FiVolume2, FiFile, FiVideo, FiLink, FiBook } from "react-icons/fi";
// import { getToken } from "../../util/authUtils"; 
// import { saveResource, syncOfflineChangesResource, saveFileToIndexedDB } from "../../api/apiResource";
// import { useQueryClient } from "react-query";
// import { uploadFile } from "../../api/apiUpload";

// const formatOptions = [
//   { value: 'cours', label: 'Cours' },
//   { value: 'devoir', label: 'Devoir' },
//   { value: 'ressource numérique', label: 'Ressource Numérique' }
// ];

// const CheckboxOption = (props) => (
//   <components.Option {...props}>
//     <input type="checkbox" checked={props.isSelected} onChange={() => null} />{" "}
//     <label>{props.label}</label>
//   </components.Option>
// );

// export default function AddResource() {
//   const [parcoursOptions, setParcoursOptions] = useState([]);
//   const [moduleOptions, setModuleOptions] = useState([]);
//   const [lessonOptions, setLessonOptions] = useState([]);
//   const [resources, setResources] = useState([]);
//   const [images, setImages] = useState([]); // Multiple images
//   const [audioFile, setAudioFile] = useState(null);
//   const [pdfFile, setPdfFile] = useState(null);
//   const [pdfPreview, setPdfPreview] = useState("");
//   const [videoFile, setVideoFile] = useState(null);
//   const [videoPreview, setVideoPreview] = useState("");
//   const [link, setLink] = useState("");
//   const [referenceLivre, setReferenceLivre] = useState("");
//   const [displayLinkInput, setDisplayLinkInput] = useState(false);
//   const [displayBookInput, setDisplayBookInput] = useState(false);

//   const hiddenFileInputImage = useRef(null);
//   const hiddenFileInputAudio = useRef(null);
//   const hiddenFileInputPdf = useRef(null);
//   const hiddenFileInputVideo = useRef(null);

//   const token = React.useMemo(() => getToken(), []);
//   const queryClient = useQueryClient();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         await fetchDataAndStore(token);
//         setParcoursOptions(getParcoursFromLocalStorage().map(p => ({ value: p.id, label: p.name })));
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };
//     fetchData();
//   }, [token]);

//   useEffect(() => {
//     const handleOnline = async () => {
//       try {
//         await syncOfflineChangesResource(token, queryClient);
//         console.log("Synced offline changes successfully.");
//       } catch (error) {
//         console.error("Error syncing offline changes:", error);
//       }
//     };

//     window.addEventListener("online", handleOnline);
//     return () => window.removeEventListener("online", handleOnline);
//   }, [token, queryClient]);

//   const formik = useFormik({
//     initialValues: {
//       nom: "",
//       format: "",
//       parcours: [],
//       module: [],
//       lesson: [],
//       note: "",
//       youtubeLink: "",
//       images: [], // Change to multiple images
//       audio: "",
//       pdf: "",
//       video: "",
//       link: "",
//       referenceLivre: "",
//     },
//     validationSchema: validationSchema,
//     onSubmit: async (values) => {
//       try {
//         const formData = new FormData();

//         // Upload images
//         const uploadedImages = [];
//         for (let image of images) {
//           if (!navigator.onLine) {
//             const id = await saveFileToIndexedDB(image);
//             uploadedImages.push({ id, offline: true });
//           } else {
//                         console.log("image.raw")

//             console.log(image.raw)
//                         console.log("image")

//             console.log(image)

//             const uploadedImage = await uploadFile(image.raw, token);
//             uploadedImages.push(uploadedImage[0]);
//           }
//         }
//         values.images = uploadedImages;

//         // Upload audio
//         if (audioFile) {
//           if (!navigator.onLine) {
//             const id = await saveFileToIndexedDB(audioFile.raw);
//             values.audio = { id, offline: true };
//           } else {
//             const uploadedAudio = await uploadFile(audioFile.raw, token);
//             values.audio = uploadedAudio[0];
//           }
//         }

//         // Upload PDF
//         if (pdfFile) {
//           if (!navigator.onLine) {
//             const id = await saveFileToIndexedDB(pdfFile.raw);
//             values.pdf = { id, offline: true };
//           } else {
//             const uploadedPdf = await uploadFile(pdfFile.raw, token);
//             values.pdf = uploadedPdf[0];
//           }
//         }

//         // Upload video
//         if (videoFile) {
//           if (!navigator.onLine) {
//             const id = await saveFileToIndexedDB(videoFile.raw);
//             values.video = { id, offline: true };
//           } else {
//             const uploadedVideo = await uploadFile(videoFile.raw, token);
//             values.video = uploadedVideo[0];
//           }
//         }

//         if (!navigator.onLine) {
//           // Save resource offline
//           await saveResource(values, token);
//         } else {
//           // Save resource online
//           const response = await saveResource(values, token);
//           if (response && response.data) {
//             console.log('Resource created successfully:', response);
//             setResources([...resources, response.data]);
//             formik.resetForm();
//             setImages([]); // Reset images
//             setAudioFile(null);
//             setPdfFile(null);
//             setPdfPreview("");
//             setVideoFile(null);
//             setVideoPreview("");
//             setLink("");
//             setReferenceLivre("");
//             setDisplayLinkInput(false);
//             setDisplayBookInput(false);
//           } else {
//             throw new Error("Failed to save resource");
//           }
//         }
//       } catch (error) {
//         console.error("Error saving resource:", error);
//       }
//     },
//   });

//   const handleParcoursChange = (selectedParcours) => {
//     formik.setFieldValue("parcours", selectedParcours.map(p => p.value));
//     const selectedParcoursIds = selectedParcours.map(p => p.value);
//     const filteredModules = getModulesFromLocalStorage().filter(m => selectedParcoursIds.includes(m.idparcour));
//     setModuleOptions(filteredModules.map(m => ({ value: m.id, label: m.name })));
//     setLessonOptions([]); 
//   };

//   const handleModulesChange = (selectedModules) => {
//     formik.setFieldValue("module", selectedModules.map(m => m.value));
//     const selectedModulesIds = selectedModules.map(m => m.value);
//     const filteredLessons = getLessonsFromLocalStorage().filter(l => selectedModulesIds.includes(l.idmodule));
//     setLessonOptions(filteredLessons.map(l => ({ value: l.id, label: l.name })));
//   };

//   const handleLessonsChange = (selectedLessons) => {
//     formik.setFieldValue("lesson", selectedLessons.map(l => l.value));
//   };

//   const handleDescriptionChange = (content) => {
//     formik.setFieldValue("note", content);
//   };

//   const handleFileChange = (event, type) => {
//     const files = Array.from(event.target.files);
//     setDisplayLinkInput(false);
//     setDisplayBookInput(false);
//     if (files.length > 0) {
//       if (type === "image") {
//         const newImages = files.map(file => ({
//           preview: URL.createObjectURL(file),
//           raw: file
//         }));
//         setImages([...images, ...newImages]); // Append new images
//         formik.setFieldValue("images", [...images, ...newImages].map(image => image.raw)); // Update formik values with raw images
//       } else {
//         const file = files[0];
//         const url = URL.createObjectURL(file);
//         if (type === "audio") {
//           setAudioFile({ preview: url, raw: file });
//           formik.setFieldValue("audio", file);
//         } else if (type === "pdf") {
//           setPdfFile({ preview: url, raw: file });
//           setPdfPreview(url);
//           formik.setFieldValue("pdf", file);
//         } else if (type === "video") {
//           setVideoFile({ preview: url, raw: file });
//           setVideoPreview(url);
//           formik.setFieldValue("video", file);
//         }
//       }
//     }
//   };

//   const handleClick = (type) => {
//     if (type === "image") {
//       hiddenFileInputImage.current.click();
//     } else if (type === "audio") {
//       hiddenFileInputAudio.current.click();
//     } else if (type === "pdf") {
//       hiddenFileInputPdf.current.click();
//     } else if (type === "video") {
//       hiddenFileInputVideo.current.click();
//     }
//   };

//   const removeFile = (type, index) => {
//     if (type === "image") {
//       const newImages = [...images];
//       newImages.splice(index, 1);
//       setImages(newImages);
//       formik.setFieldValue("images", newImages.map(image => image.raw));
//     } else if (type === "audio") {
//       setAudioFile(null);
//       formik.setFieldValue("audio", "");
//     } else if (type === "pdf") {
//       setPdfFile(null);
//       setPdfPreview("");
//       formik.setFieldValue("pdf", "");
//     } else if (type === "video") {
//       setVideoFile(null);
//       setVideoPreview("");
//       formik.setFieldValue("video", "");
//     }
//   };

//   const handleLinkChange = (event) => {
//     const value = event.target.value;
//     setLink(value);
//     formik.setFieldValue("link", value);
//     if (value) {
//       setDisplayBookInput(false);
//     }
//   };

//   const handleReferenceLivreChange = (event) => {
//     const value = event.target.value;
//     setReferenceLivre(value);
//     formik.setFieldValue("referenceLivre", value);
//     if (value) {
//       setDisplayLinkInput(false);
//     }
//   };

//   const handleFormatChange = (selectedOption) => {
//     formik.setFieldValue('format', selectedOption.value);
//   };

//   return (
//     <Container>
//       <Row className="justify-content-md-center">
//         <Col md={8}>
//           <Form onSubmit={formik.handleSubmit}>
//             <Form.Group controlId="nom">
//               <Form.Label>Nom de la ressource</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="nom"
//                 value={formik.values.nom}
//                 onChange={formik.handleChange}
//                 isInvalid={!!formik.errors.nom}
//               />
//               <Form.Control.Feedback type="invalid">
//                 {formik.errors.nom}
//               </Form.Control.Feedback>
//             </Form.Group>

//             <Form.Group controlId="format">
//               <Form.Label>Format</Form.Label>
//               <Select
//                 options={formatOptions}
//                 value={formatOptions.find(option => option.value === formik.values.format)}
//                 onChange={handleFormatChange}
//                 classNamePrefix="select"
//                 placeholder="Select format"
//                 isInvalid={!!formik.errors.format}
//               />
//               {formik.errors.format && (
//                 <div className="text-danger">{formik.errors.format}</div>
//               )}
//             </Form.Group>

//             <Form.Group controlId="parcours">
//               <Form.Label>Parcours</Form.Label>
//               <Select
//                 isMulti
//                 options={parcoursOptions}
//                 name="parcours"
//                 onChange={handleParcoursChange}
//                 classNamePrefix="select"
//                 components={{ Option: CheckboxOption }}
//               />
//               {formik.errors.parcours && (
//                 <div className="text-danger">{formik.errors.parcours}</div>
//               )}
//             </Form.Group>

//             <Form.Group controlId="modules">
//               <Form.Label>Modules</Form.Label>
//               <Select
//                 isMulti
//                 options={moduleOptions}
//                 name="module"
//                 onChange={handleModulesChange}
//                 classNamePrefix="select"
//                 components={{ Option: CheckboxOption }}
//               />
//               {formik.errors.module && (
//                 <div className="text-danger">{formik.errors.module}</div>
//               )}
//             </Form.Group>

//             <Form.Group controlId="lessons">
//               <Form.Label>Leçons</Form.Label>
//               <Select
//                 isMulti
//                 options={lessonOptions}
//                 name="lesson"
//                 onChange={handleLessonsChange}
//                 classNamePrefix="select"
//                 components={{ Option: CheckboxOption }}
//               />
//               {formik.errors.lesson && (
//                 <div className="text-danger">{formik.errors.lesson}</div>
//               )}
//             </Form.Group>

//             <Form.Group controlId="note">
//               <Form.Label>Note</Form.Label>
//               <RichTextEditor initialValue={formik.values.note} getValue={handleDescriptionChange} />
//               {formik.errors.note && (
//                 <div className="text-danger">{formik.errors.note}</div>
//               )}
//             </Form.Group>

//             <Form.Group>
//               <Form.Label>Options de téléchargement :</Form.Label>
//               <div className="d-flex justify-content-center">
//                 <Button
//                   onClick={() => handleClick("image")}
//                   className={`btn-tab-images ${images.length > 0 ? "active-images" : ""}`}
//                   disabled={!!(audioFile || pdfPreview || videoPreview || link || referenceLivre)}
//                 >
//                   <span>
//                     <FiImage size={35} />
//                     Télécharger des images
//                   </span>
//                 </Button>
//                 <input
//                   type="file"
//                   accept="image/png, image/jpeg"
//                   ref={hiddenFileInputImage}
//                   onChange={(event) => handleFileChange(event, "image")}
//                   multiple
//                   style={{ display: "none" }}
//                 />

//                 <Button
//                   onClick={() => handleClick("audio")}
//                   className={`btn-tab-audio ${audioFile ? "active-audio" : ""}`}
//                   disabled={!!(images.length > 0 || pdfPreview || videoPreview || link || referenceLivre)}
//                 >
//                   <span>
//                     <FiVolume2 size={35} />
//                     Télécharger un audio
//                   </span>
//                 </Button>
//                 <input
//                   type="file"
//                   accept="audio/*"
//                   ref={hiddenFileInputAudio}
//                   onChange={(event) => handleFileChange(event, "audio")}
//                   style={{ display: "none" }}
//                 />

//                 <Button
//                   onClick={() => handleClick("pdf")}
//                   className={`btn-tab-googleDrive ${pdfFile ? "active-googleDrive" : ""}`}
//                   disabled={!!(audioFile || images.length > 0 || videoPreview || link || referenceLivre)}
//                 >
//                   <span>
//                     <FiFile size={35} />
//                     Télécharger un PDF
//                   </span>
//                 </Button>
//                 <input
//                   type="file"
//                   accept="application/pdf"
//                   ref={hiddenFileInputPdf}
//                   onChange={(event) => handleFileChange(event, "pdf")}
//                   style={{ display: "none" }}
//                 />

//                 <Button
//                   onClick={() => handleClick("video")}
//                   className={`btn-tab-video ${videoFile ? "active-video" : ""}`}
//                   disabled={!!(audioFile || images.length > 0 || pdfPreview || link || referenceLivre)}
//                 >
//                   <span>
//                     <FiVideo size={35} />
//                     Télécharger une vidéo
//                   </span>
//                 </Button>
//                 <input
//                   type="file"
//                   accept="video/*"
//                   ref={hiddenFileInputVideo}
//                   onChange={(event) => handleFileChange(event, "video")}
//                   style={{ display: "none" }}
//                 />

//                 <Button
//                   onClick={() => {
//                     setDisplayLinkInput(true);
//                     setDisplayBookInput(false);
//                   }}
//                   className={`btn-tab-link ${displayLinkInput ? "active-link" : ""}`}
//                   disabled={!!(audioFile || images.length > 0 || pdfPreview || videoPreview || referenceLivre)}
//                 >
//                   <span>
//                     <FiLink size={35} />
//                     Ajouter un lien
//                   </span>
//                 </Button>

//                 <Button
//                   onClick={() => {
//                     setDisplayBookInput(true);
//                     setDisplayLinkInput(false);
//                   }}
//                   className={`btn-tab-book ${displayBookInput ? "active-book" : ""}`}
//                   disabled={!!(audioFile || images.length > 0 || pdfPreview || videoPreview || link)}
//                 >
//                   <span>
//                     <FiBook size={35} />
//                     Ajouter une référence de livre
//                   </span>
//                 </Button>
//               </div>
//             </Form.Group>

//             {displayLinkInput && (
//               <Form.Group controlId="link">
//                 <Form.Label>Lien externe</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="link"
//                   value={formik.values.link}
//                   onChange={handleLinkChange}
//                   isInvalid={!!formik.errors.link}
//                 />
//                 <Form.Control.Feedback type="invalid">
//                   {formik.errors.link}
//                 </Form.Control.Feedback>
//               </Form.Group>
//             )}

//             {displayBookInput && (
//               <Form.Group controlId="referenceLivre">
//                 <Form.Label>Référence du livre</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="referenceLivre"
//                   value={formik.values.referenceLivre}
//                   onChange={handleReferenceLivreChange}
//                   isInvalid={!!formik.errors.referenceLivre}
//                 />
//                 <Form.Control.Feedback type="invalid">
//                   {formik.errors.referenceLivre}
//                 </Form.Control.Feedback>
//               </Form.Group>
//             )}

//             <div className="image-preview-container">
//               {images.length > 0 && images.map((image, index) => (
//                 <div className="image-preview" key={index}>
//                   <img src={image.preview} alt={`Preview ${index}`} className="thumbnail-image" />
//                   <Button variant="outline-danger" onClick={() => removeFile("image", index)}>
//                     <FiTrash2 size={24} /> Supprimer
//                   </Button>
//                 </div>
//               ))}
//             </div>

//             {audioFile && (
//               <div className="audio-preview">
//                 <AudioPlayer audioFile={audioFile.preview} />
//                 <Button variant="outline-danger" onClick={() => removeFile("audio")}>
//                   <FiTrash2 size={24} /> Supprimer l'audio
//                 </Button>
//               </div>
//             )}

//             {pdfPreview && (
//               <div className="pdf-preview">
//                 <iframe src={pdfPreview} width="100%" height="500px" title="PDF Preview" />
//                 <Button variant="outline-danger" onClick={() => removeFile("pdf")}>
//                   <FiTrash2 size={24} /> Supprimer le PDF
//                 </Button>
//               </div>
//             )}

//             {videoPreview && (
//               <div className="video-preview">
//                 <video src={videoPreview} controls width="100%" />
//                 <Button variant="outline-danger" onClick={() => removeFile("video")}>
//                   <FiTrash2 size={24} /> Supprimer la vidéo
//                 </Button>
//               </div>
//             )}

//             <Button type="submit" className="mt-3">Enregistrer la ressource</Button>
//           </Form>
//         </Col>
//       </Row>
//     </Container>
//   );
// }
