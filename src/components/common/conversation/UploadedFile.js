import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { FiPaperclip, FiTrash2 } from "react-icons/fi";
import { AiOutlineCloseCircle } from "react-icons/ai";
import axios from "axios";
import byteSize from "byte-size";

import styled from "styled-components";
import { onUpdateFile } from "../../../redux/features/upload-slice";

const ItemUploadContainer = styled.div`
  width: 93%;
  display: flex;
  align-items: center;
`;

const BoxIcon = styled.div`
  margin-right: 8px;
`;

const TextContainer = styled.div`
  flex-grow: 1;
  overflow: hidden;
`;

const FileName = styled.p`
  overflow: hidden;
  height: 20px;
  margin: 0;
`;

const FileDetails = styled.span`
  display: block;
`;

const DeleteIcon = styled.div`
  cursor: pointer;
`;

const customUnits = {
  simple: [
    { from: 0, to: 1e3, unit: "" },
    { from: 1e3, to: 1e6, unit: "K", long: "thousand" },
    { from: 1e6, to: 1e9, unit: "Mn", long: "million" },
    { from: 1e9, to: 1e12, unit: "Bn", long: "billion" },
  ],
};
export default function UploadedFile({ file, progress, status, source }) {
  const dispatch = useDispatch();
  const [calculateByteSize, setCalculateByteSize] = useState("0");

  const [uploaded, setUploaded] = useState(false);

  useEffect(() => {
    if (file) {
      const { value, unit } = byteSize(file.size, {
        customUnits,
        units: "simple",
      });
      setCalculateByteSize(value + unit);
    }
  }, [file]);

  const handleRemoveFile = () => {
    if (uploaded) {
      // Implement remove file logic here
    } else {
    }
  };
  const handleCancelUpload = () => {
    source.abort("Cancelled by user");
  };
  return (
    <div className="item-upload" style={{ width: "93%" }}>
      <div className="item-upload-box-icon">
        <FiPaperclip size={16} color="#9CA3AF" />
      </div>
      <div className="item-upload-text" style={{ overflow: "hidden" }}>
        <p style={{ overflow: "hidden", height: "20px", margin: 0 }}>
          {file.name}
        </p>
        <span>
          {calculateByteSize} | {progress}/100
        </span>
      </div>
      {/* {status === "UPLOADING" && (
        <div onClick={() => handleCancelUpload(file)}>
          <AiOutlineCloseCircle
            size={20}
            color="#F18A90"
            className="item-upload-delete-icon"
          />
        </div>
      )} */}
      {status === "PREUPLOAD" && (
        <div onClick={() => handleRemoveFile(file)}>
          <FiTrash2
            size={20}
            color="#F18A90"
            className="item-upload-delete-icon"
          />
        </div>
      )}
    </div>
  );
}
