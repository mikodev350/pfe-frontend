import React, { useState, useEffect, useRef, useMemo } from "react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import Select, { components } from "react-select";
import { useFormik } from "formik";
import { validationSchema } from "../../validator/addResourceValidator";
import { fetchDataAndStore, getParcoursFromLocalStorage, getModulesFromLocalStorage, getLessonsFromLocalStorage } from "../../api/apiDataSelect";
import RichTextEditor from "../../components/richTextEditor/RichTextEditor";
import AudioPlayer from "../../components/audioPlayer/AudioPlayer";
import { FiImage, FiTrash2, FiVolume2, FiFile, FiVideo, FiLink, FiBook } from "react-icons/fi";
import { getToken } from "../../util/authUtils";
import { uploadFile } from "../../api/apiUpload";
import { useParams } from "react-router-dom";
import { getResourceById, updateResource, addFileInToIndexedDB, syncOfflineChangesResource } from "../../api/apiResource";
import { useQueryClient } from "react-query";

const formatOptions = [
  { value: 'cours', label: 'Cours' },
  { value: 'devoir', label: 'Devoir' },
  { value: 'ressource numérique', label: 'Ressource Numérique' },
];

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
  const [bookReference, setBookReference] = useState("");
  const [displayLinkInput, setDisplayLinkInput] = useState(false);
  const [displayBookInput, setDisplayBookInput] = useState(false);

  const hiddenFileInputImage = useRef(null);
  const hiddenFileInputAudio = useRef(null);
  const hiddenFileInputPdf = useRef(null);
  const hiddenFileInputVideo = useRef(null);

  const token = useMemo(() => getToken(), []);


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
      module: [],
      lesson: [],
      note: "",
      youtubeLink: "",
      images: [],
      audio: "",
      pdf: "",
      video: "",
      link: "",
      bookReference: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        // Upload new images
        const newImages = await Promise.all(images.filter(image => image.raw).map(async (image) => {
          if (!navigator.onLine) {
            const id = await addFileInToIndexedDB(image.preview, image.raw);
            return { id, offline: true };
          } else {
            const uploadedImage = await uploadFile(image.raw, token);
            return { id: uploadedImage[0].id };
          }
        }));
        const existingImages = images.filter(image => !image.raw).map(image => ({ id: image.id }));
        values.images = [...existingImages, ...newImages];

        // Set audio file
        if (audioFile.raw) {
          if (!navigator.onLine) {
            const id = await addFileInToIndexedDB(audioFile.preview, audioFile.raw);
            values.audio = { id, offline: true };
          } else {
            const uploadedAudio = await uploadFile(audioFile.raw, token);
            values.audio = { preview: uploadedAudio[0].url, id: uploadedAudio[0].id };
          }
        } else if (audioFile.id) {
          values.audio = { preview: audioFile.preview, id: audioFile.id };
        } else {
          values.audio = null;
        }

        // Set pdf file
        if (pdfFile.raw) {
          if (!navigator.onLine) {
            const id = await addFileInToIndexedDB(pdfFile.preview, pdfFile.raw);
            values.pdf = { id, offline: true };
          } else {
            const uploadedPdf = await uploadFile(pdfFile.raw, token);
            values.pdf = { preview: uploadedPdf[0].url, id: uploadedPdf[0].id };
          }
        } else if (pdfFile.id) {
          values.pdf = { preview: pdfFile.preview, id: pdfFile.id };
        } else {
          values.pdf = null;
        }

        // Set video file
        if (videoFile.raw) {
          if (!navigator.onLine) {
            const id = await addFileInToIndexedDB(videoFile.preview, videoFile.raw);
            values.video = { id, offline: true };
          } else {
            const uploadedVideo = await uploadFile(videoFile.raw, token);
            values.video = { preview: uploadedVideo[0].url, id: uploadedVideo[0].id };
          }
        } else if (videoFile.id) {
          values.video = { preview: videoFile.preview, id: videoFile.id };
        } else {
          values.video = null;
        }

        // Filter out undefined images
        values.images = values.images.filter(image => image !== undefined);

        const response = await updateResource(id, values, token);
        if (response && response.data) {
          console.log("Resource updated successfully:", response);
          formik.resetForm();
          setImages([]);
          setAudioFile({ preview: "", id: null, raw: null });
          setPdfFile({ preview: "", id: null, raw: null });
          setVideoFile({ preview: "", id: null, raw: null });
          setLink("");
          setBookReference("");
          setDisplayLinkInput(false);
          setDisplayBookInput(false);
        } else {
          throw new Error("Failed to update resource");
        }
      } catch (error) {
        console.error("Error updating resource:", error);
      }
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchDataAndStore(token);
        const parcours = getParcoursFromLocalStorage();
        setParcoursOptions(parcours.map((p) => ({ value: p.id, label: p.name })));

        const resource = await getResourceById(id, token);

        console.log(resource.images);
        formik.setValues({
          nom: resource.nom,
          format: resource.format,
          parcours: resource.parcours.map((p) => p.id),
          module: resource.modules.map((m) => m.id),
          lesson: resource.lessons.map((l) => l.id),
          note: resource.note,
          youtubeLink: resource.youtubeLink,
          images: resource.images ? resource.images.map(image => ({ preview: image.url, id: image.id, raw: null })) : [],
          audio: resource.audio ? { preview: resource.audio.url, id: resource.audio.id, raw: null } : { preview: "", id: null, raw: null },
          pdf: resource.pdf ? { preview: resource.pdf.url, id: resource.pdf.id, raw: null } : { preview: "", id: null, raw: null },
          video: resource.video ? { preview: resource.video.url, id: resource.video.id, raw: null } : { preview: "", id: null, raw: null },
          link: resource.link || "",
          bookReference: resource.bookReference || "",
        });

        // Set states with the fetched data
        if (resource.images) setImages(resource.images.map(image => ({ preview: image.url, id: image.id, raw: null })));
        if (resource.audio) setAudioFile({ preview: resource.audio.url, id: resource.audio.id, raw: null });
        if (resource.pdf) setPdfFile({ preview: resource.pdf.url, id: resource.pdf.id, raw: null });
        if (resource.video) setVideoFile({ preview: resource.video.url, id: resource.video.id, raw: null });
        if (resource.link) setLink(resource.link);
        if (resource.bookReference) setBookReference(resource.bookReference);

        // Filter and set module options based on selected parcours
        const selectedParcoursIds = resource.parcours.map((p) => p.id);
        const filteredModules = getModulesFromLocalStorage().filter((m) => selectedParcoursIds.includes(m.idparcour));
        setModuleOptions(filteredModules.map((m) => ({ value: m.id, label: m.name })));

        // Filter and set lesson options based on selected modules
        const selectedModulesIds = resource.modules.map((m) => m.id);
        const filteredLessons = getLessonsFromLocalStorage().filter((l) => selectedModulesIds.includes(l.idmodule));
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
    formik.setFieldValue("module", selectedModules.map((m) => m.value).filter(Boolean));
    const selectedModulesIds = selectedModules.map((m) => m.value).filter(Boolean);
    const filteredLessons = getLessonsFromLocalStorage().filter((l) => selectedModulesIds.includes(l.idmodule));
    setLessonOptions(filteredLessons.map((l) => ({ value: l.id, label: l.name })));
  };

  const handleLessonsChange = (selectedLessons) => {
    formik.setFieldValue("lesson", selectedLessons.map((l) => l.value).filter(Boolean));
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
    setBookReference(value);
    formik.setFieldValue("bookReference", value);
    if (value) {
      setDisplayLinkInput(false);
    }
  };

  const handleFormatChange = (selectedOption) => {
    formik.setFieldValue("format", selectedOption.value);
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
                value={formatOptions.find((option) => option.value === formik.values.format)}
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
                name="module"
                onChange={handleModulesChange}
                classNamePrefix="select"
                components={{ Option: CheckboxOption }}
                value={moduleOptions.filter((m) => formik.values.module.includes(m.value))}
              />
              {formik.errors.module && (
                <div className="text-danger">{formik.errors.module}</div>
              )}
            </Form.Group>

            <Form.Group controlId="lessons">
              <Form.Label>Leçons</Form.Label>
              <Select
                isMulti
                options={lessonOptions}
                name="lesson"
                onChange={handleLessonsChange}
                classNamePrefix="select"
                components={{ Option: CheckboxOption }}
                value={lessonOptions.filter((l) => formik.values.lesson.includes(l.value))}
              />
              {formik.errors.lesson && (
                <div className="text-danger">{formik.errors.lesson}</div>
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
              <div className="d-flex justify-content-center">
                <Button
                  onClick={() => handleClick("image")}
                  className={`btn-tab-images ${images.length > 0 ? "active-images" : ""}`}
                  disabled={!!(audioFile.preview || pdfFile.preview || videoFile.preview || link || bookReference)}
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
                  className={`btn-tab-audio ${audioFile.preview ? "active-audio" : ""}`}
                  disabled={!!(images.length > 0 || pdfFile.preview || videoFile.preview || link || bookReference)}
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
                  className={`btn-tab-googleDrive ${pdfFile.preview ? "active-googleDrive" : ""}`}
                  disabled={!!(audioFile.preview || images.length > 0 || videoFile.preview || link || bookReference)}
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
                  className={`btn-tab-video ${videoFile.preview ? "active-video" : ""}`}
                  disabled={!!(audioFile.preview || images.length > 0 || pdfFile.preview || link || bookReference)}
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
                  disabled={!!(audioFile.preview || images.length > 0 || pdfFile.preview || videoFile.preview || bookReference)}
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
                  disabled={!!(audioFile.preview || images.length > 0 || pdfFile.preview || videoFile.preview || link)}
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
                <Form.Control.Feedback type="invalid">{formik.errors.link}</Form.Control.Feedback>
              </Form.Group>
            )}

            {displayBookInput && (
              <Form.Group controlId="bookReference">
                <Form.Label>Référence du livre</Form.Label>
                <Form.Control
                  type="text"
                  name="bookReference"
                  value={formik.values.bookReference}
                  onChange={handleBookReferenceChange}
                  isInvalid={!!formik.errors.bookReference}
                />
                <Form.Control.Feedback type="invalid">{formik.errors.bookReference}</Form.Control.Feedback>
              </Form.Group>
            )}

            <div className="image-preview-container">
              {images.length > 0 && images.map((image, index) => (
                <div className="image-preview" key={index}>
                  <img src={image.preview?.startsWith('blob') ? image.preview : `http://localhost:1337${image.preview}`} alt={`Preview ${index}`} className="thumbnail-image" />
                  <Button variant="outline-danger" onClick={() => removeFile("image", index)}>
                    <FiTrash2 size={24} /> Supprimer
                  </Button>
                </div>
              ))}
            </div>

            {audioFile.preview && (
              <div className="audio-preview">
                <AudioPlayer audioFile={audioFile.preview?.startsWith('blob') ? audioFile.preview : `http://localhost:1337${audioFile.preview}`} />
                <Button variant="outline-danger" onClick={() => removeFile("audio")}>
                  <FiTrash2 size={24} /> Supprimer l'audio
                </Button>
              </div>
            )}

            {pdfFile.preview && (
              <div className="pdf-preview">
                <iframe title="PDF Preview" src={pdfFile.preview?.startsWith('blob') ? pdfFile.preview : `http://localhost:1337${pdfFile.preview}`} width="100%" height="500px" />
                <Button variant="outline-danger" onClick={() => removeFile("pdf")}>
                  <FiTrash2 size={24} /> Supprimer le PDF
                </Button>
              </div>
            )}

            {videoFile.preview && (
              <div className="video-preview">
                <video src={videoFile.preview?.startsWith('blob') ? videoFile.preview : `http://localhost:1337${videoFile.preview}`} controls width="100%" />
                <Button variant="outline-danger" onClick={() => removeFile("video")}>
                  <FiTrash2 size={24} /> Supprimer la vidéo
                </Button>
              </div>
            )}

            <Button type="submit" className="mt-3">
              Mettre à jour la ressource
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
