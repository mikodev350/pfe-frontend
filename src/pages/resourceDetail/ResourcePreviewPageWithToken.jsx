import React, { useState, useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { getResourceByToken } from "../../api/apiResource"; // Assurez-vous que cette fonction est définie dans votre fichier apiResource.js
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import ResourceDetails from "../resourceDetail/ResourceDetails"; // Assurez-vous que le chemin est correct
import { getToken } from "../../util/authUtils";
import ResourceDetails from "./resourceDetail";
// dashboard
const ResourcePreviewPageWithToken = () => {
  const { token } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);

    const tokenUser = React.useMemo(() => {
    const tk = getToken();
    console.log("Token dans useMemo:", tk); // Journal de débogage pour vérifier le token
    return tk;
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Utilisation du token pour récupérer la ressource:", token); // Journal de débogage
        const data = await getResourceByToken(token,tokenUser);
        console.log("Données récupérées :", data); // Journal de débogage
        setResource(data);
      } catch (error) {
        console.error("Erreur lors de la récupération de la ressource:", error);
        toast.error("Erreur lors de la récupération de la ressource");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  return (
    <Container>
      <ToastContainer />
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p>Chargement...</p>
        </div>
      ) : (
        resource ? <ResourceDetails  isFromLink={true}resource={resource} token={tokenUser} /> : <p>Ressource introuvable</p>
      )}
    </Container>
  );
};

export default ResourcePreviewPageWithToken;
