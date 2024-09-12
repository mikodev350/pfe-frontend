import React from "react";
import { Accordion, Button, Col, Form, Row, Tab, Tabs } from "react-bootstrap";
import { FaArrowLeft, FaRegTrashAlt } from "react-icons/fa";

import Card from "react-bootstrap/Card";
import { accordionStyles } from "../../../components/all-devoirs/devoirCss";
import {
  getQuiz,
  postQuiz,
  updateQuistionQuiz,
  updateQuiz,
} from "../../../api/apiQuiz";
import { v4 as uuidv4 } from "uuid";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Retour from "../../../components/retour-arriere/Retour";

const StyledTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  color: #10266f;
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  border-bottom: 2px solid #3949ab;
  padding-bottom: 0.5rem;
`;
const CardStylled = styled(Card)`
  background-color: #fff !important;
  border-radius: 12px;
  padding: 25px;
  border: none;
  margin-bottom: 30px;
`;

const ButtonStylled = styled(Button)`
  max-width: 300px !important;
  width: 100% !important;
`;
const GradientButton = styled(Button)`
  background: linear-gradient(135deg, #10266f, #3949ab);
  border: 2px solid #10266f; /* Border matching the input */
  color: #ffffff;
  font-weight: bold;
  border-radius: 8px; /* Rounded corners to mimic input field */
  height: 50px; /* Match the height of the input */
  width: 100% !important;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  text-decoration: none !important;
  transition: border-color 0.3s ease-in-out, background 0.3s ease-in-out,
    transform 0.2s ease-in-out;

  &:hover {
    background: linear-gradient(
      135deg,
      #3949ab,
      #10266f
    ); /* Darken the gradient on hover */
    transform: translateY(-3px);
    border-color: #3949ab; /* Match border with background on hover */
  }

  &:focus {
    box-shadow: 0 0 0 0.2rem rgba(16, 38, 111, 0.25); /* Focus outline */
    outline: none; /* Remove default focus outline */
  }

  @media (max-width: 576px) {
    height: 45px; /* Adjust height for mobile */
    font-size: 1rem; /* Adjust font size for mobile */
    padding: 8px 16px; /* Adjust padding for mobile */
    width: 250px;
  }
`;
let placeholderquiz = {
  id: uuidv4(),
  question: "",
  vraixreponse: "",
  faussereponse: [
    {
      id: uuidv4(),
      reponse: "",
    },
  ],
};

export default function Quiz() {
  const [details, setDetails] = React.useState({
    titre: "",
    duration: 0,
  });
  const [initDetails, setInitDetails] = React.useState({
    titre: "",
    duration: 0,
  });
  const [initQuiz, setInitQuiz] = React.useState([placeholderquiz]);
  const [quiz, setQuiz] = React.useState([placeholderquiz]);

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const fetchQuiz = async () => {
    const result = await getQuiz({
      token: localStorage.getItem("token"),
      id: id,
    });
    const brigeDetails = {
      titre: result.titre,
      duration: result.duration,
    };
    const brigeQuiz = result.questions.map((item) => {
      const data = {
        id: item.id,
        question: item.question,
        vraixreponse: item.reponses.filter((ans) => !!ans.isCorrect)[0]
          ?.reponse,
        vraixreponseId: item.reponses.filter((ans) => !!ans.isCorrect)[0]?.id,
        faussereponse: item.reponses.filter((ans) => !ans.isCorrect),
      };
      return data;
    });
    setDetails(brigeDetails);
    setInitDetails(brigeDetails);
    setInitQuiz(JSON.parse(JSON.stringify(brigeQuiz)));
    setQuiz(brigeQuiz);
  };

  React.useEffect(() => {
    if (id) {
      fetchQuiz();
    }
  }, [id]);

  const onHandleChangeQuiz = (e) => {
    const { name, value } = e.target;

    if (name === "titre" || name === "duration") {
      setDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    } else {
      let updateQuiz = quiz.map((item) => {
        if (
          name.startsWith("desc") &&
          name.split(":")[1] === item.id.toString()
        ) {
          item.question = value;
        } else if (
          name.startsWith("vraixreponse") &&
          name.split(":")[1] === item.id.toString()
        ) {
          item.vraixreponse = value;
        } else if (name.startsWith("faussereponse")) {
          item.faussereponse = item.faussereponse.map((answer) => {
            if (answer.id.toString() === name.split(":")[1]) {
              answer.reponse = value;
            }
            return answer;
          });
        }
        return item;
      });
      setQuiz(updateQuiz);
    }
  };

  const onHanldeNewNewWrongAsnwer = ({ questionPosition }) => {
    let updateQuiz = quiz.map((item) => {
      if (item.id === questionPosition) {
        item.faussereponse.push({
          id: uuidv4(),
          reponse: "",
          new: true,
        });
      }
      return item;
    });
    setQuiz(updateQuiz);
  };

  const onHanldeNewNewQuiz = () => {
    setQuiz([
      ...quiz,
      {
        id: uuidv4(),
        question: "",
        vraixreponse: "",
        faussereponse: [
          {
            id: uuidv4(),
            reponse: "",
          },
        ],
      },
    ]);
  };

  const onhandleDeleteWrongAnswer = ({ id }) => {
    let updateQuiz = quiz.map((item) => {
      let updatedAnswers = item.faussereponse.filter((item) => item.id !== id);
      return { ...item, faussereponse: updatedAnswers };
    });
    setQuiz(updateQuiz);
  };

  const onHandleSaveChangesQuestion = async (item) => {
    const result = await updateQuistionQuiz({
      token: localStorage.getItem("token"),
      data: { question: item.questions, id: item.questions.id },
    });
    setInitQuiz(JSON.parse(JSON.stringify(quiz)));
    Swal.fire({
      title: "Success",
      text: "Saved",
      icon: "success",
    });
  };

  const onHandleSaveChangesQuiz = async () => {
    const result = await updateQuiz({
      token: localStorage.getItem("token"),
      data: { titre: details.titre, duration: details.duration, id },
    });
    setInitDetails({ titre: details.titre, duration: details.duration });
    Swal.fire({
      title: "Success",
      text: "Saved",
      icon: "success",
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    const result = await postQuiz({
      token: localStorage.getItem("token"),
      form: { ...details, quiz: quiz },
    });
    navigate(`/dashboard/quizzes`);
    Swal.fire({
      title: "Success",
      text: "Saved",
      icon: "success",
    });
  };

  const navigate = useNavigate();
  const handleBackToQuiz = () => {
    navigate(`/dashboard/quizzes`);
  };
  return (
    <>
      <Retour />
      <StyledTitle>
        {id ? "Modifier le QUIZ" : "Ajouter un NOUVEAU QUIZ"}
      </StyledTitle>

      <Form onSubmit={submit} style={{ paddingBottom: "200px" }}>
        <CardStylled style={{ marginBottom: "50px" }}>
          <Card.Body>
            <Row>
              <Col>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>Titre: *</Form.Label>
                  <Form.Control
                    name="titre"
                    type="text"
                    value={details.titre}
                    onChange={onHandleChangeQuiz}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>Durée: (min) *</Form.Label>
                  <Form.Control
                    name="duration"
                    type="number"
                    value={details.duration}
                    onChange={onHandleChangeQuiz}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            {id && (
              <Button
                variant="success"
                onClick={onHandleSaveChangesQuiz}
                disabled={
                  isNotChanged({
                    initData: initDetails.titre,
                    newData: details.titre,
                  }) &&
                  isNotChanged({
                    initData: Number(initDetails.duration),
                    newData: Number(details.duration),
                  })
                }
              >
                Enregistrer les modifications
              </Button>
            )}
          </Card.Body>
        </CardStylled>
        {/* <Tabs
          defaultActiveKey="1"
          id="uncontrolled-tab-example"
          className="mb-3"
          fill
        > */}
        <Accordion defaultActiveKey="0">
          {quiz.map((item, Qindex) => (
            <Accordion.Item
              key={item.id}
              eventKey={parseInt(Qindex + 1)}
              style={{ margin: "10px 0px" }}
            >
              <Accordion.Header style={{ borderRadius: "12px" }}>
                Question # {Qindex + 1}
              </Accordion.Header>
              <Accordion.Body>
                <h4>Question: {Qindex + 1}</h4>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>Question: *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name={`desc:${item.id}`}
                    value={item.question}
                    required
                    onChange={onHandleChangeQuiz}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formanswer">
                  <Form.Label>Bonne réponse</Form.Label>
                  <Form.Control
                    type="text"
                    name={`vraixreponse:${item.id}`}
                    placeholder="Bonne réponse"
                    value={item.vraixreponse}
                    required
                    onChange={onHandleChangeQuiz}
                  />
                </Form.Group>
                <hr />
                <Row>
                  {item.faussereponse.map((wrongAnswer, index) => (
                    <Col md={6} key={wrongAnswer.id}>
                      <div style={{ position: "relative" }}>
                        <Form.Group className="mb-3" controlId="formanswer">
                          <Form.Label>Mauvaise réponse {index + 1}</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder={`Mauvaise réponse ${index + 1}`}
                            name={`faussereponse:${wrongAnswer.id}`}
                            value={wrongAnswer?.reponse}
                            required
                            onChange={onHandleChangeQuiz}
                          />
                        </Form.Group>
                        {index !== 0 && (
                          <FaRegTrashAlt
                            style={{
                              position: "absolute",
                              top: 55,
                              right: 10,
                              color: "red",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              onhandleDeleteWrongAnswer({
                                id: wrongAnswer.id,
                              })
                            }
                          />
                        )}
                      </div>
                    </Col>
                  ))}
                  <Col md={12}>
                    <ButtonStylled
                      disabled={
                        item.faussereponse[item.faussereponse.length - 1]
                          ?.reponse.length === 0
                      }
                      onClick={() =>
                        onHanldeNewNewWrongAsnwer({
                          questionPosition: item.id,
                        })
                      }
                      style={{ width: "3002px !important" }}
                    >
                      Ajouter Mauvaise Réponse
                    </ButtonStylled>{" "}
                  </Col>
                </Row>

                {id && (
                  <ButtonStylled
                    variant="success"
                    disabled={
                      // item.faussereponse[item.faussereponse.length - 1]?.reponse
                      //   .length === 0 ||

                      isNotChanged({
                        initData: initQuiz[Qindex].faussereponse,
                        newData: item.faussereponse,
                      })
                    }
                    onClick={() =>
                      onHandleSaveChangesQuestion({
                        questions: item,
                      })
                    }
                    style={{ marginTop: "20px" }}
                  >
                    Enregistrer les modifications
                  </ButtonStylled>
                )}
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
        {/* </Tabs> */}
        {!id && (
          <Button variant="primary" onClick={onHanldeNewNewQuiz}>
            Nouveau Question
          </Button>
        )}
        {!id && (
          <>
            <hr />
            <Button variant="primary" type="submit" style={{ float: "right" }}>
              Soumettre
            </Button>
          </>
        )}
      </Form>
    </>
  );
}
function isNotChanged({ initData, newData }) {
  const data1 = trim(initData);
  const data2 = trim(newData);

  return JSON.stringify(data1) === JSON.stringify(data2);
}
function trim(data) {
  if (typeof data === "string") {
    return data.trim();
  }
  return data;
}
