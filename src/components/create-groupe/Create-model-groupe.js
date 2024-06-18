import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Form, Button, Container, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { createGroup, fetchFriends } from "../../api/apiConversation";

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
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Create Group
      </Button>

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
