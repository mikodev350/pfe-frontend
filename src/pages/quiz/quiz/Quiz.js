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
  //! Fetch by id, in the case Id exist we should show edit page
  const [details, setDetails] = React.useState({
    title: "",
    duration: 10,
  });
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id"); // Get the 'id' query parameter
  const fetchQuiz = async () => {
    const result = await getQuiz({
      token: localStorage.getItem("token"),
      id: id,
    });
    console.log(result);
    const brigeDetails = {
      title: result.title,
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
    console.log(brigeQuiz);
  };
  React.useEffect(() => {
    if (id) {
      fetchQuiz();
    }
  }, [id]);

  const [quiz, setQuiz] = React.useState([placeholderquiz]);

  const onHandleChangeQuiz = (e) => {
    let name = e.target.name.split(":")[0];
    let id = e.target.name.split(":")[1];
    let updateQuiz = quiz.map((item, index) => {
      if (id === item.id && name !== "wrong_answer") {
        if (name === "desc") {
          item.question = e.target.value;
        } else if (name === "correct_answer") {
          item.correctAnswer = e.target.value;
          return item;
        } else if (name === "title") {
          setDetails({ ...details, title: e.target.value });
        } else if (name === "duration") {
          setDetails({ ...details, duration: e.target.value });
        }
      } else {
        item.answers = item.answers.map((answer) => {
          if (answer.id === id) {
            answer.answer = e.target.value;
          }
          return answer;
        });
      }
      return item;
    });
    setQuiz(updateQuiz);
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
            text: "",
          },
        ],
      },
    ]);
  };
  const submit = async (e) => {
    e.preventDefault();
    const result = await postQuiz({
      token: localStorage.getItem("token"),
      form: { ...details, quiz: quiz },
    });
  };
  const onhandleDeleteWrongAnswer = ({ id }) => {
    let updateQuiz = quiz.map((item) => {
      let updatedAnswers = item.answers.filter((item) => item.id !== id);
      return { ...item, answers: updatedAnswers };
    });
    setQuiz(updateQuiz);
  };
  return (
    <Layout>
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
                  <Form.Label>Titile: *</Form.Label>
                  <Form.Control
                    rows={3}
                    name={`title:`}
                    required
                    onChange={onHandleChangeQuiz}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>Duration: *</Form.Label>
                  <Form.Control
                    rows={3}
                    name={`duration:`}
                    required
                    onChange={onHandleChangeQuiz}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <Tabs
          defaultActiveKey="1"
          id="uncontrolled-tab-example"
          className="mb-3"
          fill
        >
          {quiz.map((item, Qindex) => (
            <Tab eventKey={Qindex + 1} title={`Question ` + Number(Qindex + 1)}>
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
                  <hr />{" "}
                  <Row>
                    {item.answers.map((wrongAnswer, index) => (
                      <Col md={6}>
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
                      item.answers[
                        item.answers.length >= 1 ? item.answers.length - 1 : 0
                      ].answer.length === 0
                    }
                    onClick={() =>
                      onHanldeNewNewWrongAsnwer({
                        questionPosition: item.id,
                      })
                    }
                  >
                    Add Wrong Answer
                  </Button>
                </Card.Body>
              </Card>
            </Tab>
          ))}
        </Tabs>
        <Button variant="primary" onClick={() => onHanldeNewNewQuiz()}>
          Add New Quiz
        </Button>
        <hr />
        <Button variant="primary" type="submit" style={{ float: "right" }}>
          Submit
        </Button>
      </Form>
    </Layout>
  );
}
