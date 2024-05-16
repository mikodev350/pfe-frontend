import React from "react";
import { Link } from "react-router-dom";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import UpdateSection from "../modelSection/UpdateSection";
import { BiArchive, BiTrash } from "react-icons/bi";
// import { getToken } from "../../util/authUtils";

export default function TableIconeSection({
  sectionId,
  sectionName,
  dataLabel,
  className,
  handleUpdateSection,
}) {
  //   const token = React.useMemo(() => getToken(), []);

  return (
    <td className={`action ${className}`} data-label={dataLabel}>
      <OverlayTrigger
        overlay={
          <Tooltip>
            Access to <strong>resource</strong>.
          </Tooltip>
        }
        placement="top"
        popperConfig={{
          modifiers: [{ name: "offset", options: { offset: [0, 8] } }],
        }}
      >
        <Link
          to={`/student/resource/${sectionId}`}
          className="icon-option "
          style={{ color: "black" }}
        >
          <BiArchive size={22} />
        </Link>
      </OverlayTrigger>
      <span className="icon-option" style={{ paddingLeft: "5px" }}>
        <UpdateSection
          sectionId={sectionId}
          currentName={sectionName}
          handleSubmit={handleUpdateSection}
        />
      </span>
      <span className="icon-option">
        <BiTrash size={22} />
      </span>
    </td>
  );
}
