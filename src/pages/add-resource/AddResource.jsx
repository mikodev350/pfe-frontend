import React from "react";
import { Col, Button, Form, Container, Row } from "react-bootstrap";
import { useLocation, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiImage, FiTrash2, FiVolume2, FiYoutube,FiFile,FiVideo } from "react-icons/fi";

import YouTubeVideo from "../../components/youtube/YouTubeVideo";
import { useFormik } from "formik";

// import { initialValues } from "../../util/config.question";
// import { addExam } from "../../features/examSlices";
import AudioPlayer from "../../components/audioPlayer/AudioPlayer";
import { validationSchema } from "../../validator/addResourceValidator";
// import { fetchExamById } from "../../api/apiExams";
import { saveQuestion } from "../../api/apiQuestion";
import Loader from "../../components/loader/Loader";
import RichTextEditor from "../../components/richTextEditor/RichTextEditor";

export default function AddResource() {


 const [image, setImage] = React.useState({ preview: "", raw: null });
  const [audioFile, setAudioFile] = React.useState(null);
const [pdfFile, setPdfFile] = React.useState(null);  // State for PDF file
    const [pdfPreview, setPdfPreview] = React.useState(""); // State for PDF preview URL  const hiddenFileInput = React.useRef(null);
  
  const hiddenFileInput = React.useRef(null);
    const hiddenFileInputAudio = React.useRef(null);
    const hiddenFileInputPdf = React.useRef(null);  // Ref for PDF input
  const [displayInput, setDisplayInput] = React.useState(false);
  const [displayDrive, setDisplayDrive] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const examId = searchParams.get("examId");
  const dispatch = useDispatch();
const formik = useFormik({
 initialValues: {
  WriteText: "",
  image: "",  // This will store the URL or a reference to the image file
  youtubeLink: "",
  justificateAnwser: "",
  audio: "",  // This will store the URL or a reference to the audio file
  pdf: "",    // This will store the URL or a reference to the PDF file
    video: "",    // This will store the URL or a reference to the PDF file

},
  validationSchema: validationSchema,
  onSubmit: async (values) => {
    setIsLoading(true);
          console.log('====================================');
      console.log(values);
      console.log('====================================');
    try {

      const savedQuestion = await saveQuestion(values, Number(examId));
      if (savedQuestion) {
        formik.resetForm();
        setImage({ preview: "", raw: null });
        setAudioFile(null);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error while saving question:", error);
      setIsLoading(false);
    }
  },
});

console.log(formik);  // Check what's inside formik

    function RemoveButtonyoutube() {
    const youtubeButton = document.querySelector(".btn-tab-youtube");
    if (youtubeButton) {
      youtubeButton.classList.remove("active-youtube");
    }
  }
  function RemoveButtonGoogleDrive() {
    const googleDriveButton = document.querySelector(".btn-tab-googleDrive");
    if (googleDriveButton) {
      googleDriveButton.classList.remove("active-googleDrive");
    }
  }
  /*************************************************************************************/
  
const [videoFile, setVideoFile] = React.useState(null);
const [videoPreview, setVideoPreview] = React.useState("");
const hiddenFileInputVideo = React.useRef(null);


  const handleVideoChange = (event) => {
  const file = event.target.files ? event.target.files[0] : null;
  if (file && file.type.startsWith('video')) {
    setVideoFile(file);
    const previewUrl = URL.createObjectURL(file);
    setVideoPreview(previewUrl);
    formik.setFieldValue("video", file); // Ensure your formik setup handles a 'video' field
  }
};

const handleClickVideo = () => {
  hiddenFileInputVideo.current && hiddenFileInputVideo.current.click();
};
  /**************************************************************************************/  
  React.useEffect(() => {
    const fetchExamDetails = async () => {
      if (examId) {
        try {
          // const examDetails = await fetchExamById(parseInt(examId));
          // dispatch(addExam(examDetails));
        } catch (error) {
          console.error("Error fetching exam details:", error);
        }
      }
    };

    fetchExamDetails();
  }, [examId, dispatch]);
/*************************************************************************************/ 
const handleChange = (event) => {
  const file = event.target.files ? event.target.files[0] : null;
  if (file) {
    // Create a URL for the file
    const imageUrl = URL.createObjectURL(file);
    setImage({
      preview: imageUrl,
      raw: file
    });
    formik.setFieldValue("image", imageUrl);
  }
};

/******************************************************************************/ 
const handleAudioChange = (event) => {
  const file = event.target.files ? event.target.files[0] : null;
  if (file) {
    // Create a URL for the audio file
    const audioUrl = URL.createObjectURL(file);
    setAudioFile(file);
    formik.setFieldValue("audio", audioUrl);
  }
};


  const handleClick = () => hiddenFileInput.current && hiddenFileInput.current.click();
  const handleClickAudio = () => hiddenFileInputAudio.current && hiddenFileInputAudio.current.click();


  const handleChangeTextQuestion = React.useCallback(
    (newContent) => {
      formik.setFieldValue("WriteText", newContent);
      formik.setFieldTouched("WriteText", true);
    },
    [formik]
  );


  const removeImg = () => {
    setImage({
      preview: "",
      raw: null, // Correctly set this to null instead of an empty string
    });

  }

  /********************************************************************/
  /**************  removePdf    ***************************/ 
  const removePdf = () => {
    setPdfFile(null); // Assuming you have a state called pdfFile
    setPdfPreview(""); // Assuming you have a state called pdfPreview for storing the URL
    formik.setFieldValue("pdf", null); // Adjust this if your field name in Formik differs
};
  /********************************************************************/
  /**************  removeVideo    ***************************/ 
const removeVideo = () => {
    setVideoFile(null); // Assuming you have a state called videoFile
    setVideoPreview(""); // Assuming you have a state called videoPreview for storing the URL
    formik.setFieldValue("video", null); // Adjust this if your field name in Formik differs
};

 
const handleDriveLinkChange = (event) => {
  const inputDriveLink = event.target.value;

  // Use a regular expression to extract the ID from the Google Drive link
  const idMatch = inputDriveLink.match(/[-\w]{25,}/);

  if (idMatch) {
    const fullDriveUrl = `https://drive.google.com/uc?id=${idMatch[0]}`;
    formik.setFieldValue("driveLinkImage", fullDriveUrl);
  } else {
    formik.setFieldValue("driveLinkImage", inputDriveLink);
  }
};

    const deleteAudio = () => {
    setAudioFile(null);

    formik.setFieldValue("audio", "");
    formik.setFieldTouched("audio", false);
  };

  const YoutubeShowDisplay = (event) => {
  if (!displayInput) {
    setDisplayInput(true);
    setDisplayDrive(false);
    event.currentTarget.classList.add("active-youtube");
    RemoveButtonGoogleDrive();
  } else {
    setDisplayInput(false);
    event.currentTarget.classList.remove("active-youtube");
  }
};
/****************************************************************************/
const driveShowDisplay = (event) => {
  if (!displayDrive) {
    setDisplayDrive(true);
    setDisplayInput(false);
    event.currentTarget.classList.add("active-googleDrive");
    RemoveButtonyoutube();
  } else {
    setDisplayDrive(false);
    event.currentTarget.classList.remove("active-googleDrive");
  }
};

/*********************************************************************************/
const handlePdfChange = (event) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file && file.type === "application/pdf") {
            setPdfFile(file);
            const previewUrl = URL.createObjectURL(file);
            setPdfPreview(previewUrl); // Set the preview URL
            formik.setFieldValue("pdf", file);
        }
    };

    const handleClickPdf = () => {
        hiddenFileInputPdf.current && hiddenFileInputPdf.current.click();
    };


 return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <Container className="baground-exam ">
          <Row className="padding-row-top margin-left padding-form ">
            <Form
  onSubmit={(event) => {
    event.preventDefault();
    formik.handleSubmit();
    // You can call additional functions here if needed, like resetting a rich text editor
  }}
  className="mt-5"
