import React, { useState } from 'react';
import FriendsList from './FriendsList';
import Messenger from './Messenger';

const ChatManager = () => {
    const [activeChats, setActiveChats] = useState([]);

    // Sample friends data
    const friends = [
        { id: 1, name: 'Alice', online: true },
        { id: 2, name: 'Bob', online: false },
        { id: 3, name: 'Charlie', online: true }
    ];

    const handleSelectFriend = friend => {
        if (!activeChats.find(chat => chat.id === friend.id)) {
            setActiveChats([...activeChats, { ...friend, messages: [] }]);
        }
    };

    const handleSendMessage = (id, message) => {
                            console.log(message)

        setActiveChats(chats =>
            chats.map(chat =>
                chat.id === id ? { ...chat, messages: [...chat.messages, message] } : chat
            )

            
        );
    };

    return (
        <div>
            <FriendsList friends={friends} onSelectFriend={handleSelectFriend} />
            {activeChats.map(chat => (
                <Messenger
                    key={chat.id}
                    activeFriend={chat}
                    onSendMessage={message => handleSendMessage(chat.id, message)}
                />
            ))}
        </div>
    );
};

export default ChatManager;
