import React from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { useDispatch } from "react-redux";

// !NOTE: change onRemoveImage with new redux

import styled from "styled-components";
import { onRemoveImage } from "../../../redux/features/upload-slice";
import { openViewer } from "../../../redux/features/image-slice";

const Container = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  background-color: white;
  border-radius: 15px;
  margin: 10px;
  float: left;
`;

const CloseButton = styled(AiFillCloseCircle)`
  size: 20px;
  color: #f18a90;
  background-color: white;
  border: 2px solid white;
  border-radius: 100%;
  position: absolute;
  bottom: 5px;
  right: 30px;
  cursor: pointer;
`;

const ImgContainer = styled.div`
  cursor: ${({ isClickible }) => (isClickible ? "pointer" : "auto  ")};
  width: 80px;
`;

const Img = styled.img`
  height: 100%;
  width: 100%;
  max-height: 80px;
  max-width: 100%;
  min-height: 80px;
  display: block;
  margin: auto;
  object-fit: contain;
`;

export default function UploadedImage({ url, id, withoutAction = false }) {
  const dispatch = useDispatch();
  const handleOpenViewer = () => {
    if (!!id) {
      dispatch(openViewer({ url }));
    }
  };
  return (
    <Container>
      {id && <CloseButton onClick={() => dispatch(onRemoveImage({ id }))} />}
      <ImgContainer onClick={handleOpenViewer} isClickible={!id}>
        <Img src={url} />
      </ImgContainer>
    </Container>
  );
}
