import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { Row, Col, Card, Form } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "react-datepicker/dist/react-datepicker.css";
import "./homeDashboardStyle.css";
import helloimg from "./Hello-cuate.png";
import { FaBook } from "react-icons/fa"; // Icon for resources
import { fetchNotes, fetchRecentAssignments } from "../../api/apiStudent";
import styled from "styled-components";

const StyledCard = styled.div`
  background-color: #ffffff; /* White background */
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1); /* Shadow effect */
  border-radius: 15px; /* Rounded borders */
  padding: 20px; /* Padding for the card content */
  margin-bottom: 20px; /* Space below the card */
`;

// Initialize Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const HomeDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [note, setNote] = useState("");
  const [recentResources, setRecentResources] = useState([]);
  const [notesData, setNotesData] = useState([]);

  useEffect(() => {
    const storedNote = localStorage.getItem("note");
    if (storedNote) {
      setNote(storedNote);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("note", note);
  }, [note]);

  // Fetch notes when component mounts
  useEffect(() => {
    const getNotes = async () => {
      try {
        const notes = await fetchNotes();
        setNotesData(notes); // Update state with fetched notes
      } catch (error) {
        console.error("Erreur lors de la récupération des notes:", error);
      }
    };

    getNotes();
  }, []);

  // Fetch recent assignments for the resources section
  useEffect(() => {
    const getRecentAssignments = async () => {
      try {
        const assignments = await fetchRecentAssignments();
        console.log(assignments);
        
        setRecentResources(assignments); // Set the fetched assignments as recent resources
      } catch (error) {
        console.error("Erreur lors de la récupération des assignations récentes:", error);
      }
    };

    getRecentAssignments();
  }, []);

  // Prepare data for the chart
  const chartData = {
    labels: notesData.map((note) => note.titre), // Titles as labels
    datasets: [
      {
        label: "Notes",
        data: notesData.map((note) => note.score), // Scores as data
        backgroundColor: "rgba(54, 162, 235, 0.7)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
        borderRadius: 10,
      },
    ],
  };

  const handleNoteChange = (event) => {
    setNote(event.target.value);
  };

  return (
    <StyledCard>
      <Row>
        <Col md={9}>
          {/* Welcome Card */}
          <Card className="mb-4 custom-card">
            <Card.Body className="custom-card-content">
              <div className="card-text-wrapper">
                <Card.Title><h3>Bonjour</h3></Card.Title>
                <Card.Text>
                  Bienvenue dans votre tableau de bord ! Profitez d'un aperçu clair de vos activités et d'outils pour une gestion optimisée.
                </Card.Text>
              </div>
              <img
                src={helloimg}
                alt="Description de l'image"
                className="custom-image"
              />
            </Card.Body>
          </Card>

          {/* Performance Chart Section */}
          <Row>
            <Col md={7}>
              <Card className="mb-4 custom-card graph-card">
                <Card.Body>
                  <Card.Title>Performance par Module</Card.Title>
                  <Bar data={chartData} options={{ responsive: true }} />
                </Card.Body>
              </Card>
            </Col>

            {/* Recent Resources Section */}
            <Col>
              <Card className="mb-4 custom-card resources-card">
                <Card.Body>
                  <Card.Title>Ressources Récentes</Card.Title>
                  <ul className="resources-list">
                    {recentResources.map((resource) => (
                      <li key={resource.id} className="resource-item">
                        <FaBook className="resource-icon" />
                        <div className="resource-text">
                          <strong>{resource.nom}</strong>
                          <em className="resource-date"> - {resource.date
}</em>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>

        {/* Calendar and Notes Section */}
        <Col md={3} className="side-column">
          <Card className="mb-4 custom-card-column">
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
                <Form.Group controlId="noteTextArea">
                  <Form.Control
                    as="textarea"
                    rows={8}
                    value={note}
                    onChange={handleNoteChange}
                    className="note-textarea"
                  />
                </Form.Group>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      </StyledCard>
  );
};

export default HomeDashboard;
