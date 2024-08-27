import React from "react";
import Layout from "../../../components/layout/Layout";
import { deleteQuiz, getQuizzes } from "../../../api/apiQuiz";
import { Card, Col, Row, Button } from "react-bootstrap";
import { accordionStyles } from "../../../components/all-devoirs/devoirCss";
import { FaRegTrashAlt } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const CardStylled = styled(Card)`
  background-color: #fff !important;
  border-radius: 12px;
  padding: 25px 0px;
  border: none;
  margin-bottom: 30px;
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
export default function Quizzes() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = React.useState([]);

  // Récupération des quiz depuis l'API
  const fetchQuizzes = async () => {
    const result = await getQuizzes({
      token: localStorage.getItem("token"),
    });
    setQuizzes(result);
  };

  React.useEffect(() => {
    fetchQuizzes();
  }, []);

  const onhandleredirect = (id) => {
    navigate(`/dashboard/quiz?id=${id}`);
  };

  const onhandleNewQuiz = () => {
    navigate(`/dashboard/quiz`);
  };

  const handleDelete = async (id) => {
    try {
      await deleteQuiz({
        token: localStorage.getItem("token"),
        id: id,
      });
      setQuizzes(quizzes.filter((quiz) => quiz.id !== id)); // Mise à jour de l'état local après suppression
    } catch (error) {
      console.error("Échec de la suppression du quiz", error);
    }
  };

  return (
    <>
      <h3>Mes Quiz</h3>
      <GradientButton
        variant="primary"
        onClick={onhandleNewQuiz}
        title="Créer un nouveau quiz"
      >
        Nouveau Quiz
      </GradientButton>
      <hr />
      <CardStylled style={{ marginBottom: "20px" }}>
        <Card.Body>
          <Row>
            <Col>
              <b>Titre</b>
            </Col>
            <Col>
              <b>Total de Questions</b>
            </Col>
            <Col style={{ textAlign: "right" }} md="1">
              <b>Actions</b>
            </Col>
          </Row>
        </Card.Body>
      </CardStylled>
      {quizzes.map((item) => (
        <CardStylled key={item.id} style={accordionStyles.card}>
          <Card.Body>
            <Row>
              <Col>
                <span>{item.titre}</span>
              </Col>
              <Col>
                <span>{item.questions}</span>
              </Col>
              <Col style={{ textAlign: "right" }} md="1">
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                  }}
                >
                  <FiEdit2
                    size={20}
                    style={{ cursor: "pointer" }}
                    onClick={() => onhandleredirect(item.id)}
                  />
                  <FaRegTrashAlt
                    size={20}
                    style={{ cursor: "pointer", color: "red" }}
                    onClick={() => handleDelete(item.id)} // Appel à handleDelete lorsqu'on clique sur la corbeille
                  />
                </div>
              </Col>
            </Row>
          </Card.Body>
        </CardStylled>
      ))}
    </>
  );
}
