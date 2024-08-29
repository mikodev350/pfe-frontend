import React, { useState, useEffect } from "react";
import Select from "react-select";
import {
  Form,
  Button,
  Container,
  Modal,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { createGroup, fetchFriends } from "../../api/apiConversation";
import { MdGroup } from "react-icons/md";

const CreateModelGroupe = () => {
  const [titre, setTitre] = useState("");
  const [participants, setParticipants] = useState([]);
  const [friendsOptions, setFriendsOptions] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadFriends = async () => {
      try {
        const friends = await fetchFriends();
        const options = friends.map((friend) => ({
          value: friend.id,
          label: friend.username,
        }));
        setFriendsOptions(options);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    loadFriends();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const groupData = {
      titre,
      participants: participants.map((participant) => participant.value),
      type: "groupe",
    };

    try {
      const response = await createGroup(groupData);
      console.log("Group created:", response);
      setShowModal(false); // Close the modal on successful submit
      // You can add further actions here, like redirecting or displaying a success message
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  return (
    <Container className="mt-5">
      <div className="d-flex flex-row-reverse">
        <Button
          variant="primary"
          onClick={() => setShowModal(true)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "5px",
            borderRadius: "50%",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#17a2b8"; // Couleur au survol
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = ""; // Retour à la couleur d'origine
          }}
        >
          <OverlayTrigger
            placement="bottom"
            overlay={
              <Tooltip id="tooltip-create-group">Créer un groupe</Tooltip>
            }
          >
            <MdGroup size={24} color="#fff" />
          </OverlayTrigger>
        </Button>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formTitre">
              <Form.Label>Titre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter titre"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formParticipants" className="mt-3">
              <Form.Label>Participants</Form.Label>
              <Select
                isMulti
                options={friendsOptions}
                value={participants}
                onChange={(selectedOptions) =>
                  setParticipants(selectedOptions ? selectedOptions : [])
                }
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    borderColor: state.isFocused ? "#0066cc" : "#ced4da",
                    borderRadius: "20px",
                    height: "45px", // Reduced height
                    boxShadow: "none",
                    "&:hover": {
                      borderColor: "#0056b3",
                    },
                  }),
                  placeholder: (baseStyles) => ({
                    ...baseStyles,
                    color: "#6c757d",
                    fontSize: "14px", // Slightly smaller font size
                  }),
                  multiValue: (baseStyles) => ({
                    ...baseStyles,
                    backgroundColor: "#e9ecef",
                    borderRadius: "10px",
                  }),
                  menu: (baseStyles) => ({
                    ...baseStyles,
                    borderRadius: "20px",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  }),
                  option: (baseStyles, state) => ({
                    ...baseStyles,
                    backgroundColor: state.isFocused ? "#f8f9fa" : "white",
                    color: "#495057",
                    "&:active": {
                      backgroundColor: "#0066cc",
                      color: "white",
                    },
                  }),
                }}
                placeholder="Select participants..."
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CreateModelGroupe;