>
              {" "}
              <h3 className="text-center ">Add new resource </h3>

              <Form.Group
                className="mt-5 mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label className="Font">Write the text : </Form.Label>

                <Col md={12}>
                  <RichTextEditor
                    initialValue={formik.values.WriteText || ""}
                    getValue={handleChangeTextQuestion}
                    isUpdate={formik.values.WriteText ? true : false}
                    // resetContent={resetEditorContent}
                  />
                  <br />
                  {formik.touched.WriteText && formik.errors.WriteText && (
                    <div className="text-danger">
                      {formik.errors.WriteText}
                    </div>
                  )}
                </Col>
              </Form.Group>
              <Form.Group>
                    <Container className="d-flex justify-content-center">
                                      <Row className="">

    <Col sm={12} className="mb-3">
                      <Form.Label className="Font">Choose to upload  : </Form.Label>

                <div className="justify-content-center">
                    <Button
                      className={`btn-tab-youtube ${formik.values.youtubeLink ? "active-youtube" : ""}`}
                      style={{
                        width: "200px !important",
                        height: "200px !important",
                      }}
                      onClick={YoutubeShowDisplay}
                    disabled={!!(audioFile || image.preview || pdfPreview || videoPreview)}
                    >
                      <span>
                        <FiYoutube size={35} />
                        <br />
                        Add Link
                      </span>
                    </Button>{" "}
{/* ********************************************************************************************* */}
                            <Button onClick={handleClickPdf} 
                            
                      className={`btn-tab-googleDrive ${pdfFile ? "active-googleDrive" : ""}`}
                    disabled={!!(audioFile || image.preview || formik.values.youtubeLink || videoPreview)}
                      style={{
                        width: "200px !important",
                        height: "200px !important",
                      }}
                      
                            // className="btn-tab-pdf"
                            
                            >
                                <FiFile size={35} />
                                Upload PDF
                            </Button>
                            <input
                                type="file"
                                accept="application/pdf"
                                ref={hiddenFileInputPdf}
                                onChange={handlePdfChange}
                                style={{ display: "none" }}
                            />
                         
                    <Button
                     className={`btn-tab-images ${image.preview ? "active-images" : ""}`}
                    onClick={handleClick}
                    disabled={!!(audioFile || formik.values.youtubeLink || pdfPreview || videoPreview)}
                    >
                      <span>
                        <FiImage size={35} />
                        Upload
                      </span>
                    </Button>{" "}
                    <input
                      type="file"
                      accept="image/png, image/jpeg"
                      ref={hiddenFileInput}
                      onChange={handleChange}
                      style={{ display: "none" }}
                    />
                 
                    <Button
                      style={{
                        width: "200px !important",
                        height: "200px !important",
                      }}
