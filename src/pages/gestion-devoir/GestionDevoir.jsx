import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import DevoirForm from "../../components/devoir-form/DevoirForm";
import { fetchDevoirById } from "../../api/apiDevoir";
import { getToken } from "../../util/authUtils";
import Retour from "../../components/retour-arriere/Retour";

// Styled container for the card-like layout
const CardContainer = styled.div`
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 2rem auto;

  @media (max-width: 576px) {
    padding: 1rem;
    margin: 1rem;
  }
`;

// Styled title for better visual hierarchy
const Title = styled.h2`
  text-align: center;
  color: #10266f;
  font-weight: bold;
  margin-bottom: 2rem;
  text-transform: uppercase;
  font-size: 1.75rem;

  @media (max-width: 576px) {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

export default function GestionDevoir() {
  const { id } = useParams(); // Récupère l'ID du devoir si on est en mode modification
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const token = React.useMemo(() => getToken(), []);

  useEffect(() => {
    if (id) {
      // Si l'ID existe, on est en mode édition
      setIsEdit(true);
      fetchDevoirById(id, token).then((data) =>
        setInitialData({
          titre: data.titre,
          description: data.description,
        })
      );
    } else {
      // Sinon, c'est un nouveau devoir
      setIsEdit(false);
      setInitialData({
        titre: "",
        description: "",
      });
    }
  }, [id, token]);

  const handleSubmit = (formData) => {
    console.log("Données du formulaire :", formData);
    // Logique pour sauvegarder les données du devoir
    // Après avoir sauvegardé, rediriger vers la liste des devoirs
    navigate("/devoirs");
  };

  return (
    <CardContainer>
      <Retour />
      <Title>{isEdit ? "Modifier le Devoir" : "Créer un Nouveau Devoir"}</Title>
      {initialData && (
        <DevoirForm
          initialData={initialData}
          isEdit={isEdit}
          onSubmit={handleSubmit}
        />
      )}
    </CardContainer>
  );
}
