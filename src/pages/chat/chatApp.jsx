import React, { useState } from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import ChatWindow from './ChatWindow'; // Ensure the path to ChatWindow is correct
import './ChatApp.css'; // Importing custom CSS

const ChatApp = () => {
  const [friends, setFriends] = useState([
    { id: 1, name: 'Alice', messages: [] },
    { id: 2, name: 'Bob', messages: [] },
    { id: 3, name: 'Charlie', messages: [] }, // Added more friends for demonstration
  ]);
  const [selectedFriendId, setSelectedFriendId] = useState(friends[0].id);
  const currentUserId = 2;  // Your current user's ID

  const handleSendMessage = (friendId, message) => {
    const updatedFriends = friends.map((friend) => {
      if (friend.id === friendId) {
        return { ...friend, messages: [...friend.messages, { ...message, senderId: currentUserId }] };
      }
      return friend;
    });
    setFriends(updatedFriends);
  };

  const selectedFriend = friends.find(friend => friend.id === selectedFriendId);

  return (
    <Container>
      <h1>Chat Application</h1>
      <Row>
        <Col md={4}>
          <ListGroup>
            {friends.map(friend => (
              <ListGroup.Item key={friend.id} active={friend.id === selectedFriendId} onClick={() => setSelectedFriendId(friend.id)} className="friend-list-item">
                {friend.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col md={8}>
          {selectedFriend && (
            <ChatWindow friend={selectedFriend} onSendMessage={handleSendMessage} currentUserId={currentUserId} />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ChatApp;