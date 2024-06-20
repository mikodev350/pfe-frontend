import React, { useState, useEffect, useMemo } from "react";
import { Container, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { getResourceById } from "../../api/apiResource";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ResourceDetails from "./resourceDetail"; // Assurez-vous que le chemin est correct
import { getToken } from "../../util/authUtils";

const ResourcePreviewPageWithId = () => {
  const { id } = useParams(); // Récupère l'ID de la ressource depuis les paramètres de l'URL
  const [resource, setResource] = useState(null); // État pour stocker les détails de la ressource
  const [loading, setLoading] = useState(true); // État pour gérer le chargement
  const token = useMemo(() => {
    const tk = getToken();
    console.log("Token dans useMemo:", tk); // Journal de débogage pour vérifier le token
    return tk;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        toast.error("Token manquant ou invalide");
        setLoading(false);
        return;
      }

      try {
        console.log("Récupération de la ressource avec ID et token:", id, token); // Journal de débogage
        const data = await getResourceById(id, token); // Appel de l'API pour récupérer les détails de la ressource
        console.log("Données récupérées :", data); // Journal de débogage pour les données récupérées
        setResource(data);
      } catch (error) {
        console.error("Erreur lors de la récupération de la ressource:", error);
        toast.error("Erreur lors de la récupération de la ressource");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  return (
    <Container>
      <ToastContainer />
      <h1 className="mt-5 mb-4">Aperçu de la Ressource</h1>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p>Chargement...</p>
        </div>
      ) : (
        resource ? <ResourceDetails resource={resource} isFromLink={false} /> : <p>Ressource introuvable</p>
      )}
    </Container>
  );
};

export default ResourcePreviewPageWithId;
