import React from "react";
import { useDispatch, useSelector } from "react-redux";

//!DO THE SAME AFTER ADD NEW REDUX
// import { onClearImages } from "features/uploadFile/uploadFile";
import { Button } from "react-bootstrap";

import UploadedImage from "./UploadedImage";
import styled from "styled-components";
// import { onClearImages } from "../../../redux/features/upload-slice";

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

const DeleteButtonContainer = styled.div`
  margin-right: 10px;
`;

const DeleteButton = styled(Button)`
  & .btn-delete-images {
    background-color: white;
  }
`;

const ScrollableContainer = styled.div`
  overflow-y: scroll;
`;

export default function ImagesMessage({ files }) {
  return (
    <SectionContainer>
      <ScrollableContainer>
        {files?.map((item, index) => (
          <UploadedImage
            url={item?.file?.url}
            id={item.id}
            key={index}
            withoutAction={true}
          />
        ))}
      </ScrollableContainer>
    </SectionContainer>
  );
}