className={`btn-tab-audio ${audioFile ? "active-audio" : ""}`}
                    onClick={handleClickAudio}
                    disabled={!!(image.preview || formik.values.youtubeLink || pdfPreview || videoPreview)}
                    >
                      <span>
                        <FiVolume2 size={35} />
                        <br />
                        Upload Audio
                      </span>
                    </Button>{" "}
                    <input
                      type="file"
                      accept="audio/*"
                      ref={hiddenFileInputAudio}
                      onChange={handleAudioChange}
                      style={{ display: "none" }}
                    />
                   {/* *************************************************************** */}
  <Button
      style={{
                        width: "200px !important",
                        height: "200px !important",
                      }}
     className={`btn-tab-video ${videoPreview ? "active-video" : ""}`}
                    onClick={handleClickVideo}
                    disabled={!!(audioFile || image.preview || formik.values.youtubeLink || pdfPreview)}
  >
    <span>
      <FiVideo size={35} />
      <br />
      Upload Video
    </span>
  </Button>{" "}
  <input
    type="file"
    accept="video/*"
    ref={hiddenFileInputVideo}
    onChange={handleVideoChange}
    style={{ display: "none" }}
  />
</div>

               

                {/* ************************************************************************************ */}
                </Col>
                                </Row>

                </Container>
              </Form.Group>


