import React from "react";
import { Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import { FaShareAlt } from "react-icons/fa";
import { generateResourceLink } from "../../api/apiResource";
import { getToken } from "../../util/authUtils";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        <Button variant="link" onClick={handleGenerateLink}>
          <FaShareAlt style={{ color: "white" }} />
        </Button>
      </OverlayTrigger>
    </>
  );
};

export default GenerateLinkButton;
