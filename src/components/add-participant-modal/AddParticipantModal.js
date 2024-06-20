import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Select from "react-select";
import { fetchFriends, addParticipant } from "../../api/apiConversation";
import { useQueryClient } from "react-query";

const AddParticipantModal = ({
  show,
  handleClose,
  conversationId,
  currentParticipants,
}) => {
  const [friendsOptions, setFriendsOptions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    const loadFriends = async () => {
      try {
        const friends = await fetchFriends();
        const options = friends
          .filter(
            (friend) =>
              !currentParticipants.some(
                (participant) => participant.id === friend.id
              )
          )
          .map((friend) => ({
            value: friend.id,
            label: friend.username,
          }));
        setFriendsOptions(options);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };
    loadFriends();
  }, [currentParticipants]);

  const handleAddParticipant = async () => {
    try {
      await addParticipant({
        conversationId,
        userIds: selectedUsers.map((user) => user.value),
      });
      queryClient.invalidateQueries(["conversation", conversationId]);
      handleClose();
    } catch (error) {
      console.error("Error adding participant:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Participant</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="formParticipants">
          <Form.Label>Select Participant(s)</Form.Label>
          <Select
            options={friendsOptions}
            value={selectedUsers}
            onChange={setSelectedUsers}
            placeholder="Select participant(s)..."
            isMulti
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleAddParticipant}>
          Add Participant(s)
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddParticipantModal;
