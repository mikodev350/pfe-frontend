import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement } from 'chart.js';
import axios from 'axios';
import { getToken } from '../../util/authUtils';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement);

const Progression = () => {
  const { id, type } = useParams();
  const [progressData, setProgressData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        const response = await axios.get(`http://localhost:1337/api/assignations-custom/${type}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = response.data;

        if (type.toUpperCase() === 'INDIVIDUEL') {
          setProgressData({
            name: data[0]?.etudiant || 'Étudiant Inconnu',
            modules: data.map(assignation => assignation.devoir || assignation.quiz),
            scores: data.map(assignation => assignation.score),
            average: data.reduce((sum, assignation) => sum + assignation.score, 0) / data.length,
          });
        } else if (type.toUpperCase() === 'GROUP') {
          const students = data.reduce((acc, assignation) => {
            const studentIndex = acc.findIndex(student => student.name === assignation.etudiant);
            if (studentIndex > -1) {
              acc[studentIndex].scores.push(assignation.score);
            } else {
              acc.push({
                name: assignation.etudiant,
                scores: [assignation.score],
              });
            }
            return acc;
          }, []);

          setProgressData({
            name: data[0]?.group || 'Groupe Inconnu',
            modules: [...new Set(data.map(assignation => assignation.devoir || assignation.quiz))],
            students,
            average: data.reduce((sum, assignation) => sum + assignation.score, 0) / data.length,
          });
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données de progression:', error);
      }
    };

    fetchData();
  }, [id, type]);

  const barChartData = {
    labels: progressData ? progressData.modules : [],
    datasets: [
      {
        label: 'Score',
        data: progressData ? (type.toUpperCase() === 'INDIVIDUEL' ? progressData.scores : progressData.students.map(student => student.scores.reduce((a, b) => a + b) / student.scores.length)) : [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const lineChartData = {
    labels: progressData ? progressData.modules : [],
    datasets: [
      {
        label: 'Progression Over Time',
        data: progressData ? (type.toUpperCase() === 'INDIVIDUEL' ? progressData.scores : progressData.students.map(student => student.scores.reduce((a, b) => a + b) / student.scores.length)) : [],
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div style={{ padding: '20px' }}>
      {progressData ? (
        <Card>
          <Card.Header>
            {type.toUpperCase() === 'INDIVIDUEL'
              ? `Progression de l'étudiant: ${progressData.name}`
              : `Progression du groupe: ${progressData.name}`}
          </Card.Header>
          <Card.Body>
            <h5>Progression Moyenne: {progressData.average}%</h5>
            <div style={{ marginBottom: '30px' }}>
              <Bar data={barChartData} options={{ responsive: true }} />
            </div>
            <div>
              <Line data={lineChartData} options={{ responsive: true }} />
            </div>
            <div style={{ marginTop: '30px' }}>
              <h5>Notes</h5>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>{type.toUpperCase() === 'INDIVIDUEL' ? 'Module/Quiz' : 'Étudiant'}</th>
                    {progressData.modules.map((module, index) => (
                      <th key={index}>{module}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {type.toUpperCase() === 'INDIVIDUEL' ? (
                    <tr>
                      <td>{progressData.name}</td>
                      {progressData.scores.map((score, index) => (
                        <td key={index}>{score} / 20 ({(score / 20) * 100}%)</td>
                      ))}
                    </tr>
                  ) : (
                    progressData.students.map((student, index) => (
                      <tr key={index}>
                        <td>{student.name}</td>
                        {progressData.modules.map((module, moduleIndex) => (
                          <td key={moduleIndex}>{student.scores[moduleIndex]} / 20 ({(student.scores[moduleIndex] / 20) * 100}%)</td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
};

export default Progression;
