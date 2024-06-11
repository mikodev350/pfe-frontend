import React from 'react';
import { Card, Row, Col, Container, Badge } from 'react-bootstrap';
import { FaTools, FaBook, FaChalkboardTeacher, FaBookReader } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const cardStyle = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
};

const cardBodyStyle = {
  flex: 1,
};

const ResourceResults = ({ results }) => {
  if (!Array.isArray(results) || results.length === 0) {
    return <div>No results found.</div>;
  }

  return (
    <Container>
      <Row>
        {results.map((result) => (
          <Col key={result.id} sm={12} md={6} lg={4} className="mb-4">
            <Card style={cardStyle}>
              <Card.Body style={cardBodyStyle}>
                <Card.Title className="text-primary">{result.name}</Card.Title>
                <Card.Text>
                  <FaBook className="me-2" />
                  <strong>Parcours:</strong> {result.parcours}
                </Card.Text>
                <Card.Text>
                  <FaChalkboardTeacher className="me-2" />
                  <strong>Modules:</strong> {result.modules}
                </Card.Text>
                <Card.Text>
                  <FaBookReader className="me-2" />
                  <strong>Lessons:</strong> {result.lessons}
                </Card.Text>
                <Card.Text>
                  <FaTools className="me-2" />
                  <strong>Resources:</strong> {result.resources}
                </Card.Text>
              </Card.Body>
              {/* <Link to={`/student/resource-preview/${result.id}`}>
        <span className="icon-option">
          <BiDetail size={23} />
        </span>
      </Link>` */}
              <div className="d-flex justify-content-between p-3">
                <Badge as={Link} to={`/student/resource-preview/${result.id}`} bg="info" className="me-2">
                  View Resource
                </Badge>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ResourceResults;




// import React from 'react';
// import { Card, Row, Col, Container, Badge } from 'react-bootstrap';
// import { FaBook, FaChalkboardTeacher, FaBookReader, FaTools } from 'react-icons/fa';
// import { Link } from 'react-router-dom';

// const cardStyle = {
//   height: '100%',
//   display: 'flex',
//   flexDirection: 'column',
// };

// const cardBodyStyle = {
//   flex: 1,
// };

// const SearchResults = ({ results }) => {
//   if (!Array.isArray(results) || results.length === 0) {
//     return <div>No results found.</div>;
//   }

//   return (
//     <Container>
//       <Row>
//         {results.map((result) => (
//           <Col key={result.id} sm={12} md={6} lg={4} className="mb-4">
            
//             <Card style={cardStyle}>
//               <Card.Body style={cardBodyStyle}>
//                                 <Card.Text>
//                   <FaTools className="me-2" />
//                   <strong>Resources:</strong> {result.resources}
//                 </Card.Text>
//                 <Card.Title className="text-primary">{result.name}</Card.Title>
//                 <Card.Text>
//                   <FaBook className="me-2" />
//                   <strong>Parcours:</strong> {result.parcours}
//                 </Card.Text>
//                 <Card.Text>
//                   <FaChalkboardTeacher className="me-2" />
//                   <strong>Modules:</strong> {result.modules}
//                 </Card.Text>
//                 <Card.Text>
//                   <FaBookReader className="me-2" />
//                   <strong>Lessons:</strong> {result.lessons}
//                 </Card.Text>

//               </Card.Body>
//               <div className="d-flex justify-content-between p-3">
//                 <Badge as={Link} to={`/resource/${result.id}`} bg="info" className="me-2">
//                   View Resource
//                 </Badge>
                
//               </div>
//             </Card>
//           </Col>
//         ))}
//       </Row>
//     </Container>
//   );
// };

// export default SearchResults;



// import React from 'react';
// import { Card, Row, Col, Container, Badge } from 'react-bootstrap';
// import { FaBook, FaChalkboardTeacher, FaBookReader, FaTools } from 'react-icons/fa';
// import { Link } from 'react-router-dom';

// const cardStyle = {
//   height: '100%',
//   display: 'flex',
//   flexDirection: 'column',
// };

// const cardBodyStyle = {
//   flex: 1,
// };

// const SearchResults = ({ results }) => {
//   if (!Array.isArray(results) || results.length === 0) {
//     return <div>No results found.</div>;
//   }

//   return (
//     <Container>
//       <Row>
//         {results.map((result) => (
//           <Col key={result.id} sm={12} md={6} lg={4} className="mb-4">
            
//             <Card style={cardStyle}>
//               <Card.Body style={cardBodyStyle}>
//                                 <Card.Text>
//                   <FaTools className="me-2" />
//                   <strong>Resources:</strong> {result.resources}
//                 </Card.Text>
//                 <Card.Title className="text-primary">{result.name}</Card.Title>
//                 <Card.Text>
//                   <FaBook className="me-2" />
//                   <strong>Parcours:</strong> {result.parcours}
//                 </Card.Text>
//                 <Card.Text>
//                   <FaChalkboardTeacher className="me-2" />
//                   <strong>Modules:</strong> {result.modules}
//                 </Card.Text>
//                 <Card.Text>
//                   <FaBookReader className="me-2" />
//                   <strong>Lessons:</strong> {result.lessons}
//                 </Card.Text>

//               </Card.Body>
//               <div className="d-flex justify-content-between p-3">
//                 <Badge as={Link} to={`/resource/${result.id}`} bg="info" className="me-2">
//                   View Resource
//                 </Badge>
                
//               </div>
//             </Card>
//           </Col>
//         ))}
//       </Row>
//     </Container>
//   );
// };

// export default SearchResults;
