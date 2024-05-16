import React from "react";

const AudioPlayer = ({ audioFile }) => {
  if (!audioFile) {
    return null; // Do not display anything if no audio file is available
  }

  const audioSrc = URL.createObjectURL(audioFile);

  return (
    <audio controls controlsList="nodownload noplaybackrate">
      <source src={audioSrc} type={audioFile.type} />
      Your browser does not support the audio element.
    </audio>
  );
};

export default AudioPlayer;
