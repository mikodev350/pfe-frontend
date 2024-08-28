import React from "react";
import { Table, Button } from "react-bootstrap";
import { FaRegTrashAlt } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { deleteQuiz, getQuizzes } from "../../../api/apiQuiz";

// Styled Components
const GradientButton = styled(Button)`
  background: linear-gradient(135deg, #10266f, #3949ab);
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
    background: linear-gradient(135deg, #3949ab, #10266f);
    transform: translateY(-3px);
  }

  &:focus {
    box-shadow: 0 0 0 0.2rem rgba(16, 38, 111, 0.25);
    outline: none;
  }

  @media (max-width: 576px) {
    height: 45px;
    font-size: 1rem;
    padding: 8px 16px;
    width: 250px;
  }
`;

const ActionsWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;

  @media (max-width: 768px) {
    justify-content: center;
    margin-top: 10px;
  }
`;

const ActionIcon = styled.div`
  cursor: pointer;
  font-size: 20px;
  transition: color 0.2s ease;

  &:hover {
    color: #3949ab;
  }

  &.delete-icon:hover {
    color: #ff4c4c;
  }

  &.edit-icon {
    color: #3b82f6;
  }

  &.delete-icon {
    color: #ff4c4c;
  }
`;

const StyledTable = styled(Table)`
  margin-top: 20px;
  border-collapse: separate;
  border-spacing: 0 10px;

  thead th {
    background-color: #162b72;
    color: #ffffff;
    font-weight: bold;
    text-align: center;
  }

  tbody tr {
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    td {
      vertical-align: middle;
      text-align: center;
    }

    &:nth-child(even) {
      background-color: #f8f9fa;
    }
  }

  @media (max-width: 768px) {
    tbody td {
      display: block;
      text-align: right;
      padding: 10px 15px;
    }

    tbody td::before {
      content: attr(data-label);
      float: left;
      font-weight: bold;
      text-transform: uppercase;
    }
  }
`;

export default function Quizzes() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = React.useState([]);

  // Fetch quizzes from API
  const fetchQuizzes = async () => {
    const result = await getQuizzes({
      token: localStorage.getItem("token"),
    });
    setQuizzes(result);
  };

  React.useEffect(() => {
    fetchQuizzes();
  }, []);

  const onHandlerRedirect = (id) => {
    navigate(`/dashboard/quiz?id=${id}`);
  };

  const onHandleNewQuiz = () => {
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
        onClick={onHandleNewQuiz}
        title="Créer un nouveau quiz"
      >
        Nouveau Quiz
      </GradientButton>
      <hr />
      <StyledTable bordered hover responsive>
        <thead>
          <tr>
            <th>Titre</th>
            <th>Total de Questions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((item) => (
            <tr key={item.id}>
              <td data-label="Titre">{item.titre}</td>
              <td data-label="Total de Questions">{item.questions}</td>
              <td data-label="Actions">
                <ActionsWrapper>
                  <ActionIcon
                    className="edit-icon"
                    onClick={() => onHandlerRedirect(item.id)}
                  >
                    <FiEdit2 />
                  </ActionIcon>
                  <ActionIcon
                    className="delete-icon"
                    onClick={() => handleDelete(item.id)}
                  >
                    <FaRegTrashAlt />
                  </ActionIcon>
                </ActionsWrapper>
              </td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </>
  );
}
