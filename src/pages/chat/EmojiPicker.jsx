// src/components/EmojiPicker.jsx
import React, { useState } from "react";
import { Button, Popover, OverlayTrigger } from "react-bootstrap";
import Picker from "emoji-picker-react";

const EmojiPicker = ({ onEmojiClick }) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleEmojiClick = (event, emojiObject) => {
    onEmojiClick(emojiObject);
    setShowPicker(false);
  };

  return (
    <OverlayTrigger
      trigger="click"
      placement="top"
      overlay={
        <Popover id="popover-emoji-picker">
          <Picker onEmojiClick={handleEmojiClick} />
        </Popover>
      }
      show={showPicker}
    >
      <Button variant="light" onClick={() => setShowPicker(!showPicker)}>
        😊
      </Button>
    </OverlayTrigger>
  );
};

export default EmojiPicker;
