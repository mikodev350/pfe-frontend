import React from "react";

const YouTubeVideo = ({ videoId }) => {
  // Expression régulière améliorée pour mieux capturer l'ID de la vidéo
  const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const extractedVideoId = videoId.match(regex)?.[1];

  if (!extractedVideoId) {
    return <div>Invalid video ID.</div>; // Affichage d'un message en cas d'ID non valide
  }

  const videoUrl = `https://www.youtube.com/embed/${extractedVideoId}`;
  return (
    <div className="video-container">
      <iframe
        width="560"
        height="315"
        src={videoUrl}
        title="YouTube Video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default YouTubeVideo;
