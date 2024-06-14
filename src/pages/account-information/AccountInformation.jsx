import React, { useState, useMemo } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { getToken } from "../../util/authUtils";
import { fetchSelfById, updateUserById } from "../../api/apiSettingsSelf";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useQuery, useMutation, useQueryClient } from "react-query";
import { FaEdit } from "react-icons/fa"; // Import the FaEdit icon from react-icons
import AccountInformationForm from "./AccountInformationForm";

function AccountInformation() {
  const token = useMemo(() => getToken(), []);
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const { data: userData, isLoading, isError } = useQuery("userData", () => fetchSelfById(token));

  const mutation = useMutation((values) => updateUserById(userData.id, values, token), {
    onSuccess: (data) => {
      toast.success("Mise à jour réussie", {
position:"top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      queryClient.invalidateQueries("userData");
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error("Erreur lors de la mise à jour de l'utilisateur", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    },
  });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = async (values) => {
    mutation.mutate(values);
  };

  if (isLoading) return <p>Chargement...</p>;
  if (isError) return <p>Erreur lors de la récupération des données utilisateur.</p>;

  return (
    <Container className="bg-light p-5 rounded shadow-sm" style={{ marginBottom: "100px" }}>
      <ToastContainer /> {/* Add this line to include the toast container */}
      {userData ? (
        isEditing ? (
          <AccountInformationForm userData={userData} handleSave={handleSave} />
        ) : (
          <Row className="justify-content-center">
            <Col md={8}>
              <Card className="p-4">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-5">
                    <h3 className="mb-0">Informations du compte</h3>
                    <Button variant="outline-primary" onClick={handleEditClick}>
                      <FaEdit /> {/* Add the FaEdit icon */}
                    </Button>
                  </div>
                  <div className="mb-3">
                    <p><strong>Prénom:</strong> {userData.username}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Téléphone:</strong> {userData.phoneNumber}</p>
                    <p><strong>Code Postal:</strong> {userData.postalCode}</p>
                    <p><strong>Wilaya:</strong> {userData.wilaya}</p>
                    <p><strong>Date de Naissance:</strong> {userData.dateOfBirth}</p>
                    <p><strong>Adresse:</strong> {userData.address}</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )
      ) : (
        <p>Chargement...</p>
      )}
    </Container>
  );
}

export default AccountInformation;
