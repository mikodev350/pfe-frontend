import React, { useState, useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
// import { getResourceByToken } from "../../api/apiResource";
// import ResourceDetails from "../resourceDetail/ResourceDetails";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getResourceByToken } from "../../api/apiResource";
import ResourceDetails from "../../pages/resourceDetail/resourceDetail";

const ResourceAccessPage = () => {
  const { token } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getResourceByToken(token);
        setResource(data);
      } catch (error) {
        toast.error("Error fetching resource");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  return (
    <Container>
      <ToastContainer />
      <h1 className="mt-5 mb-4">Resource Access</h1>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p>Loading...</p>
        </div>
      ) : (
        resource ? <ResourceDetails resource={resource} /> : <p>Resource not found or invalid token</p>
      )}
    </Container>
  );
};

export default ResourceAccessPage;
