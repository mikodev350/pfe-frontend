import React, { useState, useEffect, useMemo } from "react";
import { Container, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { getResourceById } from "../../api/apiResource";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getToken } from "../../util/authUtils";
import ResourceDetails from "./resourceDetail";

const ResourcePreviewPageWithId = () => {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = useMemo(() => getToken(), []);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        toast.error("Token manquant ou invalide");
        setLoading(false);
        return;
      }

      try {
        const data = await getResourceById(id, token);
        setResource(data);
      } catch (error) {
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
