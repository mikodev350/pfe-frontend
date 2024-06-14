import React from 'react';
import { Alert } from 'react-bootstrap';
import { FaExclamationTriangle } from 'react-icons/fa';

const styles = {
  errorPage: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f8f9fa', // Couleur de fond gris clair pour toute la page
    padding: '20px',
  },
  alertContainer: {
    maxWidth: '600px',
    width: '100%',
    textAlign: 'center',
    borderRadius: '8px',
    border: '1px solid #f5c6cb',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  header: {
    fontSize: '2rem',
    margin: '20px 0',
  },
  message: {
    fontSize: '1.25rem',
    margin: '20px 0',
  },
  icon: {
    marginBottom: '20px',
    color: '#721c24',
  },
};

const ErrorPage = ({ message }) => {
  return (
    <div style={styles.errorPage}>
      <div style={styles.alertContainer}>
        <FaExclamationTriangle size={70} style={styles.icon} />
        <h2 style={styles.header}>Erreur</h2>
        <p style={styles.message}>{message}</p>
      </div>
    </div>
  );
};

export default ErrorPage;
