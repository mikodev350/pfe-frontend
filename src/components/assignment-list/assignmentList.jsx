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
    },
    assignmentLinkHover: {
        color: '#007bff',
    },
    responsiveItem: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    responsiveAlignment: {
        marginTop: '10px',
        width: '100%',
        justifyContent: 'space-between',
    },
};

function AssignmentList() {
    const [hovered, setHovered] = useState(null);

    const assignments = [
        { id: 1, title: 'Devoir 1', dueDate: '2024-08-20', status: 'En attente' },
        { id: 2, title: 'Quiz 1', dueDate: '2024-08-22', status: 'Soumis' }
    ];

    return (
        <div className="assignment-list" style={{ padding: '20px' }}>
            <h2 style={{ marginBottom: '20px' }}>Mes Devoirs/Quiz</h2>
            {assignments.map((assignment) => (
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
            ))}
        </div>
    );
}

export default AssignmentList;
