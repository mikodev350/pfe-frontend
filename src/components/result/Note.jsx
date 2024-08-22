import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { fetchNotes } from '../../api/apiStudent';

// Initialisation de Chart.js avec les composants nécessaires
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Note = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getNotes = async () => {
      try {
        const data = await fetchNotes();
        setNotes(data);
      } catch (error) {
        console.error('Erreur lors du chargement des notes:', error);
      } finally {
        setLoading(false);
      }
    };

    getNotes();
  }, []);

  if (loading) {
    return <p>Chargement...</p>;
  }

  const chartData = {
    labels: notes.map(note => note.titre),
    datasets: [
      {
        label: 'Scores',
        data: notes.map(note => note.score),
        backgroundColor: 'rgba(93, 173, 226, 0.7)',
        borderColor: 'rgba(93, 173, 226, 1)',
        borderWidth: 2,
        borderRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Votre progression', font: { size: 18 } },
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Votre progression</h2>
      <div style={styles.chartContainer}>
        <Bar data={chartData} options={chartOptions} />
      </div>

      <div style={styles.cardsContainer}>
        {notes.map((note, index) => (
          <div key={index} style={styles.card}>
            <h3 style={styles.cardTitle}>{note.titre}</h3>
            <p style={styles.cardScore}>
              Type: <strong>{note.type}</strong>
            </p>
            <p style={styles.cardScore}>
              Score: <strong>{note.score}/20</strong>
            </p>
            <div style={styles.progressBarContainer}>
              <div
                style={{
                  ...styles.progressBar,
                  width: `${(note.score / 20) * 100}%`,
                }}
              />
            </div>
            <p style={styles.percentage}>{(note.score / 20) * 100}%</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    backgroundColor: '#f4f6f9',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  header: {
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: '20px',
  },
  chartContainer: {
    marginBottom: '30px',
  },
  cardsContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    width: '250px',
    textAlign: 'center',
    transition: 'transform 0.3s ease',
  },
  cardTitle: {
    fontSize: '18px',
    color: '#2980b9',
    marginBottom: '10px',
  },
  cardScore: {
    fontSize: '16px',
    marginBottom: '10px',
    color: '#34495e',
  },
  progressBarContainer: {
    backgroundColor: '#e0e0e0',
    borderRadius: '5px',
    overflow: 'hidden',
    marginBottom: '10px',
  },
  progressBar: {
    height: '10px',
    backgroundColor: '#3498db',
  },
  percentage: {
    fontSize: '14px',
    color: '#27ae60',
  },
};

export default Note;
