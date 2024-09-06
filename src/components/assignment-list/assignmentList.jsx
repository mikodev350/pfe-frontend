import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchStudentAssignations } from '../../api/apiDevoir';  // Import de la fonction de récupération des assignations

const styles = {
    assignmentItem: {
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        border: 'none',
        borderRadius: '8px',
        marginBottom: '10px',
        backgroundColor: '#f8f9fa',
        padding: '15px',
        textAlign: 'left',
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
        display: 'flex',
        alignItems: 'center',
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
        justifyContent: 'flex-start',
    },
    sectionTitle: {
        marginBottom: '20px',
        borderBottom: '2px solid #007bff',
        paddingBottom: '10px',
        color: '#007bff',
        textAlign: 'left',
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
    statusBadgeModifiable: {
        backgroundColor: '#ffc107', // Jaune pour "Fait, peut toujours être modifié"
    },
};

function AssignmentList() {
    const [assignments, setAssignments] = useState([]);
    const [hovered, setHovered] = useState(null);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const token = localStorage.getItem('token'); // Assurez-vous que le token est bien stocké
                const data = await fetchStudentAssignations(token); // Appel API pour récupérer les assignations de l'étudiant
                setAssignments(data);
            } catch (error) {
                console.error("Erreur lors de la récupération des assignations :", error);
            }
        };

        fetchAssignments();
    }, []);

    const getStatusBadgeStyle = (status) => {
        switch (status) {
            case "Fait":
                return styles.statusBadgeDone;
            case "Fait, peut toujours être modifié":
                return styles.statusBadgeModifiable;
            default:
                return styles.statusBadgePending;
        }
    };

    const renderAssignments = (assignments) => {
        return assignments.map((assignment) => {
            const link =
                assignment.type === 'QUIZ'
                    ? `/dashboard/evaluation/quiz?id=${assignment.id}`
                    : `/dashboard/assignments/${assignment.id}`;

            const isCompleted = assignment.status === "Fait";

            return (
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
                        {!isCompleted ? (
                            <Link 
                                to={link} 
                                style={styles.assignmentLink}
                            >
                                <strong>{assignment.titre}</strong>
                                <span 
                                    style={{
                                        ...styles.statusBadge,
                                        ...getStatusBadgeStyle(assignment.status),
                                    }}
                                >
                                    {assignment.status}
                                </span>
                            </Link>
                        ) : (
                            <div style={styles.assignmentLink}>
                                <strong>{assignment.titre}</strong>
                                <span 
                                    style={{
                                        ...styles.statusBadge,
                                        ...getStatusBadgeStyle(assignment.status),
                                    }}
                                >
                                    {assignment.status}
                                </span>
                            </div>
                        )}
                        <small style={{ color: '#6c757d' }}></small>
                        <br/>
                    </div>
                    <div style={styles.responsiveAlignment}>
                        {!isCompleted && (
                            <Link 
                                to={link} 
                                style={hovered === assignment.id ? styles.assignmentLinkHover : {}}
                            >
                                Voir les détails
                            </Link>
                        )}
                    </div>
                </div>
            );
        });
    };

    const devoirs = assignments.filter(assignment => assignment.type === 'DEVOIR');
    const quiz = assignments.filter(assignment => assignment.type === 'QUIZ');

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
