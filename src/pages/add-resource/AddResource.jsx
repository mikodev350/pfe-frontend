import React, { useState, useRef } from "react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import Select, { components } from "react-select";
import { useFormik } from "formik";
import { validationSchema } from "../../validator/addResourceValidator";
import { saveResource } from "../../api/apiResource";
import { getAllParcours, getModulesByParcours, getLessonsByModule } from "../../api/apiData";
import RichTextEditor from "../../components/richTextEditor/RichTextEditor";
import YouTubeVideo from "../../components/youtube/YouTubeVideo";
import AudioPlayer from "../../components/audioPlayer/AudioPlayer";
import Loader from "../../components/loader/Loader";
import { FiImage, FiTrash2, FiVolume2, FiYoutube, FiFile, FiVideo, FiLink, FiBook } from "react-icons/fi";

const CheckboxOption = (props) => {
  return (
    <components.Option {...props}>
      <input
        type="checkbox"
        checked={props.isSelected}
        onChange={() => null}
      />{" "}
      <label>{props.label}</label>
    </components.Option>
  );
};

export default function AddResource() {
  const [parcoursOptions, setParcoursOptions] = useState([]);
  const [moduleOptions, setModuleOptions] = useState([]);
  const [lessonOptions, setLessonOptions] = useState([]);

  const [resources, setResources] = useState([]);
  const [image, setImage] = useState({ preview: "", raw: null });
  const [audioFile, setAudioFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfPreview, setPdfPreview] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [link, setLink] = useState("");
  const [bookReference, setBookReference] = useState("");
  const [displayLinkInput, setDisplayLinkInput] = useState(false);
  const [displayBookInput, setDisplayBookInput] = useState(false);

  const hiddenFileInputImage = useRef(null);
  const hiddenFileInputAudio = useRef(null);
  const hiddenFileInputPdf = useRef(null);
  const hiddenFileInputVideo = useRef(null);

  const formik = useFormik({
    initialValues: {
      resourceName: "",
      format: "",
      parcours: [],
      module: [],
      lesson: [],
      WriteText: "",
      youtubeLink: "",
      image: "",
      audio: "",
      pdf: "",
      video: "",
      link: "",
      bookReference: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const newResource = {
          id: Date.now(),  // Use timestamp as a unique identifier
          ...values,
        };
        setResources([...resources, newResource]);
        await saveResource(values);
        formik.resetForm();
        setImage({ preview: "", raw: null });
        setAudioFile(null);
        setPdfFile(null);
        setPdfPreview("");
        setVideoFile(null);
        setVideoPreview("");
        setLink("");
        setBookReference("");
        setDisplayLinkInput(false);
        setDisplayBookInput(false);
      } catch (error) {
        console.error("Error saving resource:", error);
      }
    },
  });

  React.useEffect(() => {
    const fetchData = async () => {
      const parcours = await getAllParcours();
      setParcoursOptions(parcours.map(p => ({ value: p.id, label: p.name })));
    };
    fetchData();
  }, []);

  const handleParcoursChange = async (selectedParcours) => {
    formik.setFieldValue("parcours", selectedParcours.map(p => p.value));
    const modules = await getModulesByParcours(selectedParcours.map(p => p.value));
    setModuleOptions(modules.map(m => ({ value: m.id, label: m.name })));
    setLessonOptions([]);  // Reset lessons when parcours change
  };

  const handleModulesChange = async (selectedModules) => {
    formik.setFieldValue("module", selectedModules.map(m => m.value));
    const lessons = await getLessonsByModule(selectedModules.map(m => m.value));
    setLessonOptions(lessons.map(l => ({ value: l.id, label: l.name })));
  };

  const handleLessonsChange = (selectedLessons) => {
    formik.setFieldValue("lesson", selectedLessons.map(l => l.value));
  };

  const handleDescriptionChange = React.useCallback(
    (content) => {
      formik.setFieldValue("WriteText", content);
    },
    [formik]
  );

  const handleFileChange = (event, type) => {
    const file = event.target.files[0];
    setDisplayLinkInput(false);
    setDisplayBookInput(false);
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === "image") {
        setImage({ preview: url, raw: file });
        formik.setFieldValue("image", file);
      } else if (type === "audio") {
        setAudioFile(file);
        formik.setFieldValue("audio", file);
      } else if (type === "pdf") {
        setPdfFile(file);
        setPdfPreview(url);
        formik.setFieldValue("pdf", file);
      } else if (type === "video") {
        setVideoFile(file);
        setVideoPreview(url);
        formik.setFieldValue("video", file);
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

  const removeFile = (type) => {
    if (type === "image") {
      setImage({ preview: "", raw: null });
      formik.setFieldValue("image", "");
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

  const handleBookReferenceChange = (event) => {
    const value = event.target.value;
    setBookReference(value);
    formik.setFieldValue("bookReference", value);
    if (value) {
      setDisplayLinkInput(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={8}>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group controlId="resourceName">
              <Form.Label>Resource Name</Form.Label>
              <Form.Control
                type="text"
                name="resourceName"
                value={formik.values.resourceName}
                onChange={formik.handleChange}
                isInvalid={!!formik.errors.resourceName}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.resourceName}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="format">
              <Form.Label>Format</Form.Label>
              <Form.Control
                as="select"
                name="format"
                value={formik.values.format}
                onChange={formik.handleChange}
                isInvalid={!!formik.errors.format}
              >
                <option value="">Select format</option>
                <option value="cours">Cours</option>
                <option value="devoir">Devoir</option>
                <option value="ressource numérique">Ressource Numérique</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {formik.errors.format}
              </Form.Control.Feedback>
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
                name="module"
                onChange={handleModulesChange}
                classNamePrefix="select"
                components={{ Option: CheckboxOption }}
              />
              {formik.errors.module && (
                <div className="text-danger">{formik.errors.module}</div>
              )}
            </Form.Group>

            <Form.Group controlId="lessons">
              <Form.Label>Lessons</Form.Label>
              <Select
                isMulti
                options={lessonOptions}
                name="lesson"
                onChange={handleLessonsChange}
                classNamePrefix="select"
                components={{ Option: CheckboxOption }}
              />
              {formik.errors.lesson && (
                <div className="text-danger">{formik.errors.lesson}</div>
              )}
            </Form.Group>

            <Form.Group controlId="note">
              <Form.Label>Note</Form.Label>
              <RichTextEditor
                initialValue={formik.values.WriteText}
                getValue={handleDescriptionChange}
              />
              {formik.errors.WriteText && (
                <div className="text-danger">{formik.errors.WriteText}</div>
              )}
            </Form.Group>

            <Form.Group controlId="youtubeLink">
              <Form.Label>YouTube Link</Form.Label>
              <Form.Control
                type="text"
                name="youtubeLink"
                value={formik.values.youtubeLink}
                onChange={formik.handleChange}
                isInvalid={!!formik.errors.youtubeLink}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.youtubeLink}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Upload Options:</Form.Label>
              <div className="d-flex justify-content-center">
                <Button
                  onClick={() => handleClick("image")}
                  className={`btn-tab-images ${image.preview ? "active-images" : ""}`}
                  disabled={!!(audioFile || formik.values.youtubeLink || pdfPreview || videoPreview || link || bookReference)}
                >
                  <span>
                    <FiImage size={35} />
                    Upload Image
                  </span>
                </Button>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  ref={hiddenFileInputImage}
                  onChange={(event) => handleFileChange(event, "image")}
                  style={{ display: "none" }}
                />

                <Button
                  onClick={() => handleClick("audio")}
                  className={`btn-tab-audio ${audioFile ? "active-audio" : ""}`}
                  disabled={!!(image.preview || formik.values.youtubeLink || pdfPreview || videoPreview || link || bookReference)}
                >
                  <span>
                    <FiVolume2 size={35} />
                    Upload Audio
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
                  disabled={!!(audioFile || image.preview || formik.values.youtubeLink || videoPreview || link || bookReference)}
                >
                  <span>
                    <FiFile size={35} />
                    Upload PDF
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
                  className={`btn-tab-video ${videoPreview ? "active-video" : ""}`}
                  disabled={!!(audioFile || image.preview || formik.values.youtubeLink || pdfPreview || link || bookReference)}
                >
                  <span>
                    <FiVideo size={35} />
                    Upload Video
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
                  disabled={!!(audioFile || image.preview || formik.values.youtubeLink || pdfPreview || videoPreview || bookReference)}
                >
                  <span>
                    <FiLink size={35} />
                    Add Link
                  </span>
                </Button>

                <Button
                  onClick={() => {
                    setDisplayBookInput(true);
                    setDisplayLinkInput(false);
                  }}
                  className={`btn-tab-book ${displayBookInput ? "active-book" : ""}`}
                  disabled={!!(audioFile || image.preview || formik.values.youtubeLink || pdfPreview || videoPreview || link)}
                >
                  <span>
                    <FiBook size={35} />
                    Add Book Reference
                  </span>
                </Button>
              </div>
            </Form.Group>

            {displayLinkInput && (
              <Form.Group controlId="link">
                <Form.Label>External Link</Form.Label>
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
              <Form.Group controlId="bookReference">
                <Form.Label>Book Reference</Form.Label>
                <Form.Control
                  type="text"
                  name="bookReference"
                  value={formik.values.bookReference}
                  onChange={handleBookReferenceChange}
                  isInvalid={!!formik.errors.bookReference}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.bookReference}
                </Form.Control.Feedback>
              </Form.Group>
            )}

            {image.preview && (
              <div className="image-preview">
                <img src={image.preview} alt="Preview" style={{ width: "100%", height: "auto" }} />
                <Button variant="outline-danger" onClick={() => removeFile("image")}>
                  <FiTrash2 size={24} /> Remove Image
                </Button>
              </div>
            )}

            {audioFile && (
              <div className="audio-preview">
                <AudioPlayer audioFile={audioFile} />
                <Button variant="outline-danger" onClick={() => removeFile("audio")}>
                  <FiTrash2 size={24} /> Remove Audio
                </Button>
              </div>
            )}

            {pdfPreview && (
              <div className="pdf-preview">
                <iframe src={pdfPreview} width="100%" height="500px" />
                <Button variant="outline-danger" onClick={() => removeFile("pdf")}>
                  <FiTrash2 size={24} /> Remove PDF
                </Button>
              </div>
            )}

            {videoPreview && (
              <div className="video-preview">
                <video src={videoPreview} controls width="100%" />
                <Button variant="outline-danger" onClick={() => removeFile("video")}>
                  <FiTrash2 size={24} /> Remove Video
                </Button>
              </div>
            )}

            <Button type="submit" className="mt-3">Save Resource</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
