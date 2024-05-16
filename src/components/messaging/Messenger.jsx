import React, { useEffect, useRef, useState } from 'react';
import { ListGroup, InputGroup, FormControl, Button } from 'react-bootstrap';
import { AiOutlineClose } from 'react-icons/ai';
import './message.css'
const Messenger = ({ activeFriend, onSendMessage }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);
    

    const sendMessage = () => {
        if (newMessage.trim()) {
                        console.log("newMessage")
            onSendMessage(activeFriend.id, newMessage);
            setNewMessage('');
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeFriend.messages]);

    return (
        <div className="messenger">
            <div className="chat-header">
                Chat with {activeFriend.name}
                <button style={{ border: 'none', background: 'none' }}>
                    <AiOutlineClose size={22} />
                </button>
            </div>
            <ListGroup className="message-list">
                {activeFriend.messages.map((msg, index) => (
                    <ListGroup.Item key={index} className={`message ${msg.senderId === 'me' ? 'sent' : 'received'}`}>
                        {msg.text}
                    </ListGroup.Item>
                ))}
                <div ref={messagesEndRef} />
            </ListGroup>
            <InputGroup className="message-input">
                <FormControl
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyPress={event => event.key === 'Enter' && sendMessage()}
                />
                <Button variant="primary" onClick={sendMessage}>Send</Button>
            </InputGroup>
        </div>
    );
};

export default Messenger;
