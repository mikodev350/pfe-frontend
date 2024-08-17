import React from "react";

import { Button, Form } from "react-bootstrap";

import Card from "react-bootstrap/Card";
import { accordionStyles } from "../../../components/all-devoirs/devoirCss";
import { getQuizTest } from "../../../api/apiQuiz";

import { useNavigate, useSearchParams } from "react-router-dom";
import CountdownTimer from "../../../components/countdownTimer/CountdownTimer";
import { useSelector } from "react-redux";

export default function Evaluation() {
  // get socket from redux store
  //
  const { socket } = useSelector((state) => state.socket);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get the 'id' query parameter
  const id = searchParams.get("id");

  //! Fetch by id, in the case Id exist we should show edit page
  const [details, setDetails] = React.useState({
    title: "",
    duration: 10,
  });
  const [quiz, setQuiz] = React.useState({});
  const fetchQuizTest = async () => {
    const result = await getQuizTest({
      token: localStorage.getItem("token"),
      id: id,
    });
    if (result === "SESSION ENDED") {
      alert("SESSION ENDED");
      return navigate("/student/my-profile");
    }
    setQuiz(result);
  };

  React.useEffect(() => {
    if (id) {
      fetchQuizTest();
    } else {
      navigate("/404");
    }
  }, [id]);

  // ------- we should use sotket to onEndEvaluation result ----------- //
  const onEndEvaluation = async (e) => {
    socket.emit("end-quiz", {
      assignationId: id,
    });
    return navigate("/student/my-profile");
  };
  const putAnswer = (questionId, answerId) => {
    socket.emit("set-answer-quiz", {
      questionId: questionId,
      answerId: answerId,
      assignationId: id,
    });
  };
  return (
    <>
      <h2>Quiz</h2>

      <Card style={{ marginBottom: "50px" }}>
        <Card.Body
          style={{ display: "grid", gridTemplateColumns: "1fr  1fr 1fr" }}
        >
          <h1>{quiz?.titre}</h1>
          <Button variant="danger" onClick={onEndEvaluation}>
            Finish The quiz
          </Button>
          {quiz?.duration && (
            <div style={{ textAlign: "right" }}>
              <CountdownTimer
                initialMinutes={1}
                isSessionEnded={onEndEvaluation}
              />
            </div>
          )}
        </Card.Body>
      </Card>

      {quiz?.questions?.map((item, Qindex) => (
        <Card key={Qindex} style={accordionStyles.card}>
          <Card.Body>
            <h4>question: {Qindex + 1}</h4>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>question: *</Form.Label>
              {item.question}
            </Form.Group>
            {item.reponses.map((answer, index) => (
              <div style={{ position: "relative" }}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="radio"
                    name={item.id}
                    onChange={() => putAnswer(item.id, answer.id)}
                    label={answer.reponse}
                  />
                </Form.Group>
              </div>
            ))}
          </Card.Body>
        </Card>
      ))}
    </>
  );
}
