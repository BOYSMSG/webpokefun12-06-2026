"use client";

import React, { useState, useEffect, useRef } from "react";

export default function SettingsWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState("EN");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize theme from local storage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark-mode");
    }

    // Try to autoplay music
    if (audioRef.current) {
      audioRef.current.volume = 0.2;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    }

    // Load Google Translate script
    const addGoogleTranslateScript = () => {
      if (!document.getElementById("google-translate-script")) {
        const script = document.createElement("script");
        script.id = "google-translate-script";
        script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);
        
        (window as any).googleTranslateElementInit = () => {
          new (window as any).google.translate.TranslateElement(
            { pageLanguage: 'en', autoDisplay: true },
            'google_translate_element'
          );
        };
      }
    };
    addGoogleTranslateScript();

    // Event listener for auto-pausing music (e.g. when Reels play)
    const handlePauseMusic = () => {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };
    window.addEventListener("pauseGlobalMusic", handlePauseMusic);

    return () => {
      window.removeEventListener("pauseGlobalMusic", handlePauseMusic);
    };
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

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  const cycleLanguage = () => {
    const langs = ["EN", "HI", "ES", "FR"];
    const idx = langs.indexOf(language);
    const next = langs[(idx + 1) % langs.length];
    setLanguage(next);
  };

  return (
    <>
      <audio ref={audioRef} src="/audio/north_province.ogg" loop />
      
      <div style={{
        position: "fixed",
        bottom: "30px",
        right: "30px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "15px",
        zIndex: 9999
      }}>
        {/* Menu Options */}
        <div style={{
          display: isOpen ? "flex" : "none",
          flexDirection: "column",
          gap: "10px",
          background: "var(--ghost-accent-color)",
          padding: "15px",
          borderRadius: "20px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          animation: "fadeInUp 0.3s ease"
        }}>
          
          <div id="google_translate_element" style={{ background: "rgba(0,0,0,0.2)", borderRadius: "10px", padding: "5px" }}></div>
          
          <button onClick={togglePlay} className="settings-btn" title="Toggle Music">
            <i className={`fa-solid ${isPlaying ? "fa-volume-high" : "fa-volume-xmark"}`}></i>
            <span>Music</span>
          </button>
          
          <button onClick={toggleTheme} className="settings-btn" title="Toggle Theme">
            <i className={`fa-solid ${isDarkMode ? "fa-sun" : "fa-moon"}`}></i>
            <span>Theme</span>
          </button>
        </div>

        {/* Main Toggle Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: "var(--ghost-accent-color)",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "60px",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            transition: "transform 0.2s"
          }}
          title="Settings"
          onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"}
          onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          <i className={`fa-solid ${isOpen ? "fa-times" : "fa-cog"}`} style={{ transition: "0.3s", transform: isOpen ? "rotate(90deg)" : "none" }}></i>
        </button>
      </div>
      
      <style>{`
        .settings-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(0,0,0,0.2);
          color: white;
          border: none;
          padding: 8px 15px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
          transition: 0.2s;
        }
        .settings-btn:hover {
          background: rgba(0,0,0,0.4);
          transform: translateX(-5px);
        }
        .settings-btn i {
          width: 20px;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* Hide Google Translate Branding */
        .goog-te-gadget {
          font-size: 0px !important;
          color: transparent !important;
          pointer-events: none !important; /* Make extra text/links unclickable */
        }
        .goog-te-gadget .goog-te-combo {
          font-size: 14px !important;
          color: black !important;
          margin: 0 !important;
          pointer-events: auto !important; /* Keep dropdown clickable */
        }
        .goog-te-gadget a, .goog-logo-link {
          display: none !important;
          pointer-events: none !important;
        }
        .goog-te-gadget img {
          display: none !important;
        }
        #goog-gt-tt, .goog-te-balloon-frame {
          display: none !important;
        }
        .goog-text-highlight {
          background: none !important;
          box-shadow: none !important;
        }
        body { top: 0 !important; } /* Prevents top spacing from translate bar */
        .skiptranslate iframe { display: none !important; } /* Hides top banner */
      `}</style>
    </>
  );
}
