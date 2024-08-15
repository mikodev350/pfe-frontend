import React from "react";
import { ListGroup, Button } from "react-bootstrap";
import { FiEdit2, FiTrash2, FiFileText } from "react-icons/fi";
import { Link } from "react-router-dom";

const GroupList = ({
  groups,
  handleEditGroup,
  handleDeleteGroup,
  handleAssignTask,
}) => (
  <ListGroup variant="flush">
    {groups?.map((group) => (
      <ListGroup.Item
        key={group.id}
        className="group-list-item"
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.03)";
          e.currentTarget.style.boxShadow = "0px 8px 16px rgba(0, 0, 0, 0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1.0)";
          e.currentTarget.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.05)";
        }}
      >
        <div className="group-icon-container">
          <span>{group.nom.charAt(0)}</span>
        </div>
        <div className="group-name">
          {group.nom}
          <div style={{ fontSize: "0.85rem", color: "#6c757d" }}>
            {group.membres && group.membres.length > 0 ? (
              <span>
                Membres:{" "}
                {group.membres.map((member) => member.username).join(", ")}
              </span>
            ) : (
              <p>Aucun membre</p>
            )}
          </div>
        </div>
        <div className="group-detail">
          <span>Professeur: {group.professeur.username}</span>
        </div>
        <div className="group-actions">
          <Link
            to={`/student/progression/group/${group.id}`}
            className="group-action-button"
            title="Progress"
          >
            <FiFileText size={20} />
          </Link>
          <Button
            variant="link"
            className="group-action-button"
            onClick={() => handleEditGroup(group)}
            title="Modifier le Groupe"
          >
            <FiEdit2 size={20} />
          </Button>
          <Button
            variant="link"
            className="group-action-button"
            onClick={() => handleDeleteGroup(group.id)}
            title="Supprimer le Groupe"
          >
            <FiTrash2 size={20} />
          </Button>
          <Button
            variant="link"
            className="group-action-button"
            onClick={() => handleAssignTask(group.id)}
            title="Assigner une tâche"
          >
            <FiFileText size={20} />
          </Button>
        </div>
      </ListGroup.Item>
    ))}
  </ListGroup>
);

export default GroupList;
