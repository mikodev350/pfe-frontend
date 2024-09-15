import React, { useState, useEffect, useMemo } from "react";
import { Container, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { getResourceById } from "../../api/apiResource";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ResourceDetails from "./resourceDetail";
import { getToken } from "../../util/authUtils";
import Loader from "../../components/loader/Loader";
import Retour from "../../components/retour-arriere/Retour";

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
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <><Loader/></>
        </div>
      ) : (
        resource ? <>      <Retour /><ResourceDetails resource={resource} /></> : <p>Ressource introuvable</p>
      )}
    </Container>
  );
};

export default ResourcePreviewPageWithId;
