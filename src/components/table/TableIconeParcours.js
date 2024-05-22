import React from "react";
import { Link } from "react-router-dom";
import { BiArchive, BiEdit, BiTrash } from "react-icons/bi";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
export default function TableIconeParcours({ parcoursId, dataLabel }) {
  return (
    <td data-label={dataLabel} style={{ alignItems: "center" }}>
      <OverlayTrigger
        overlay={
          <Tooltip>
            Access to <strong>module</strong>.
          </Tooltip>
        }
        placement="top"
        popperConfig={{
          modifiers: [{ name: "offset", options: { offset: [0, 8] } }],
        }}
      >
        <Link
          to={`/student/modules/${parcoursId}`}
          className="icon-option"
          style={{ paddingLeft: "5px", color: "black" }}
        >
          <BiArchive size={24} />
        </Link>
      </OverlayTrigger>

      <Link to={`/pathways/edit/${parcoursId}`}>
        <span className="icon-option">
          <BiEdit size={24} />
        </span>
      </Link>
      <span>
        <BiTrash size={24} />
      </span>
    </td>
  );
}