{/* ************************************************************************************* */}

   {videoPreview && (
    <div className="video-preview ">
            <video src={videoPreview} controls width="100%" />
                <div className="d-flex justify-content-center">
             <button  onClick={removeVideo} style={{ marginTop: '10px', backgroundColor: 'red', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Remove Video
        </button>
        </div>
            {/* <button onClick={removeVideo}>Remove Video</button> */}
        </div>
    )}

{/* ***************************************************** */}













              <Form.Group className="mb-3 " controlId="Audio">
                {image.preview ? (
                  <div
                    style={{
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "0",
                        right: "0",
                        left: "0",
                        bottom: "0",
                        zIndex: 2,
                        backgroundColor: "rgba(0, 0, 0, 0.250)",
                        borderRadius: "15px",
                      }}
                    ></div>
                    <div
                      style={{
                        position: "absolute",
                        zIndex: " 3",
                        color: "white",
                        top: "calc(80% - 25px)",
                        right: "calc(50% - 25px)",
                        height: "50px",
                        width: "50px",
                        paddingTop: "10px",
                        paddingLeft: "12px",
                        borderRadius: "100%",
                        backgroundColor: "#A71D11",
                        cursor: "pointer",
                      }}
                      onClick={removeImg}
                    >
                      <FiTrash2 size={24} />
                    </div>
                    <img
                      src={image.preview}
                      alt="dummy"
                      style={{
                        objectFit: "contain",
                        width: "100%",
                        height: "300px",
                      }}
                      className="Img-brd"
                    />
                  </div>
                ) : null}

                {audioFile && formik.values.audio ? ( // Utilisez la condition pour vérifier si audioFile est défini
                  <div className="d-flex justify-content-center align-items-center">
                    <AudioPlayer audioFile={audioFile} />
                    <div>
                      {" "}
                      <Button variant="outline-danger" onClick={deleteAudio}>
                        <FiTrash2 size={24} />
                      </Button>{" "}
                    </div>
                  </div>
                ) : null}
                {displayInput && !(audioFile || formik.values.youtubeLink || pdfPreview || videoPreview) && (
                  <Row>
                    <Form.Label className="Font">Link youtube </Form.Label>
                    <Col xs={12} md={12} lg={12}>
                      <Form.Control
                        type="text"
                        placeholder="Put YouTube Link"
                        name="youtubeLink"
                        value={formik.values.youtubeLink}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={
                          formik.touched.youtubeLink &&
                          !!formik.errors.youtubeLink
                        }
                      />
                      {formik.touched.youtubeLink &&
                        formik.errors.youtubeLink && (
                          <div className="text-danger text-center">
                            {formik.errors.youtubeLink}
                          </div>
                        )}
                    </Col>
                    <Col>
                      {formik.values.youtubeLink ? (
                        <>
                          <div className="d-flex justify-content-center align-items-center">
                            <YouTubeVideo videoId={formik.values.youtubeLink} />
                          </div>
                        </>
                      ) : null}
                    </Col>
                  </Row>
                )}



{/* display pdff  */}
   {pdfPreview && (
                                <div className="pdf-preview ">
                                    <iframe src={pdfPreview} width="100%" height="500px" />
                                    <div className="d-flex justify-content-center">
                                     <button  onClick={removePdf} style={{ marginTop: '10px', backgroundColor: 'red', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Remove PDF
            
        </button>
        </div>
                                </div>
                                
                            )}

                {displayDrive && !displayInput && (
                  <Row>
                    <Form.Label className="Font">drive Link : </Form.Label>
                    <Col xs={12} md={12} lg={12}>
                      <Form.Control
                        type="text"
                        placeholder="Put drive Link"
                        name="driveLinkImage"
                        value={formik.values.driveLinkImage}
                        onChange={handleDriveLinkChange}
                        onBlur={formik.handleBlur}
                        isInvalid={
                          formik.touched.driveLinkImage &&
                          !!formik.errors.driveLinkImage
                        }
                      />
                      {formik.touched.driveLinkImage &&
                        formik.errors.driveLinkImage && (
                          <div className="text-danger text-center">
                            {formik.errors.driveLinkImage }
                          </div>
                        )}
                    </Col>
                    <Col>
                      {formik.values.driveLinkImage ? (
                        <>
                          <div className="d-flex justify-content-center align-items-center">
                            {/* <YouTubeVideo
                            videoId={formik.values.driveLinkImage}
                          /> */}
                            <img
                              src={formik.values.driveLinkImage}
                              style={{
                                objectFit: "contain",
                                width: "100%",
                                height: "300px",
                              }}
                              className="Img-brd"
                              alt=""
                            />
                          </div>
                        </>
                      ) : null}
                    </Col>

                  </Row>
                )}
              </Form.Group>
    
               <div className="d-flex justify-content-center">
                  <Col md={4} >
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isLoading}
                    >
                      Save
                    </Button>
                  </Col>
              </div>
<br />
            </Form>
          </Row>
        </Container>
      )}
    </>
  );
}














