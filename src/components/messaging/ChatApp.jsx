import React, { useState } from 'react';
import { Container, Form, InputGroup, FormControl, ListGroup, Button, Modal } from 'react-bootstrap';
import { IoMdSend } from "react-icons/io";
import { BiImageAdd, BiXCircle } from "react-icons/bi";

const ChatApp = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState({});
  const [search, setSearch] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleUserSelect = user => {
    setSelectedUser(user);
    if (!messages[user]) {
      setMessages(prevMessages => ({
        ...prevMessages,
        [user]: []
      }));
    }
  };

  const handleMessageSubmit = event => {
    event.preventDefault();
    if (inputMessage.trim() || uploadedImage) {
      const newMessage = { text: inputMessage, sender: 'me', image: uploadedImage };
      setMessages({
        ...messages,
        [selectedUser]: [...messages[selectedUser], newMessage]
      });
      setInputMessage('');
      setUploadedImage(null);
    }
  };

  const handleSearchChange = event => {
    setSearch(event.target.value);
  };

  const handleImageChange = event => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
  };

  const handleImageClick = image => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const users = ["User 1", "User 2", "User 3"].filter(user =>
    user.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container style={containerStyle}>
      {!selectedUser ? (
        <>
          <InputGroup className="mb-3">
            <FormControl
              style={inputStyle}
              placeholder="Search by name"
              aria-label="Search by name"
              onChange={handleSearchChange}
            />
          </InputGroup>

          <ListGroup>
            {users.map((user, index) => (
              <ListGroup.Item
                key={index}
                style={listGroupItemStyle}
                onClick={() => handleUserSelect(user)}
                action
              >
                <img src={`https://placehold.it/50x50`} alt={user} style={imgStyle} className="img-fluid rounded-circle"/>
                {user}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </>
      ) : (
        <div>
          <Button onClick={() => setSelectedUser(null)} style={buttonStyle}>
            Back to contacts
          </Button>
          <h4>Conversation with {selectedUser}</h4>
          <div style={messagesStyle}>
            {messages[selectedUser]?.map((msg, idx) => (
              <div key={idx} style={messageSentStyle}>
                {msg.text}
                {msg.image && (
                  <img src={msg.image} alt="Uploaded" style={imagePreviewStyle} onClick={() => handleImageClick(msg.image)} />
                )}
              </div>
            ))}
          </div>
          {uploadedImage && (
            <div style={imagePreviewContainer}>
              <img src={uploadedImage} alt="Preview" style={imagePreviewStyle} />
              <BiXCircle size={20} style={removeIconStyle} onClick={handleRemoveImage} />
            </div>
          )}
          <Form onSubmit={handleMessageSubmit}>
            <InputGroup>
              <input
                type="file"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                id="fileInput"
                accept="image/*"
              />
              <label htmlFor="fileInput" style={{ cursor: 'pointer' }}>
                <BiImageAdd size={25} />
              </label>
              <FormControl
                placeholder="Type a message..."
                aria-label="Message Input"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                style={inputStyle}
              />
              <Button variant="primary" type="submit" style={buttonStyle}>
                <IoMdSend />
              </Button>
            </InputGroup>
          </Form>
        </div>
      )}

      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Body>
          <img src={selectedImage} alt="Full Size" style={{ width: '100%' }} />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

// Styles should be defined outside of the component
const containerStyle = { maxWidth: '400px', background: '#f8f9fa', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', fontFamily: 'Arial, sans-serif', marginTop: '50px' };
const inputStyle = { borderRadius: '20px', boxShadow: 'none', flexGrow: 1 };
const buttonStyle = { marginBottom: '10px', backgroundColor: '#007bff', border: 'none', borderRadius: '20px' };
const listGroupItemStyle = { background: '#ffffff', border: 'none', marginBottom: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', padding: '10px' };
const imgStyle = { marginRight: '10px' };
const messagesStyle = { maxHeight: '300px', overflowY: 'auto' };
const messageSentStyle = { margin: '10px', backgroundColor: '#D0E9FF', padding: '8px 20px', borderRadius: '20px', maxWidth: '75%', alignSelf: 'flex-end', textAlign: 'right' };
const imagePreviewContainer = { display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' };
const imagePreviewStyle = { maxWidth: '50px', maxHeight: '50px', borderRadius: '10px' };  // Adjusted to small size as requested
const removeIconStyle = { marginLeft: '10px', color: 'red', cursor: 'pointer' };  // Style for the remove icon

export default ChatApp;









// import React, { useState } from 'react';
// import { Container, Form, InputGroup, FormControl, ListGroup, Button,Col ,Row} from 'react-bootstrap';
// import { IoMdSend } from "react-icons/io";
// import { BiImageAdd } from "react-icons/bi";
// const ChatApp = () => {
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [messages, setMessages] = useState({});
//   const [search, setSearch] = useState("");
//   const [inputMessage, setInputMessage] = useState("");

//   const handleUserSelect = user => {
//     setSelectedUser(user);
//     if (!messages[user]) {
//       setMessages(prevMessages => ({
//         ...prevMessages,
//         [user]: []
//       }));
//     }
//   };

//   const handleMessageSubmit = event => {
//     event.preventDefault();
//     if (inputMessage.trim()) {
//       const newMessage = { text: inputMessage, sender: 'me' }; // Assuming the current user is 'me'
//       setMessages({
//         ...messages,
//         [selectedUser]: [...messages[selectedUser], newMessage]
//       });
//       setInputMessage('');
//     }
//   };

//   const handleSearchChange = event => {
//     setSearch(event.target.value);
//   };

//   const users = ["User 1", "User 2", "User 3"].filter(user =>
//     user.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <Container style={containerStyle}>

//       {!selectedUser ? (
//         <>
//           <InputGroup className="mb-3">
//             <FormControl
//               style={inputStyle}
//               placeholder="Search by name"
//               aria-label="Search by name"
//               onChange={handleSearchChange}
//             />
//           </InputGroup>

//           <ListGroup>
//             {users.map((user, index) => (
//               <ListGroup.Item
//                 key={index}
//                 style={listGroupItemStyle}
//                 onClick={() => handleUserSelect(user)}
//                 action
//               >
//                 <img src={`https://placehold.it/50x50`} alt={user} style={imgStyle} className="img-fluid rounded-circle"/>
//                 {user}
//               </ListGroup.Item>
//             ))}
//           </ListGroup>
//         </>
//       ) : (
//         <div>
//           <Button onClick={() => setSelectedUser(null)} style={{ marginBottom: '10px', backgroundColor: '#007bff', border: 'none', borderRadius: '20px' }}>
//             Back to contacts
//           </Button>
//           <h4>{selectedUser}</h4>
//           <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
//             {messages[selectedUser]?.map((msg, idx) => (
//               <div key={idx} style={{ margin: '10px', backgroundColor: '#D0E9FF', padding: '8px 20px', borderRadius: '20px', maxWidth: '75%', alignSelf: 'flex-end', textAlign: 'right' }}>
//                 {msg.text}
//               </div>
//             ))}
//           </div>
//           <Form onSubmit={handleMessageSubmit}>
//             <InputGroup>
//                           {/* <Col xs={1} style={{ padding: 10 }}></Col> */}
//                           <BiImageAdd  />
//               <Col xs={9} style={{ padding: 10 }}>
//                 <FormControl
//                   placeholder="Type a message..."
//                   aria-label="Message Input"
//                   value={inputMessage}
//                   onChange={(e) => setInputMessage(e.target.value)}
//                   style={{ borderRadius: '20px 0 0 20px', boxShadow: 'none' }}
//                 />
//               </Col>
//  <Col xs={2} style={{ padding: 0 }}>
//       <button type="submit" style={{
//     backgroundColor: '#007bff',
//     border: 'none',
//     borderRadius: '50%',
//     width: '40px',
//     height: '40px',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     color: 'white',
//     fontSize: '20px',
//     cursor: 'pointer',
//     boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
//     marginTop: '10px'
//   }}>
//         <IoMdSend size={15} style={{ color: 'white', }} />
//       </button>
//     </Col>
//             </InputGroup>
//           </Form>
//         </div>
//       )}
//     </Container>
//   );
// };

// Styles for messages
// const messagesStyle = {
//   maxHeight: '300px',
//   overflowY: 'auto'
// };

// const messageSentStyle = {
//   margin: '10px',
//   backgroundColor: '#D0E9FF',  // Bleu clair pour les messages envoyés
//   padding: '8px 20px',
//   borderRadius: '20px',
//   maxWidth: '75%',
//   alignSelf: 'flex-end',
//   textAlign: 'right'
// };

// const messageReceivedStyle = {
//   margin: '10px',
//   backgroundColor: '#F1F1F1',  // Gris clair pour les messages reçus
//   padding: '8px 20px',
//   borderRadius: '20px',
//   maxWidth: '75%',
//   alignSelf: 'flex-start',
//   textAlign: 'left'
// };


// // Existing styles for the component
// const containerStyle = {
//   maxWidth: '400px',
//   background: '#f8f9fa',
//   padding: '20px',
//   borderRadius: '10px',
//   boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
//   fontFamily: 'Arial, sans-serif',
//   marginTop: '50px'
// };


// const inputStyle = {
//   borderRadius: '20px',
//   boxShadow: 'none'
// };

// const buttonStyle = {
//   borderRadius: '20px',
//   backgroundColor: '#007bff',
//   border: 'none'
// };

// const listGroupItemStyle = {
//   background: '#ffffff',
//   border: 'none',
//   marginBottom: '10px',
//   borderRadius: '10px',
//   display: 'flex',
//   alignItems: 'center',
//   padding: '10px'
// };

// const imgStyle = {
//   marginRight: '10px'
// };

// export default ChatApp;



// import React, { useState } from 'react';
// import { Container, Navbar, Form, InputGroup, FormControl, ListGroup, Button } from 'react-bootstrap';

// const ChatApp = () => {
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [messages, setMessages] = useState({});
//   const [search, setSearch] = useState("");

//   const handleUserSelect = user => {
//     setSelectedUser(user);
//     if (!messages[user]) {
//       setMessages(prevMessages => ({
//         ...prevMessages,
//         [user]: []
//       }));
//     }
//   };

//   const handleMessageSubmit = event => {
//     event.preventDefault();
//     const messageText = event.target.messageInput.value.trim();
//     if (messageText) {
//       setMessages({
//         ...messages,
//         [selectedUser]: [...messages[selectedUser], messageText]
//       });
//       event.target.messageInput.value = '';
//     }
//   };

//   const handleSearchChange = event => {
//     setSearch(event.target.value);
//   };

//   const users = ["User 1", "User 2", "User 3"].filter(user =>
//     user.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <Container style={containerStyle}>
//       <Navbar style={navbarStyle}>
//         <Navbar.Brand href="#">ChatApp</Navbar.Brand>
//       </Navbar>

//       <InputGroup className="mb-3">
//         <FormControl
//           style={inputStyle}
//           placeholder="Search by name"
//           aria-label="Search by name"
//           onChange={handleSearchChange}
//         />
//       </InputGroup>

//       <ListGroup>
//         {users.map((user, index) => (
//           <ListGroup.Item
//             key={index}
//             style={listGroupItemStyle}
//             onClick={() => handleUserSelect(user)}
//             action
//           >
//             <img src={`https://placehold.it/50x50`} alt={user} style={imgStyle} className="img-fluid rounded-circle"/>
//             {user}
//           </ListGroup.Item>
//         ))}
//       </ListGroup>

//       {selectedUser && (
//         <div>
//           <h4>Conversation with {selectedUser}</h4>
//           <div className="messages">
//             {messages[selectedUser].map((msg, idx) => (
//               <div key={idx} className="mb-2">{msg}</div>
//             ))}
//           </div>
//           <Form onSubmit={handleMessageSubmit}>
//             <Form.Group className="mb-3" controlId="messageInput">
//               <FormControl type="text" placeholder="Type a message..." style={inputStyle} />
//             </Form.Group>
//             <Button type="submit" style={buttonStyle}>
//               Send
//             </Button>
//           </Form>
//         </div>
//       )}
//     </Container>
//   );
// }

// export default ChatApp;

// const containerStyle = {
//   maxWidth: '400px',
//   background: '#f8f9fa',
//   padding: '20px',
//   borderRadius: '10px',
//   boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
//   fontFamily: 'Arial, sans-serif',
//   marginTop: '50px'
// };

// const navbarStyle = {
//   backgroundColor: 'transparent',
//   borderBottom: 'none',
//   paddingBottom: '0'
// };

// const inputStyle = {
//   borderRadius: '20px',
//   boxShadow: 'none'
// };

// const buttonStyle = {
//   borderRadius: '20px',
//   backgroundColor: '#007bff',
//   border: 'none'
// };

// const listGroupItemStyle = {
//   background: '#ffffff',
//   border: 'none',
//   marginBottom: '10px',
//   borderRadius: '10px',
//   display: 'flex',
//   alignItems: 'center',
//   padding: '10px'
// };

// const imgStyle = {
//   marginRight: '10px'
// };
