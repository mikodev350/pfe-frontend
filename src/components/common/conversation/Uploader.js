import React, { useRef } from "react";
import { Button } from "react-bootstrap";
import { FiImage, FiPaperclip } from "react-icons/fi";
import { useDispatch } from "react-redux";
import axios from "axios";
// import { onAddNewImage, onAddNewFile } from "features/uploadFile/uploadFile";
import byteSize from "byte-size";
import styled from "styled-components";
import {
  onAddNewFile,
  onAddNewImage,
} from "../../../redux/features/upload-slice";

const Container = styled.span`
  display: inline-block;
`;

const StyledButton = styled(Button)`
  margin-right: 5px;
`;

const HiddenFileInput = styled.input`
  display: none;
`;
const customUnits = {
  simple: [
    { from: 0, to: 1e3, unit: "" },
    { from: 1e3, to: 1e6, unit: "K", long: "thousand" },
    { from: 1e6, to: 1e9, unit: "Mn", long: "million" },
    { from: 1e9, to: 1e12, unit: "Bn", long: "billion" },
  ],
};

export default function Uploader({ type }) {
  const { value, unit } = byteSize(10000, { customUnits, units: "simple" });

  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const fileInputClicked = () => {
    console.log("clicked");
    if (fileInputRef.current) {
      console.log("clicked");
      fileInputRef.current.click();
    }
  };

  const filesSelected = () => {
    if (fileInputRef.current && fileInputRef.current.files) {
      if (fileInputRef.current.files.length) {
        for (let i = 0; i < fileInputRef.current.files.length; i++) {
          let blobURL = window.URL.createObjectURL(
            fileInputRef.current.files[i]
          );
          if (type === "IMAGES") {
            let uploadFile = {
              url: "",
              id: i.toString(),
              blobURL,
              file: fileInputRef.current.files[i],
            };
            console.log(uploadFile);
            dispatch(onAddNewImage({ uploadFile }));
          } else {
            let uploadFile = {
              url: "",
              id: i.toString(),
              file: fileInputRef.current.files[i],
              source: axios.CancelToken.source(),
            };
            console.log(uploadFile);
            dispatch(onAddNewFile({ uploadFile }));
          }
        }
      }
    }
  };

  return (
    <Container>
      {type === "IMAGES" ? (
        <>
          <StyledButton
            onClick={fileInputClicked}
            className="btn-icon-square-white"
          >
            <FiImage size={20} />
          </StyledButton>
          <HiddenFileInput
            ref={fileInputRef}
            type="file"
            multiple
            onChange={filesSelected}
          />
        </>
      ) : (
        <>
          <StyledButton
            onClick={fileInputClicked}
            className="btn-icon-square-white"
          >
            <FiPaperclip size={20} />
          </StyledButton>
          <HiddenFileInput
            ref={fileInputRef}
            type="file"
            multiple
            onChange={filesSelected}
          />
        </>
      )}
    </Container>
  );
}