// import React from "react";
// import { Button, Form, Container, Row } from "react-bootstrap";
// import Select from "react-select";

// import Col from "react-bootstrap/Col";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { useFormik } from "formik";
// import { initialValues, validationSchema } from "../../util/config.resource";
// import { getAllSectionsWithoutPagination, getSectionForExam } from "../../api/apiSection";
// import { useNavigate, useLocation } from "react-router-dom";
// import { saveExam } from "../../api/apiExams";
// import { getToken } from "../../util/authUtils";
// import RichTextEditor from "../../components/richTextEditor/RichTextEditor";

// export default function AddResource() {
//   const navigate = useNavigate();
//   const token = React.useMemo(() => getToken(), []);

//   const location = useLocation();
//   const searchParams = React.useMemo(
//     () => new URLSearchParams(location.search),
//     [location.search]
//   );

//   const [sectionIdRef, setSectionIdRef] = React.useState();
//   const [options, setOptions] = React.useState([]);

//   const handleChangeAfterExam = (text) => {
//     formik.setFieldValue("textAfterExam", text);
//     formik.setFieldTouched("textAfterExam", true);
//   };

//   const handleChangeBeforeExam = (text) => {
//     formik.setFieldValue("textBeforeExam", text);
//     formik.setFieldTouched("textBeforeExam", true);
//   };

//   const filterPassedTime = (time) => {
//     const currentDate = new Date();
//     const selectedDate = new Date(time);
//     return currentDate.getTime() < selectedDate.getTime();
//   };

//   const filterEndTime = (time) => {
//     const currentDate = new Date();
//     const selectedDate = new Date(time);

//     if (formik.values.examStartDate) {
//       return formik.values.examStartDate.getTime() < selectedDate.getTime();
//     } else {
//       return currentDate.getTime() < selectedDate.getTime();
//     }
//   };

//   const handleStartDate = (date) => {
//     const examEndDate = new Date(date.getTime() + 30 * 60 * 1000);

//     formik.setFieldValue("examStartDate", date);
//     formik.setFieldValue("examEndDate", examEndDate);
//   };
//   const handleEndDate = (date) => {
//     formik.setFieldValue("examEndDate", date);
//   };

//   const handleSubmit = async (values) => {
//     const results = await saveExam(values, sectionIdRef, token || "");
//     if (results) {
//       navigate(`/teacher/add-question?examId=${results.id}`);
//     }
//   };

//   const config = {
//     initialValues: initialValues,
//     validationSchema: validationSchema,
//     onSubmit: handleSubmit,
//   };

//   const formik = useFormik(config);

//   React.useEffect(() => {
//     const fetchSection = async () => {
//       try {
//         if (searchParams.get("sectionId")) {
//           const sectionId = searchParams.get("sectionId");
//           const { name, id } = await getSectionForExam(Number(sectionId), token || "");
//           setSectionIdRef(id);
//           formik.setFieldValue("PublicSection", name);
//         } else {
//           const sections = await getAllSectionsWithoutPagination(token || "");
//           setOptions(sections);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchSection();
//   }, [searchParams, token]);

