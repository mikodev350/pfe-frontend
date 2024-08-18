import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DevoirForm from "../../components/devoir-form/DevoirForm";
import { fetchDevoirById } from "../../api/apiDevoir";
import { getToken } from "../../util/authUtils";

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
      fetchDevoirById(id,token).then((data) => setInitialData({ 
        titre: data.titre,
        description: data.description,
      }));
    } else {
      // Sinon, c'est un nouveau devoir
      setIsEdit(false);
      setInitialData({
        titre: "",
        description: "",
      });
    }
  }, [id]);

  const handleSubmit = (formData) => {
    console.log("Données du formulaire :", formData);
    // Logique pour sauvegarder les données du devoir
    // Après avoir sauvegardé, rediriger vers la liste des devoirs
    navigate("/devoirs");
  };

  return (
    <div>
      <h2 className="text-center">
        {isEdit ? "Modifier le Devoir" : "Créer un Nouveau Devoir"}
      </h2>
      {initialData && (
        <DevoirForm
          initialData={initialData}
          isEdit={isEdit}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
