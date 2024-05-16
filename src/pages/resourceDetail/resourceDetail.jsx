import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Col, Button, Container, Row } from "react-bootstrap";

// Sample data simulating different resource types
const resources = [
  {
    id: 1,
    type: 'text',
    content: '<p>This is <strong>HTML</strong> text content.</p>',
  },
  {
    id: 2,
    type: 'image',
    url: 'https://via.placeholder.com/150',
    altText: 'Placeholder Image',
  },
  {
    id: 3,
    type: 'pdf',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
  {
    id: 4,
    type: 'audio',
    url: 'https://www.w3schools.com/html/horse.ogg',
  },
  {
    id: 5,
    type: 'video',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
  }
];

function ResourceDetail() {
  const { resouceId } = useParams(); // Corrected typo here
  const [resource, setResource] = useState(null);

  useEffect(() => {
    // Convert resouceId to a number and find the resource
    const id = parseInt(resouceId, 10); // Ensure integer parsing with radix 10
    console.log(id);
    const foundResource = resources.find(res => res.id === id);
    setResource(foundResource);
  }, [resouceId]);

  // Function to determine and render content based on resource type
  const renderContent = () => {
    if (!resource) return <p>No resource found for ID: {resouceId}</p>; // Correct variable name used here

    switch (resource.type) {
      case 'text':
        return <div dangerouslySetInnerHTML={{ __html: resource.content }} />;
      case 'image':
        return <img src={resource.url} alt={resource.altText || 'Resource Image'} />;
      case 'pdf':
        return <iframe src={resource.url} style={{ width: '100%', height: '500px' }} title="PDF Content" />;
      case 'audio':
        return <audio controls src={resource.url} />;
      case 'video':
        return <video controls src={resource.url} style={{ width: '100%' }} />;
      default:
        return <p>Unsupported resource type.</p>;
    }
  };

  const largeHTMLContent = `
  <h1>Welcome to Our Learning Platform</h1>
  <p>This platform is designed to help you <strong>learn and grow</strong> in your career. Here's what you can find in our resources:</p>
  <ul>
    <li>Interactive courses</li>
    <li>Detailed articles</li>
    <li>Hands-on projects</li>
  </ul>
  <p>Here are some tips to get the most out of your learning experience:</p>
  <ol>
    <li>Set clear goals for what you want to achieve.</li>
    <li>Take notes as you go through the materials.</li>
    <li>Practice regularly to reinforce new knowledge and skills.</li>
  </ol>
  <h2>Course Materials</h2>
  <p>We provide a variety of courses across different subjects. Below is a table of some top courses you might be interested in:</p>
  <table border="1">
    <tr>
      <th>Course Name</th>
      <th>Subject</th>
      <th>Duration</th>
    </tr>
    <tr>
      <td>Introduction to Programming</td>
      <td>Computer Science</td>
      <td>4 weeks</td>
    </tr>
    <tr>
      <td>Advanced Photography</td>
      <td>Arts</td>
      <td>6 weeks</td>
    </tr>
    <tr>
      <td>Business Management Essentials</td>
      <td>Business</td>
      <td>8 weeks</td>
    </tr>
  </table>
  <p>For more information, please <a href='#'>contact us</a> or visit our FAQ section.</p>
  <footer>
    <p>Thank you for choosing our platform to enhance your skills. We wish you the best of luck on your learning journey!</p>
  </footer>
`;
  return (
     <Container className="baground-exam ">
          <Row className="padding-row-top margin-left padding-form ">
            <div dangerouslySetInnerHTML={{ __html: largeHTMLContent }} />
      {renderContent()}
      </Row>
      </Container>
  );
}

export default ResourceDetail;
