import { Container, Row, Col, Image, Button } from 'react-bootstrap';

export const Bio = () => {
  return (
        <Container className="text-center container-profile">
      <h2 className="text-primary">John's Bio</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
      <div className="line"></div>
      <div className="skills-container">
        <h3 className="text-primary">Skill Set</h3>
        <ul className="skills-list">
          <li><span className="checkmark">✔</span>HTML</li>
          <li><span className="checkmark">✔</span>CSS</li>
          <li><span className="checkmark">✔</span>JavaScript</li>
          <li><span className="checkmark">✔</span>Python</li>
          <li><span className="checkmark">✔</span>C#</li>
        </ul>
      </div>
    </Container>
  );
};

export const SkillSet = () => {
  return (
    <Container>
     
    </Container>
  );
};
