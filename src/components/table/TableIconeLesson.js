import React, { useState } from "react";
import { BiEdit, BiTrash } from "react-icons/bi";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import ModelLesson from "../modelLesson/ModelLesson";

const TableIconeLesson = ({
  lessonId,
  lessonName,
  handleUpdateLesson,
  dataLabel,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleClose = () => {
    setShowEditModal(false);
  };

  const handleSave = (lessonData) => {
    handleUpdateLesson(lessonData.id, lessonData.name);
    setShowEditModal(false);
  };

  return (
    <>
      <td data-label={dataLabel} style={{ alignItems: "center" }}>
        <OverlayTrigger
          overlay={<Tooltip>Modifier leçon</Tooltip>}
          placement="top"
          popperConfig={{
            modifiers: [{ name: "offset", options: { offset: [0, 8] } }],
          }}
        >
          <span className="icon-option" style={{ paddingLeft: "5px" }}>
            <BiEdit size={24} onClick={handleEdit} />
          </span>
        </OverlayTrigger>
        <span className="icon-option">
          <BiTrash size={24} />
        </span>
      </td>
      <ModelLesson
        show={showEditModal}
        handleClose={handleClose}
        onSaveLesson={handleSave}
        initialData={{ id: lessonId, name: lessonName }}
      />
    </>
  );
};

export default TableIconeLesson;
