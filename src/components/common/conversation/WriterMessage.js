import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { FiSend, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import Recorder from "./Recorder";
import Timer from "./Timer";

import Uploader from "./Uploader";
import UploadImagesSection from "./UploadImagesSection";
import UploadFilesSection from "./UploadFilesSection";
import { onClearRecorder } from "../../../redux/features/recorder-slice";
import "./styles.css";
export default function WriterMessage({
  socket,
  conversationId,
  createMessage,
}) {
  const { images, files } = useSelector((state) => state.upload);
  const [focus, setFocus] = useState(false);
  const [messageValue, setMessageValue] = useState("");
  const [sending, setSending] = useState(false);
  const { recording, audiolocalURL, blob } = useSelector(
    (state) => state.recorder
  );
  const dispatch = useDispatch();

  const onSendMessage = () => {
    setSending(true);
    // socket?.emit("createMessage", {
    //   conversationId: conversationId,
    //   body: recording ? audiolocalURL : messageValue,
    //   type: recording ? "VOICE" : "TEXT",
    // });

    createMessage({
      message:
        images.length > 0
          ? images
          : files.length > 0
          ? files
          : audiolocalURL
          ? audiolocalURL
          : messageValue,
      type: audiolocalURL
        ? "VOICE"
        : images.length > 0
        ? "IMAGES"
        : files.length > 0
        ? "FILES"
        : "TEXT",
    });
    setSending(false);
    setMessageValue("");
    dispatch(onClearRecorder());
  };

  //   useEffect(() => {
  //     if (conversationId) {
  //       socket?.on("createMessage", (message) => {
  //         console.log(message);
  //         if (message.user.id === localStorage.getItem("userId")) {
  //           setSending(false);
  //         }
  //       });
  //       return () => {
  //         socket?.off("createMessage");
  //       };
  //     }
  //   }, [conversationId, socket]);
  console.log(images);
  return (
    <div className="writer-message-section">
      <div className="writer-message-card">
        <div className="writer-message-body">
          <div
            style={{ position: "relative" }}
            className={` ${
              focus
                ? "writer-focus"
                : recording || images?.length || files?.length
                ? "recording-focus"
                : audiolocalURL
                ? "recording-Finished"
                : "writer-not-focus"
            } `}
          >
            {!recording && audiolocalURL === "" ? (
              <>
                {images.length ? (
                  <UploadImagesSection />
                ) : files.length ? (
                  <UploadFilesSection />
                ) : (
                  <Form.Control
                    value={messageValue}
                    onChange={(e) => setMessageValue(e.target.value)}
                    placeholder="Type your message"
                    className="form-input-message"
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                  />
                )}
              </>
            ) : recording ? (
              <Timer />
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#dee1e6",
                  borderRadius: 15,
                  padding: "0px 20px",
                }}
              >
                <FiTrash2
                  size={20}
                  color="#bb434b"
                  style={{ cursor: "pointer" }}
                  onClick={() => dispatch(onClearRecorder())}
                />
                <audio
                  className="audio-player "
                  controls
                  src={audiolocalURL}
                  type="audio/ogg"
                  style={{ marginLeft: 10 }}
                />
                <FiSend
                  size={20}
                  color="black"
                  style={{ cursor: "pointer" }}
                  onClick={onSendMessage}
                />{" "}
              </div>
            )}
          </div>
          <div
            style={{
              position: "absolute",
              top: "17px",
              right: recording ? "0px" : "150px",
            }}
          >
            <Uploader type="IMAGES" />
          </div>
          <div
            style={{
              position: "absolute",
              top: "17px",
              right: recording ? "0px" : "100px",
            }}
          >
            <Uploader type="FILES" />
          </div>
          <div
            style={{
              position: "absolute",
              top: "17px",
              right: recording ? "0px" : "50px",
            }}
          >
            <Recorder />
          </div>

          {!recording && !audiolocalURL && (
            <>
              <div style={{ position: "absolute", top: "17px", right: "0px" }}>
                <Button
                  style={{ marginRight: "5px" }}
                  className={`btn-icon-square-blue `}
                  onClick={onSendMessage}
                  disabled={sending}
                >
                  <FiSend size={16} color="white" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
