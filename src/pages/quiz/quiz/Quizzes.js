import React from "react";
import { Table, Button } from "react-bootstrap";
import { FaRegTrashAlt } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { deleteQuiz, getQuizzes } from "../../../api/apiQuiz";
import Swal from "sweetalert2";

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
    justify-content: space-around;
    margin-top: 10px;
  }

  @media (max-width: 576px) {
    gap: 10px;
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

const StyledTable = styled(Table)`
  margin-top: 20px;
  border-collapse: separate;
  border-spacing: 0 10px;

  thead th {
    background-color: #162b72;
    color: #ffffff;
    font-weight: bold;
    text-align: center;
    padding: 10px;
    min-width: 120px;
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
      text-align: center !important; /* Aligner tout à droite */
      padding: 15px;
      min-width: 120px;
      white-space: nowrap; /* Empêche le chevauchement du texte */
    }

    td[data-label="Titre"] {
      text-align: left; /* Aligner le titre à gauche */
      padding-left: 20px;
      padding-right: 10px;
    }

    td[data-label="Total de Questions"],
    td[data-label="Actions"] {
      text-align: right; /* Aligner à droite les valeurs et actions */
      padding-left: 10px;
      padding-right: 20px;
    }

    &:nth-child(even) {
      background-color: #f8f9fa;
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

  const handleDelete = (id) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous ne pourrez pas annuler cette action !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteQuiz({
            token: localStorage.getItem("token"),
            id: id,
          });
          setQuizzes(quizzes.filter((quiz) => quiz.id !== id)); // Mise à jour de l'état local après suppression
          Swal.fire(
            "Supprimé !",
            "Le quiz a été supprimé avec succès.",
            "success"
          );
        } catch (error) {
          Swal.fire(
            "Erreur !",
            "Une erreur s'est produite lors de la suppression du quiz.",
            "error"
          );
        }
      }
    });
  };

  return (
    <>
      <StyledTitle>Mes Quiz</StyledTitle>
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
