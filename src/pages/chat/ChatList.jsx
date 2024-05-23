import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

const ChatList = ({ setActiveChat }) => {
  const chats = [
    { id: 1, name: 'John Doe', status: 'Online' },
    // Add more chats here
  ];

  return (
    <ListGroup>
      {chats.map(chat => (
        <ListGroup.Item key={chat.id} onClick={() => setActiveChat(chat)}>
          {chat.name} - {chat.status}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default ChatList;