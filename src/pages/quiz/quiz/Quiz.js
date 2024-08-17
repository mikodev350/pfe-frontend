import React from "react";
import Layout from "../../../components/layout/Layout";
import { Button, Col, Form, Row, Tab, Tabs } from "react-bootstrap";
import { FaRegTrashAlt } from "react-icons/fa";
import Card from "react-bootstrap/Card";
import { accordionStyles } from "../../../components/all-devoirs/devoirCss";
import { getQuiz, postQuiz } from "../../../api/apiQuiz";
import { v4 as uuidv4 } from "uuid";
import { useSearchParams } from "react-router-dom";

let placeholderquiz = {
  id: uuidv4(),
  question: "",
  correctAnswer: "",
  answers: [
    {
      id: uuidv4(),
      answer: "",
    },
  ],
};

export default function Quiz() {
  const [details, setDetails] = React.useState({
    titre: "",
    duration: 0,
  });
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
        correctAnswer: item.answers.filter((ans) => !!ans.isCorrect)[0].answer,
        answers: item.answers.filter((ans) => !ans.isCorrect),
      };
      return data;
    });
    setDetails(brigeDetails);
    setQuiz(brigeQuiz);
  };

  React.useEffect(() => {
    if (id) {
      fetchQuiz();
    }
  }, [id]);

  const [quiz, setQuiz] = React.useState([placeholderquiz]);

  const onHandleChangeQuiz = (e) => {
    const { name, value } = e.target;

    if (name === "titre" || name === "duration") {
      setDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    } else {
      let updateQuiz = quiz.map((item) => {
        if (name.startsWith("desc") && name.split(":")[1] === item.id) {
          item.question = value;
        } else if (
          name.startsWith("correct_answer") &&
          name.split(":")[1] === item.id
        ) {
          item.correctAnswer = value;
        } else if (name.startsWith("wrong_answer")) {
          item.answers = item.answers.map((answer) => {
            if (answer.id === name.split(":")[1]) {
              answer.answer = value;
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
        item.answers.push({
          id: uuidv4(),
          answer: "",
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
        correctAnswer: "",
        answers: [
          {
            id: uuidv4(),
            answer: "",
          },
        ],
      },
    ]);
  };

  const onhandleDeleteWrongAnswer = ({ id }) => {
    let updateQuiz = quiz.map((item) => {
      let updatedAnswers = item.answers.filter((item) => item.id !== id);
      return { ...item, answers: updatedAnswers };
    });
    setQuiz(updateQuiz);
  };

  const submit = async (e) => {
    e.preventDefault();
    const result = await postQuiz({
      token: localStorage.getItem("token"),
      form: { ...details, quiz: quiz },
    });
  };

  return (
    <>
      <h2>{id ? "Edit QUIZ" : "ADD NEW QUIZ"}</h2>
      <Form onSubmit={submit} style={{ paddingBottom: "200px" }}>
        <Card style={{ marginBottom: "50px" }}>
          <Card.Body>
            <Row>
              <Col>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>titre: *</Form.Label>
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
                  <Form.Label>Duration: (min) *</Form.Label>
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
            {id && <Button variant="success">Save Changes</Button>}
          </Card.Body>
        </Card>
        <Tabs
          defaultActiveKey="1"
          id="uncontrolled-tab-example"
          className="mb-3"
          fill
        >
          {quiz.map((item, Qindex) => (
            <Tab
              key={item.id}
              eventKey={Qindex + 1}
              title={`Question ` + Number(Qindex + 1)} // Utilisation de "title" ici pour éviter le conflit
            >
              <Card key={Qindex} style={accordionStyles.card}>
                <Card.Body>
                  <h4>question: {Qindex + 1}</h4>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Form.Label>question: *</Form.Label>
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
                    <Form.Label>Correct Answer</Form.Label>
                    <Form.Control
                      type="text"
                      name={`correct_answer:${item.id}`}
                      placeholder="Correct Answer"
                      value={item.correctAnswer}
                      required
                      onChange={onHandleChangeQuiz}
                    />
                  </Form.Group>
                  <hr />
                  <Row>
                    {item.answers.map((wrongAnswer, index) => (
                      <Col md={6} key={wrongAnswer.id}>
                        <div style={{ position: "relative" }}>
                          <Form.Group className="mb-3" controlId="formanswer">
                            <Form.Label>Wrong Answer {index + 1}</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder={`Wrong Answer ${index + 1}`}
                              name={`wrong_answer:${wrongAnswer.id}`}
                              value={wrongAnswer.answer}
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
                  </Row>
                  <Button
                    variant="primary"
                    disabled={
                      item.answers[item.answers.length - 1]?.answer.length === 0
                    }
                    onClick={() =>
                      onHanldeNewNewWrongAsnwer({ questionPosition: item.id })
                    }
                  >
                    Add Wrong Answer
                  </Button>{" "}
                  {id && (
                    <Button
                      variant="success"
                      disabled={
                        item.answers[item.answers.length - 1]?.answer.length ===
                        0
                      }
                      onClick={() =>
                        onHanldeNewNewWrongAsnwer({ questionPosition: item.id })
                      }
                    >
                      Save Changes
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Tab>
          ))}
        </Tabs>
        <Button variant="primary" onClick={onHanldeNewNewQuiz}>
          Add New Quiz
        </Button>
        {!id && (
          <>
            <hr />
            <Button variant="primary" type="submit" style={{ float: "right" }}>
              Submit
            </Button>
          </>
        )}
      </Form>
    </>
  );
}
