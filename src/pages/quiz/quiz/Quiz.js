import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Tab, Tabs } from "react-bootstrap";
import { FaArrowLeft, FaRegTrashAlt } from "react-icons/fa";
import Card from "react-bootstrap/Card";
import { v4 as uuidv4 } from "uuid";
import { useSearchParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getQuiz, postQuiz } from "../../../api/apiQuiz";

// Styled Components
const CardStyled = styled(Card)`
  background-color: #ffffff !important;
  border-radius: 12px;
  padding: 25px;
  border: none;
  margin-bottom: 30px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  }
`;

const GradientButton = styled(Button)`
  background: linear-gradient(135deg, #162b72, #3949ab) !important;
  border: none;
  color: #ffffff;
  font-weight: bold;
  border-radius: 8px;
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  text-decoration: none;
  transition: background 0.3s ease, transform 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, #3949ab, #162b72);
    transform: translateY(-3px);
  }

  &:focus {
    box-shadow: 0 0 0 0.2rem rgba(22, 43, 114, 0.25);
    outline: none;
  }

  @media (max-width: 576px) {
    height: 45px;
    font-size: 1rem;
    padding: 8px 16px;
    width: 250px;
  }
`;

const ButtonStyled = styled(Button)`
  max-width: 300px;
  width: 100%;
  background-color: #007bff;
  border: none;
  color: #ffffff;
  font-weight: bold;
  border-radius: 8px;
  transition: background 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-3px);
  }

  &:focus {
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    outline: none;
  }
`;

const TrashIcon = styled(FaRegTrashAlt)`
  color: #ff4d4f;
  position: absolute;
  top: 55px;
  right: 10px;
  cursor: pointer;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #e60000;
  }
`;

const placeholderQuiz = {
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
  const [details, setDetails] = useState({
    titre: "",
    duration: 0,
  });
  const [quiz, setQuiz] = useState([placeholderQuiz]);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const navigate = useNavigate();

  const fetchQuiz = async () => {
    if (id) {
      const result = await getQuiz({
        token: localStorage.getItem("token"),
        id,
      });
      setDetails({
        titre: result.titre,
        duration: result.duration,
      });
      const brigeQuiz = result.questions.map((item) => ({
        id: item.id,
        question: item.question,
        vraixreponse: item.reponses.find((ans) => ans.isCorrect).reponse,
        faussereponse: item.reponses.filter((ans) => !ans.isCorrect),
      }));
      setQuiz(brigeQuiz);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const handleChangeQuiz = (e) => {
    const { name, value } = e.target;
    if (name === "titre" || name === "duration") {
      setDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    } else {
      const updateQuiz = quiz.map((item) => {
        if (name.startsWith("desc") && name.split(":")[1] === item.id) {
          item.question = value;
        } else if (
          name.startsWith("vraixreponse") &&
          name.split(":")[1] === item.id
        ) {
          item.vraixreponse = value;
        } else if (name.startsWith("faussereponse")) {
          item.faussereponse = item.faussereponse.map((answer) => {
            if (answer.id === name.split(":")[1]) {
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

  const handleNewWrongAnswer = ({ questionPosition }) => {
    const updateQuiz = quiz.map((item) => {
      if (item.id === questionPosition) {
        item.faussereponse.push({
          id: uuidv4(),
          reponse: "",
        });
      }
      return item;
    });
    setQuiz(updateQuiz);
  };

  const handleNewQuiz = () => {
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

  const handleDeleteWrongAnswer = ({ id }) => {
    const updateQuiz = quiz.map((item) => {
      const updatedAnswers = item.faussereponse.filter(
        (answer) => answer.id !== id
      );
      return { ...item, faussereponse: updatedAnswers };
    });
    setQuiz(updateQuiz);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await postQuiz({
      token: localStorage.getItem("token"),
      form: { ...details, quiz },
    });
    navigate(`/dashboard/quizzes`);
  };

  return (
    <>
      <GradientButton onClick={() => navigate(`/dashboard/quizzes`)}>
        <FaArrowLeft /> Retour
      </GradientButton>
      <h2>{id ? "Modifier le QUIZ" : "Ajouter un NOUVEAU QUIZ"}</h2>
      <Form onSubmit={handleSubmit} style={{ paddingBottom: "200px" }}>
        <CardStyled>
          <Card.Body>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="formTitre">
                  <Form.Label>Titre: *</Form.Label>
                  <Form.Control
                    name="titre"
                    type="text"
                    value={details.titre}
                    onChange={handleChangeQuiz}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="formDuration">
                  <Form.Label>Durée: (min) *</Form.Label>
                  <Form.Control
                    name="duration"
                    type="number"
                    value={details.duration}
                    onChange={handleChangeQuiz}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            {id && (
              <Button variant="success">Enregistrer les modifications</Button>
            )}
          </Card.Body>
        </CardStyled>
        <Tabs defaultActiveKey="1" id="quiz-tabs" className="mb-3" fill>
          {quiz.map((item, index) => (
            <Tab
              key={item.id}
              eventKey={index + 1}
              title={`Question ${index + 1}`}
            >
              <CardStyled>
                <Card.Body>
                  <h4>Question: {index + 1}</h4>
                  <Form.Group
                    className="mb-3"
                    controlId={`formQuestion${index}`}
                  >
                    <Form.Label>Question: *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name={`desc:${item.id}`}
                      value={item.question}
                      required
                      onChange={handleChangeQuiz}
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId={`formVraiReponse${index}`}
                  >
                    <Form.Label>Bonne réponse</Form.Label>
                    <Form.Control
                      type="text"
                      name={`vraixreponse:${item.id}`}
                      placeholder="Bonne réponse"
                      value={item.vraixreponse}
                      required
                      onChange={handleChangeQuiz}
                    />
                  </Form.Group>
                  <hr />
                  <Row>
                    {item.faussereponse.map((wrongAnswer, i) => (
                      <Col md={6} key={wrongAnswer.id}>
                        <div style={{ position: "relative" }}>
                          <Form.Group
                            className="mb-3"
                            controlId={`formFauxReponse${i}`}
                          >
                            <Form.Label>Mauvaise réponse {i + 1}</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder={`Mauvaise réponse ${i + 1}`}
                              name={`faussereponse:${wrongAnswer.id}`}
                              value={wrongAnswer.reponse}
                              required
                              onChange={handleChangeQuiz}
                            />
                          </Form.Group>
                          {i !== 0 && (
                            <TrashIcon
                              onClick={() =>
                                handleDeleteWrongAnswer({ id: wrongAnswer.id })
                              }
                            />
                          )}
                        </div>
                      </Col>
                    ))}
                    <Col md={12}>
                      <ButtonStyled
                        disabled={
                          item.faussereponse[item.faussereponse.length - 1]
                            ?.reponse.length === 0
                        }
                        onClick={() =>
                          handleNewWrongAnswer({ questionPosition: item.id })
                        }
                      >
                        Ajouter Mauvaise Réponse
                      </ButtonStyled>
                    </Col>
                  </Row>
                </Card.Body>
              </CardStyled>
            </Tab>
          ))}
        </Tabs>
        <Button variant="primary" onClick={handleNewQuiz}>
          Nouvelle Question
        </Button>
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
