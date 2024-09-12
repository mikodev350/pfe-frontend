import React from "react";

import { Button, Form } from "react-bootstrap";

import Card from "react-bootstrap/Card";
import { accordionStyles } from "../../../components/all-devoirs/devoirCss";
import { getQuizTest } from "../../../api/apiQuiz";
import styled from "styled-components";
import Swal from "sweetalert2";
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
      // Remplacer l'alerte par SweetAlert2
      Swal.fire({
        title: "Session Terminée",
        text: "Votre session a expiré.",
        icon: "warning",
        confirmButtonText: "OK",
      }).then(() => {
        // Redirection après la confirmation de l'utilisateur
        navigate("/student/my-profile");
      });
      return;
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
      examId: quiz.id,
    });
    return navigate("/dashboard/my-profile");
  };
  const putAnswer = (questionId, answerId) => {
    socket.emit("set-answer-quiz", {
      questionId: questionId,
      answerId: answerId,
      assignationId: id,
    });
  };
  return (
    <QuizContainer>
      <QuizCard>
        <HeaderSection>
          <Title>{quiz?.titre}</Title>
          <StyledButton onClick={onEndEvaluation}>Fins</StyledButton>
        </HeaderSection>
        {quiz?.duration && (
          <CountdownTimer
            initialMinutes={Number(quiz?.duration)}
            isSessionEnded={onEndEvaluation}
          />
        )}
      </QuizCard>

      {quiz?.questions?.map((item, Qindex) => (
        <QuestionCard key={Qindex}>
          <QuestionHeader>Question: {Qindex + 1}</QuestionHeader>
          <Form.Group>
            <Form.Label>{item.question}</Form.Label>
            {item.reponses.map((answer, index) => (
              <AnswerOption
                key={index}
                type="radio"
                name={item.id}
                onChange={() => putAnswer(item.id, answer.id)}
                label={answer.reponse}
              />
            ))}
          </Form.Group>
        </QuestionCard>
      ))}
    </QuizContainer>
  );
}
// Styled components
const QuizContainer = styled.div`
  padding: 20px;
  background-color: #f7f9fc;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const QuizCard = styled.div`
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
`;

const QuestionCard = styled.div`
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  margin-left: 10px;
`;

const QuestionHeader = styled.h4`
  margin-bottom: 15px;
  font-size: 1.4rem;
  color: #333;
`;

const AnswerOption = styled(Form.Check)`
  display: flex;
  align-items: center;
  padding: 10px;
  margin: 10px 0;
  // border: 1px solid #e0e0e0;
  border-radius: 8px;
  width: 100%; /* S'assure que l'élément prend toute la largeur disponible */
  box-sizing: border-box; /* Inclut le padding et la bordure dans la largeur totale */

  &:hover {
    background-color: #f1f1f1;
    transition: background-color 0.3s ease;
  }

  /* Ajoute un peu de marge au niveau du bouton radio pour qu'il ne colle pas */
  .form-check-input {
    margin-right: 10px;
    transform: scale(
      1.2
    ); /* Agrandit légèrement le bouton pour une meilleure visibilité */
  }
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
`;

const StyledButton = styled(Button)`
  background-color: #3498db;
  border: none;
  border-radius: 8px;
  padding: 12px 25px;
  font-size: 1rem;
  color: #fff;
  &:hover {
    background-color: #2980b9;
    transition: background-color 0.3s ease;
  }
`;
