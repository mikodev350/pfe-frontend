import React, { useEffect, useState } from "react";

const AudioPlayer = ({ audioFile }) => {
  const [audioSrc, setAudioSrc] = useState(null);

  useEffect(() => {
    let objectUrl = null;
    if (audioFile instanceof Blob || audioFile instanceof File) {
      objectUrl = URL.createObjectURL(audioFile);
      setAudioSrc(objectUrl);
    } else if (typeof audioFile === 'string') {
      setAudioSrc(audioFile);
    }
    
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [audioFile]);

  if (!audioSrc) {
    return null; // Do not display anything if no audio source is available
  }

  return (
    <audio controls controlsList="nodownload noplaybackrate">
      <source src={audioSrc} type={audioFile.type || 'audio/mpeg'} />
      Your browser does not support the audio element.
    </audio>
  );
};

export default AudioPlayer;
