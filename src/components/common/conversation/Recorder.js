import React, { useEffect, useState } from "react";

import axios from "axios";
import { Button } from "react-bootstrap";
import { FiMic } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  onRestStop,
  onRec,
  getAudioURL,
} from "../../../redux/features/recorder-slice";

let gumStream = null;
let chunks = [];

const Recorder = ({ socket, conversationId }) => {
  const { stop, recording } = useSelector((state) => state.recorder);
  const [recorder, setRecorder] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (recorder) {
      startRecording();
    }
  }, [recorder]);

  useEffect(() => {
    if (stop) {
      stopRecording();
      return () => {
        dispatch(onRestStop());
      };
    }
  }, [stop]);

  const int = async () => {
    if (recording) {
      stopRecording();
    } else {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      setRecorder(new MediaRecorder(stream));
    }
  };

  const startRecording = async () => {
    chunks = [];
    try {
      dispatch(onRec({ recording: true }));
      recorder.start();

      recorder.ondataavailable = function (e) {
        chunks.push(e.data);
      };
    } catch (error) {
      console.log(error);
    }
  };

  const stopRecording = () => {
    recorder.stop();
    recorder.onstop = (e) => {
      let audio = document.createElement("audio");
      audio.controls = true;
      let blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
      let audioURL = window.URL.createObjectURL(blob);
      audio.src = audioURL;
      chunks = [];
      dispatch(getAudioURL({ audiolocalURL: audioURL, blob: blob }));

      recorder.stream.getAudioTracks().forEach((track) => {
        track.stop();
        console.log(track);
      });
      console.log(recorder);
      setRecorder(null);
    };
  };

  return (
    <div style={{ display: "inline", width: "40px" }}>
      <Button
        style={{ marginRight: "5px" }}
        className={`btn-icon-square-${recording ? "red recording" : "white"}`}
        onClick={int}
      >
        <FiMic size={20} />
      </Button>
    </div>
  );
};

export default Recorder;
