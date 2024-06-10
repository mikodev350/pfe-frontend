import React from "react";
import { FiBook } from "react-icons/fi";
import { Link } from "react-router-dom";
import { BiDetail, BiEdit, BiTrash } from "react-icons/bi";

export default function TableIconeResource({ id, dataLabel }) {
  return (
    <td data-label={dataLabel} style={{ alignItems: "center" }}>
      <Link to={`/student/resource-preview/${id}`}>
        <span className="icon-option">
          <BiDetail size={23} />
        </span>
      </Link>
      <Link to={`/student/update-resource/${id}`}>
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
