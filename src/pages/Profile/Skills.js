import React from "react";
import { Container, Row, Col, Image, Button } from "react-bootstrap";

export const Skills = ({ competences }) => {
  if (!competences || competences.length === 0) {
    return <p>Aucune compétence disponible</p>;
  }

  return (
    <div className="skills-container">
      <h3 className="text-primary">Compétences</h3>
      <ul className="skills-list">
        {competences.map((competence, index) => (
          <li key={index}>
            <span className="checkmark">✔</span>
            {competence}
          </li>
        ))}
      </ul>
    </div>
  );
};
