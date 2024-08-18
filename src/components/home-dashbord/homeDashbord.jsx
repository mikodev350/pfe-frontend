import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import "./homeDashbordStyle.css";
import helloimg from "./Hello-cuate.png";

const HomeDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [note, setNote] = useState("");

  useEffect(() => {
    const storedNote = localStorage.getItem("note");
    if (storedNote) {
      setNote(storedNote);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("note", note);
  }, [note]);

  const handleNoteChange = (event) => {
    setNote(event.target.value);
  };

  return (
    <Container style={{ marginTop: "20px", marginLeft: "70px" }}>
      <Row>
        <Col md={8}>
          <Card className="mb-4 custom-card">
            <Card.Body className="custom-card-content">
              <div className="card-text-wrapper">
                <Card.Title><h3>Bonjour</h3></Card.Title>
                <Card.Text>
                  Bienvenue dans votre tableau de bord !&nbsp; Profitez d'un
                  aperçu clair de vos activités et d'outils pour une gestion
                  optimisée.
                </Card.Text>
              </div>
              <img
                src={helloimg}
                alt="Description de l'image"
                className="custom-image"
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} style={{marginLeft:'auto',marginTop:'-10px'}}>
          <Card className="mb-4 custom-card-column ">
            <Card.Body className="custom-card-column-content">
              <div className="custom-calendar-wrapper">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  inline
                  calendarClassName="custom-calendar"
                  dayClassName={() => "custom-day"}
                />
              </div>
              <div className="notes-wrapper">
                <Card.Title>Notes</Card.Title>
                <Form.Group controlId="noteTextArea " >
                  {/* <Form.Label>Écrivez vos notes ici :</Form.Label> */}
                  <Form.Control
                    as="textarea"
                    rows={8}
                    value={note}
                    onChange={handleNoteChange}

                  />
                </Form.Group>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomeDashboard;
