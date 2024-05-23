import React from "react";
import { FiStopCircle } from "react-icons/fi";
import { useDispatch } from "react-redux";

import { useStopwatch } from "react-timer-hook";
import { onStop } from "../../../redux/features/recorder-slice";

const Timer = () => {
  const { seconds, minutes, hours, isRunning } = useStopwatch({
    autoStart: true,
  });
  const dispatch = useDispatch();

  const handleStopClick = () => {
    dispatch(onStop());
  };

  return (
    <div
      style={{
        position: "relative",
        border: "1px solid gray",
        padding: "15px",
        borderRadius: 15,
        width: "100%",
        backgroundColor: "#dee1e6",
      }}
    >
      <div style={{ textAlign: "left" }}>
        <div style={{ fontSize: "14px" }}>
          <span>{seconds < 10 ? `0${seconds}` : seconds}</span>:
          <span>{minutes < 10 ? `0${minutes}` : minutes}</span>:
          <span>{hours < 10 ? `0${hours}` : hours}</span>
        </div>
      </div>
    </div>
  );
};

export default Timer;
