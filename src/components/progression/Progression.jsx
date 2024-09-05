import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement } from 'chart.js';
import axios from 'axios';
import styled from 'styled-components';
import { getToken } from '../../util/authUtils';
import Loader from '../loader/Loader';
import Retour from '../retour-arriere/Retour';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement);

// Styled components
const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const StyledCard = styled.div`
  background-color: #ffffff;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
`;

const CardHeader = styled.div`
  background-color: #10266F;
  color: #fff;
  padding: 10px;
  border-radius: 10px 10px 0 0;
  font-size: 1.2em;
`;

const CardBody = styled.div`
  padding: 20px;
`;

const ProgressText = styled.h5`
  color: #007bff;
  margin-bottom: 30px;
`;

const ChartContainer = styled.div`
  margin-bottom: 30px;
`;

const TableContainer = styled.div`
  margin-top: 30px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 1em;
  background-color: #f8f9fa;

  th, td {
    padding: 12px 15px;
    border: 1px solid #dee2e6;
    text-align: center;
  }

  th {
    background-color: #e9ecef;
  }
`;

const Progression = () => {
  const { id, type } = useParams();
  const [progressData, setProgressData] = useState(null);
  const [hasProgress, setHasProgress] = useState(true);

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

        if (data.length === 0) {
          setHasProgress(false);
          return;
        }

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
        setHasProgress(false);
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
        fill: true,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.4,
      },
    ],
  };

  return (
    <Container>
      <Retour />
      {!hasProgress ? (
        <StyledCard>
          <CardHeader>Aucune progression disponible</CardHeader>
          <CardBody>
            <p>Il semble qu'aucune donnée de progression ne soit disponible pour le moment.</p>
          </CardBody>
        </StyledCard>
      ) : progressData ? (
        <StyledCard>
          <CardHeader>
            {type.toUpperCase() === 'INDIVIDUEL'
              ? `Progression de l'étudiant: ${progressData.name}`
              : `Progression du groupe: ${progressData.name}`}
          </CardHeader>
          <CardBody>
            <ProgressText>Progression Moyenne: {progressData.average}%</ProgressText>
            <ChartContainer>
              <Bar data={barChartData} options={{ responsive: true }} />
            </ChartContainer>
            <ChartContainer>
              <Line data={lineChartData} options={{ responsive: true }} />
            </ChartContainer>
            <TableContainer>
              <h5 style={{ color: '#007bff' }}>Notes</h5>
              <StyledTable>
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
              </StyledTable>
            </TableContainer>
          </CardBody>
        </StyledCard>
      ) : (
        <Loader />
      )}
    </Container>
  );
};

export default Progression;
