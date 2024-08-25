import { Container, Row, Col, Image, Button } from 'react-bootstrap';



export const Skills = ({ competencesSkills }) => {
  console.log(competencesSkills)
  if (!competencesSkills || competencesSkills.length === 0) {
    return <p>Aucune compétence disponible</p>;
  }

  return (
    <div className="skills-container">
<h3 style={{ color: '#122A73' }}>Compétences</h3>
      <ul className="skills-list">
        {competencesSkills.map((competencesSkill, index) => (
          <li key={index}>
            <span className="checkmark">✔</span>
            {competencesSkill.toUpperCase()}
          </li>
          
        ))}
      </ul>
    </div>
  );
};


export const Bio = ({bio,nomComplet ,competences}) => {
  return (
        <Container className="text-center container-profile">
      <h2 style={{ color: '#122A73' }}>{nomComplet} Bio</h2>
      <p>{bio}</p>
      <div className="line"></div>
     <Skills competencesSkills={competences} />
    </Container>
  );
};

export const SkillSet = () => {
  return (
    <Container>
     
    </Container>
  );
};
