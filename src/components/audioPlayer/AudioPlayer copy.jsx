import React, { useEffect, useState } from "react";

const AudioPlayer = ({ audioUrl }) => {
  console.log(audioUrl);
  const [audioSrc, setAudioSrc] = useState(null);

  useEffect(() => {
    const fetchAudio = async () => {
      if (navigator.onLine) {
        console.log("Online: Using provided audio URL:", audioUrl);
        setAudioSrc(audioUrl);
      } else {
        try {
          console.log("Offline: Trying to fetch audio from cache");
          const cache = await caches.open('resource-files');
          const cachedResponse = await cache.match(audioUrl);

          if (cachedResponse) {
            const blob = await cachedResponse.blob();
            const blobUrl = URL.createObjectURL(blob);
            console.log("Audio fetched from cache, Blob URL:", blobUrl);
            setAudioSrc(blobUrl);
          } else {
            console.error("Audio not found in cache.");
          }
        } catch (error) {
          console.error("Error fetching audio from cache:", error);
        }
      }
    };

    fetchAudio();

    return () => {
      if (audioSrc && audioSrc.startsWith('blob:')) {
        console.log("URL.revokeObjectURL(audioSrc)");
        console.log(URL.revokeObjectURL(audioSrc))
        URL.revokeObjectURL(audioSrc);

      }
    };
  }, [audioUrl]);

  if (!audioSrc) {
    return <p>Loading audio...</p>;
  }

  return (
    <audio controls controlsList="nodownload noplaybackrate">
      <source src={audioSrc} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  );
};

export default AudioPlayer;
