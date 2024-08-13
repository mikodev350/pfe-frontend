import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const styles = {
    assignmentItem: {
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        border: 'none',
        borderRadius: '8px',
        marginBottom: '10px',
        backgroundColor: '#f8f9fa',
        padding: '15px',
        textAlign: 'left',  // Alignement à gauche
    },
    assignmentItemHover: {
        transform: 'translateY(-5px)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#ffffff',
    },
    assignmentLink: {
        color: '#343a40',
        textDecoration: 'none',
        transition: 'color 0.2s ease-in-out',
        display: 'flex',  // Utilisation de flex pour aligner le badge à gauche du texte
        alignItems: 'center',  // Alignement vertical du texte et du badge
    },
    assignmentLinkHover: {
        color: '#007bff',
    },
    responsiveItem: {
        flexDirection: 'column',
        alignItems: 'flex-start',  // Alignement à gauche
    },
    responsiveAlignment: {
        marginTop: '10px',
        width: '100%',
        justifyContent: 'flex-start',  // Alignement à gauche
    },
    sectionTitle: {
        marginBottom: '20px',
        borderBottom: '2px solid #007bff',
        paddingBottom: '10px',
        color: '#007bff',
        textAlign: 'left',  // Alignement à gauche
    },
    statusBadge: {
        marginLeft: '10px',
        padding: '2px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        color: '#fff',
    },
    statusBadgeDone: {
        backgroundColor: '#28a745', // Vert pour "fait"
    },
    statusBadgePending: {
        backgroundColor: '#dc3545', // Rouge pour "non fait"
    },
};

function AssignmentList() {
    const [hovered, setHovered] = useState(null);

    const assignments = [
        { id: 1, title: 'Devoir 1', dueDate: '2024-08-20', status: 'En attente', type: 'Devoir' },
        { id: 2, title: 'Quiz 1', dueDate: '2024-08-22', status: 'Soumis', type: 'Quiz' }
    ];

    const devoirs = assignments.filter(assignment => assignment.type === 'Devoir');
    const quiz = assignments.filter(assignment => assignment.type === 'Quiz');

    const renderAssignments = (assignments) => {
        return assignments.map((assignment) => (
            <div
                key={assignment.id}
                style={{
                    ...styles.assignmentItem,
                    ...(hovered === assignment.id ? styles.assignmentItemHover : {}),
                }}
                onMouseEnter={() => setHovered(assignment.id)}
                onMouseLeave={() => setHovered(null)}
            >
                <div style={styles.responsiveItem}>
                    <Link 
                        to={`/assignments/${assignment.id}`} 
                        style={styles.assignmentLink}
                    >
                        <strong>{assignment.title}</strong>
                        <span 
                            style={{
                                ...styles.statusBadge,
                                ...(assignment.status === 'Soumis' ? styles.statusBadgeDone : styles.statusBadgePending),
                            }}
                        >
                            {assignment.status === 'Soumis' ? 'Fait' : 'Non fait'}
                        </span>
                    </Link>
                    <small style={{ color: '#6c757d' }}>Date limite: {assignment.dueDate}</small>
                </div>
                <div style={styles.responsiveAlignment}>
                    <Link 
                        to={`/assignments/${assignment.id}`} 
                        style={hovered === assignment.id ? styles.assignmentLinkHover : {}}
                    >
                        Voir les détails
                    </Link>
                </div>
            </div>
        ));
    };

    return (
        <div className="assignment-list" style={{ padding: '20px' }}>
            <h2 style={styles.sectionTitle}>Mes Devoirs</h2>
            {renderAssignments(devoirs)}
            <h2 style={styles.sectionTitle}>Mes Quiz</h2>
            {renderAssignments(quiz)}
        </div>
    );
}

export default AssignmentList;
