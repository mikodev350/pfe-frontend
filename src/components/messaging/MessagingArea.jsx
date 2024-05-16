import React, { useState } from 'react';
import FriendsList from './FriendsList'; // Assurez-vous que le chemin est correct
import Messenger from './Messenger'; // Assurez-vous que le chemin est correct
import "./message.css"

const MessagingArea = () => {
    const [activeFriend, setActiveFriend] = useState(null);
    const friends = [
        { id: 1, name: 'Alice', online: true, image:"https://t3.ftcdn.net/jpg/03/02/88/46/360_F_302884605_actpipOdPOQHDTnFtp4zg4RtlWzhOASp.jpg" },
        { id: 2, name: 'Bob', online: false ,image:"https://t3.ftcdn.net/jpg/03/02/88/46/360_F_302884605_actpipOdPOQHDTnFtp4zg4RtlWzhOASp.jpg"},
        { id: 3, name: 'Charlie', online: true ,image:"https://t3.ftcdn.net/jpg/03/02/88/46/360_F_302884605_actpipOdPOQHDTnFtp4zg4RtlWzhOASp.jpg"}
    ];

    return (
        <div>
            <FriendsList friends={friends} onSelectFriend={setActiveFriend} />
            {activeFriend && <Messenger activeFriend={activeFriend} />}
        </div>
    );
};

export default MessagingArea;
