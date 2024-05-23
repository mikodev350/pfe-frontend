import React from "react";
import { useDispatch, useSelector } from "react-redux";

// !need to add Redux
// import { onClearFile, UploadFilesState } from "features/uploadFile/uploadFile";
import { Button } from "react-bootstrap";
import { AiFillCloseCircle } from "react-icons/ai";
import UploadedFile from "./UploadedFile";
import styled from "styled-components";
import { onClearFile } from "../../../redux/features/upload-slice";

const SectionContainer = styled.div`
  border-radius: 15px;
  margin-top: -50px;
  width: 100%;
  height: 100px;
  display: grid;
  background-color: #d3d6dc;
  grid-template-columns: 70px auto;
  position: relative;
  z-index: 1;
`;

const ClearButtonContainer = styled.div``;

const ClearButton = styled(Button)`
  &.btn-delete-images {
    background-color: white;
  }
`;

const ScrollableContainer = styled.div`
  overflow-y: scroll;
  margin-right: 30px;
  margin-top: 15px;
`;

export default function UploadFilesSection() {
  const { files } = useSelector((state) => state.upload);
  const dispatch = useDispatch();

  return (
    <SectionContainer>
      <ClearButtonContainer>
        <ClearButton
          className="btn-delete-images"
          onClick={() => dispatch(onClearFile())}
        >
          <AiFillCloseCircle size={20} color="#F18A90" />
        </ClearButton>
      </ClearButtonContainer>
      <ScrollableContainer>
        {files?.map((item, index) => (
          <UploadedFile file={item.file} key={index} />
        ))}
      </ScrollableContainer>
    </SectionContainer>
  );
}
