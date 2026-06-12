"use client";

import React, { useState, useEffect, useRef } from "react";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Attempt to autoplay on mount (might be blocked by browser policy)
    if (audioRef.current) {
      audioRef.current.volume = 0.2; // 20% volume so it's ambient
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay blocked, wait for user interaction
            setIsPlaying(false);
          });
      }
    }
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/audio/north_province.ogg" loop />
      <button 
        onClick={togglePlay}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          background: "var(--ghost-accent-color)",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          zIndex: 9999,
          transition: "transform 0.2s"
        }}
        title={isPlaying ? "Mute Music" : "Play Ambient Music"}
        onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
      >
        <i className={`fa-solid ${isPlaying ? "fa-volume-high" : "fa-volume-xmark"}`}></i>
      </button>
    </>
  );
}
