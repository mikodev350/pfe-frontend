import React, { useState } from 'react';
import FriendsList from './FriendsList';
import Messenger from './Messenger';

const ChatApplication = () => {
    const [friends, setFriends] = useState([
        { id: 1, name: "Alice",avatarUrl:"https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg", online: true, messages: [], active: false },
        { id: 2, name: "Bob",avatarUrl:"https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg" ,online: false, messages: [], active: false },
        { id: 3, name: "Charlie",avatarUrl:"https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg", online: true, messages: [], active: false }
    ]);

    const handleSelectFriend = friendId => {
        setFriends(friends =>
            friends.map(friend =>
                friend.id === friendId
                    ? { ...friend, active: !friend.active }
                    : friend
            )
        );
    };

    const handleSendMessage = (friendId, newMessage) => {
        if (!newMessage.trim()) return; // Prevent sending empty messages
        setFriends(friends =>
            friends.map(friend =>
                friend.id === friendId
                    ? { ...friend, messages: [...friend.messages, { senderId: 'me', text: newMessage }] }
                    : friend
            )
        );
    };

    return (
        <div>
            <FriendsList friends={friends} onSelectFriend={handleSelectFriend} />
            {friends.filter(friend => friend.active).map(friend => (
                <Messenger
                    key={friend.id}
                    activeFriend={friend}
                    onSendMessage={handleSendMessage}
                />
            ))}
        </div>
    );
};

export default ChatApplication;
