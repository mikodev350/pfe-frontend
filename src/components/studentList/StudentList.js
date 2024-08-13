import React from "react";
import { ListGroup } from "react-bootstrap";
import { FiMessageSquare, FiFileText, FiBarChart2 } from "react-icons/fi";
import { Link } from "react-router-dom";

const StudentList = ({ students }) => (
  <ListGroup variant="flush">
    {students?.map((student) => (
      <ListGroup.Item
        key={student.id}
        className="student-list-item"
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.03)";
          e.currentTarget.style.boxShadow = "0px 8px 16px rgba(0, 0, 0, 0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1.0)";
          e.currentTarget.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.05)";
        }}
      >
        <div className="student-icon-container">
          <span>{student.username.charAt(0)}</span>
        </div>
        <div className="student-name">{student.username}</div>
        <div className="student-detail">{student.email}</div>
        <div className="student-actions">
          <Link to="/" className="student-action-button" title="Message">
            <FiMessageSquare size={20} />
          </Link>
          <Link to="/" className="student-action-button" title="Quiz/Devoirs">
            <FiFileText size={20} />
          </Link>
          <Link
            to={`/student/progression/student/${student.id}`}
            className="student-action-button"
            title="Progress"
          >
            <FiBarChart2 size={20} />
          </Link>
        </div>
      </ListGroup.Item>
    ))}
  </ListGroup>
);

export default StudentList;
