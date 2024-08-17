import React from "react";
import Layout from "../../../components/layout/Layout";
import { deleteQuiz, getQuizzes } from "../../../api/apiQuiz";
import { Card, Col, Row, Button } from "react-bootstrap";
import { accordionStyles } from "../../../components/all-devoirs/devoirCss";
import { FaRegTrashAlt } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

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
    navigate(`/student/quiz?id=${id}`);
  };

  const onhandleNewQuiz = () => {
    navigate(`/student/quiz`);
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
      <Button
        variant="primary"
        onClick={onhandleNewQuiz}
        title="Créer un nouveau quiz"
      >
        Nouveau Quiz
      </Button>
      <hr />
      <Card style={{ marginBottom: "20px" }}>
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
      </Card>
      {quizzes.map((item) => (
        <Card key={item.id} style={accordionStyles.card}>
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
        </Card>
      ))}
    </>
  );
}
