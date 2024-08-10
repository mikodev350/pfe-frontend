import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement);

const Progression = () => {
  const { id, type } = useParams();
  const [progressData, setProgressData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data;
        if (type === 'student') {
          data = {
            name: 'Alice Dupont',
            modules: ['Module 1', 'Module 2', 'Module 3'],
            scores: [80, 90, 75],
            average: 82,
          };
        } else if (type === 'group') {
          data = {
            name: 'Groupe 1',
            modules: ['Module 1', 'Module 2', 'Module 3'],
            students: [
              { name: 'Alice Dupont', scores: [85, 70, 80] },
              { name: 'Bob Martin', scores: [78, 75, 90] },
            ],
            average: 78,
          };
        }
        setProgressData(data);
      } catch (error) {
        console.error('Error fetching progress data:', error);
      }
    };

    fetchData();
  }, [id, type]);

  const barChartData = {
    labels: progressData ? progressData.modules : [],
    datasets: [
      {
        label: 'Score',
        data: progressData ? (type === 'student' ? progressData.scores : progressData.students.map(student => student.scores.reduce((a, b) => a + b) / student.scores.length)) : [],
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
        data: progressData ? (type === 'student' ? progressData.scores : progressData.students.map(student => student.scores.reduce((a, b) => a + b) / student.scores.length)) : [],
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
            {type === 'student'
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
                    <th>{type === 'student' ? 'Module/Quiz' : 'Étudiant'}</th>
                    {progressData.modules.map((module, index) => (
                      <th key={index}>{module}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {type === 'student' ? (
                    <tr>
                      <td>{progressData.name}</td>
                      {progressData.scores.map((score, index) => (
                        <td key={index}>{score}%</td>
                      ))}
                    </tr>
                  ) : (
                    progressData.students.map((student, index) => (
                      <tr key={index}>
                        <td>{student.name}</td>
                        {student.scores.map((score, scoreIndex) => (
                          <td key={scoreIndex}>{score}%</td>
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
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Progression;
