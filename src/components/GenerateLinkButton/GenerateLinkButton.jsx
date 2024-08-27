import React from "react";
import { Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import { FaShareAlt } from "react-icons/fa";
import { generateResourceLink } from "../../api/apiResource";
import { getToken } from "../../util/authUtils";
import { toast, ToastContainer } from 'react-toastify';
import styled from "styled-components";
import 'react-toastify/dist/ReactToastify.css';

const StyledButton = styled(Button)`
  background-color: #ffffff !important; /* White background */
  border: none;
  color: #007bff !important; /* Blue icon color */
  font-size: 1.5rem;
  width: 50px !important;
  height: 50px !important;
  padding: 0; /* Remove inner padding */
  border-radius: 50% !important; /* Fully rounded button */
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: #e6f0ff !important; /* Lighter blue on hover */
  }
`;

const GenerateLinkButton = ({ resourceId }) => {
  const authToken = React.useMemo(() => getToken(), []);

  const handleGenerateLink = async () => {
    try {
      const data = await generateResourceLink(resourceId, authToken);
      const link = data.link;
      navigator.clipboard.writeText(link);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      console.error("Error generating link:", error);
      toast.error("Error generating link");
    }
  };

  return (
    <>
      <ToastContainer />
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id="button-tooltip">Share</Tooltip>}
      >
        <StyledButton variant="link" onClick={handleGenerateLink}>
          <FaShareAlt />
        </StyledButton>
      </OverlayTrigger>
    </>
  );
};

export default GenerateLinkButton;
