import React from 'react';
import { ListGroup, Container, Row, Col } from 'react-bootstrap';
import { AiOutlineMessage } from 'react-icons/ai'; // Import a message icon from react-icons

const FriendsList = ({ friends, onSelectFriend }) => {
    return (
        <Container>
            <ListGroup className="friends-list">
                {friends.map(friend => (
                    <ListGroup.Item key={friend.id} className="friend-item" onClick={() => onSelectFriend(friend.id)}>
                        <Row>
                            <Col xs={3} className="p-2">
                                <img src={friend.avatarUrl} alt={friend.name} className="friend-image" />
                            </Col>
                            <Col xs={5} className="p-2">
                                <span className="friend-name">{friend.name}</span>
                            </Col>
                            <Col xs={2} className="p-2">
                                <div className="online-status" style={{backgroundColor: friend.online ? 'green' : 'red'}}></div>
                            </Col>
                            <Col xs={2} className="p-2">
                                <div className="friend-actions">
                                    <button className="action-button">
                                        <AiOutlineMessage size={20} />
                                    </button>
                                </div>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Container>
    );
};

export default FriendsList;
