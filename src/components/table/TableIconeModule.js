import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BiDetail, BiEdit, BiTrash } from "react-icons/bi";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import ModelModule from "../modelModule/ModelModule"; // Adjust the import path as necessary

const TableIconeModule = ({
  moduleId,
  moduleName,
  dataLabel,
  handleUpdateModule,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleClose = () => {
    setShowEditModal(false);
  };

  const handleSave = (moduleData) => {
    handleUpdateModule(moduleData.id, moduleData.name);
    setShowEditModal(false);
  };

  return (
    <>
      <td data-label={dataLabel} style={{ alignItems: "center" }}>
        <OverlayTrigger
          overlay={<Tooltip>Accès au lecon</Tooltip>}
          placement="top"
          popperConfig={{
            modifiers: [{ name: "offset", options: { offset: [0, 8] } }],
          }}
        >
          <Link
            to={`/student/lessons/${moduleId}`}
            className="icon-option"
            style={{ color: "black" }}
          >
            <BiDetail size={23} />
          </Link>
        </OverlayTrigger>
        <span className="icon-option" style={{ paddingLeft: "5px" }}>
          <BiEdit size={24} onClick={handleEdit} />
        </span>
        <span className="icon-option">
          <BiTrash size={24} />
        </span>
      </td>
      <ModelModule
        show={showEditModal}
        handleClose={handleClose}
        onSave={handleSave}
        initialData={{ id: moduleId, name: moduleName }}
      />
    </>
  );
};

export default TableIconeModule;