//   return (
//   <Container className="background-exam" style={{ marginBottom: "100px" }}>
//     <Row className="padding-row-top margin-left padding-form">
//       <h3 className="text-center">New Exam</h3>
//       <Form
//         className="mt-5"
//         onSubmit={(event) => {
//           event.preventDefault();
//           formik.handleSubmit();
//         }}
//       >
//         <Form.Group className="mt-4" controlId="Title">
//           <Form.Label className="Font">Title of Exam:</Form.Label>
//           <Form.Control
//             type="text"
//             name="title"
//             value={formik.values.title}
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             className={formik.touched.title && formik.errors.title ? "form-control is-invalid" : "form-control"}
//           />
//           {formik.touched.title && formik.errors.title && (
//             <div className="text-danger">{formik.errors.title}</div>
//           )}
//         </Form.Group>

//         <Form.Group className="mt-4">
//           <Form.Check
//             type="switch"
//             id="custom-switch"
//             label="Public Exam"
//             name="isPublic"
//             checked={formik.values.isPublic}
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//           />
//           {formik.values.isPublic && (
//             <div style={{ margin: "10px 0px" }} className="alert alert-warning" role="alert">
//               Warning: if you choose public exam, every visitor can take this exam.
//             </div>
//           )}
//         </Form.Group>

//         <Form.Group className="mt-3" controlId="sections">
//           <Form.Label className="Font">Section of the Exams:</Form.Label>
//           <Select
//             options={options}
//             isSearchable={true}
//             name="sections"
//             onChange={(selectedOption) => {
//               setSectionIdRef(Number(selectedOption.value));
//               formik.setFieldValue("section", selectedOption);
//             }}
//             classNamePrefix="select"
//           />
//         </Form.Group>

//         <Form.Group className="mt-4" controlId="exampleForm.ControlTextarea1">
//           <Form.Label className="Font">Instructions Before Starting Exam</Form.Label>
//           <Col md={12}>
//             <RichTextEditor
//               initialValue={formik.values.textBeforeExam}
//               getValue={handleChangeBeforeExam}
//             />
//             {formik.touched.textBeforeExam && formik.errors.textBeforeExam && (
//               <div className="text-danger">{formik.errors.textBeforeExam}</div>
//             )}
//           </Col>
//         </Form.Group>

//         <Form.Group className="mt-4" controlId="exampleForm.ControlTextarea1">
//           <Form.Label className="Font">Instructions After Starting Exam</Form.Label>
//           <Col md={12}>
//             <RichTextEditor
//               initialValue={formik.values.textAfterExam}
//               getValue={handleChangeAfterExam}
//             />
//             {formik.touched.textAfterExam && formik.errors.textAfterExam && (
//               <div className="text-danger">{formik.errors.textAfterExam}</div>
//             )}
//           </Col>
//         </Form.Group>

//         <Form.Group className="mt-4">
//           <Row>
//             <Col md={6}>
//               <Form.Label>Exam Start:</Form.Label>
//               <DatePicker
//                 selectsStart
//                 className="date-inputs"
//                 name="examStartDate"
//                 selected={formik.values.examStartDate}
//                 onChange={handleStartDate}
//                 minDate={new Date()}
//                 filterTime={filterPassedTime}
//                 showTimeSelect
//                 dateFormat="MMMM d, yyyy h:mm aa"
//               />
//               {formik.touched.examStartDate && formik.errors.examStartDate && (
//                 <div className="text-danger">{formik.errors.examStartDate}</div>
//               )}
//             </Col>
//             <Col md={6}>
//               <Form.Label>Exam End:</Form.Label>
//               <DatePicker
//                 selectsEnd
//                 className="date-inputs"
//                 name="examEndDate"
//                 selected={formik.values.examEndDate}
//                 onChange={handleEndDate}
//                 minDate={formik.values.examStartDate}
//                 filterTime={filterEndTime}
//                 showTimeSelect
//                 dateFormat="MMMM d, yyyy h:mm aa"
//               />
//               {formik.touched.examEndDate && formik.errors.examEndDate && (
//                 <div className="text-danger">{formik.errors.examEndDate}</div>
//               )}
//             </Col>
//           </Row>
//         </Form.Group>

//         <div className="mb-2 mt-5 d-flex justify-content-center">
//           <Button type="submit" className="button-save btn-color" size="lg">
//             Save
//           </Button>
//         </div>
//       </Form>
//     </Row>
//   </Container>
// );

// }
