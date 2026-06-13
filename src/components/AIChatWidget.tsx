"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/Toast";

export default function AIChatWidget() {
  const { data: session } = useSession();
  const toastObj = useToast();
  
  // Menu State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeWindow, setActiveWindow] = useState<'chat' | 'notifications' | 'settings' | null>(null);
  
  // Chat State
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
    { role: 'ai', content: "Hello Trainer! I'm the Pokefun AI Assistant. Ask me anything or check your notifications!" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Notifications State
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Settings State 
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [msgSounds, setMsgSounds] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeWindow === 'chat') scrollToBottom();
  }, [messages, activeWindow]);

  // Fetch Notifications
  const fetchNotifications = () => {
    fetch('/api/notifications')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setNotifications(data.notifications);
          setUnreadCount(data.unreadCount || 0);
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (activeWindow === 'notifications') {
      fetchNotifications();
      setUnreadCount(0); // Mark as read locally
      fetch('/api/notifications', { method: 'PUT' }).catch(() => {}); // Mark as read on server
    }
  }, [activeWindow]);

  // Ping Activity & Check Unread Polling
  useEffect(() => {
    if (!session?.user) return;
    
    const checkUnread = () => {
      fetch('/api/notifications')
        .then(res => res.json())
        .then(data => {
            if (activeWindow !== 'notifications' && data.unreadCount !== undefined) {
               setUnreadCount(data.unreadCount);
            }
            if (data.notifications && data.notifications.length > 0) {
               try {
                 const toastedStr = window.sessionStorage.getItem('toastedNotifs') || '[]';
                 const toasted = JSON.parse(toastedStr);
                 let newToasts = false;
                 
                 data.notifications.forEach((n: any) => {
                   const isUnread = !(n.readBy || []).includes(session?.user?.email);
                   if (isUnread && !toasted.includes(n._id)) {
                     
                     let shouldSuppress = false;
                     const isMsg = n.title?.toLowerCase().includes('message') || n.title?.toLowerCase().includes('reply');
                     if (isMsg) {
                       const urlParams = new URLSearchParams(window.location.search);
                       const activeContact = (window as any).__activeChatContact || urlParams.get('user');
                       if (window.location.pathname.includes('/messages') && activeContact && n.title.includes(`@${activeContact}`)) {
                         shouldSuppress = true;
                       } else if ((window as any).__activeWidgetWindow === 'messages') {
                         shouldSuppress = true;
                       }
                     }
                     
                     if (!shouldSuppress) {
                       toastObj.info(`${n.title}`, n.url);
                     } else {
                       // Automatically mark this notification as read on the server so red dot disappears!
                       fetch('/api/notifications/read', {
                         method: 'POST',
                         headers: { 'Content-Type': 'application/json' },
                         body: JSON.stringify({ notificationIds: [n._id] })
                       }).catch(() => {});
                     }
                     
                     toasted.push(n._id);
                     if (!shouldSuppress) {
                       newToasts = true;
                     }
                     
                     // Play Sound if not muted
                     if (localStorage.getItem('muteMsgSound') !== 'true' && !shouldSuppress) {
                        try {
                          const audioUrl = isMsg ? '/audio/message.mp3' : '/audio/notification.wav';
                          const audio = new Audio(audioUrl);
                          audio.play().catch(() => {});
                        } catch(e) {}
                     }
                   }
                 });
                 
                 if (newToasts) {
                   window.sessionStorage.setItem('toastedNotifs', JSON.stringify(toasted));
                 }
               } catch(e) {}
            }
        }).catch(() => {});
    };

    // Initial ping and check
    fetch('/api/user/active', { method: 'PUT' }).catch(() => {});
    checkUnread();
    
    const intervalId = setInterval(() => {
      fetch('/api/user/active', { method: 'PUT' }).catch(() => {});
      checkUnread();
    }, 30000); // 30 seconds

    return () => clearInterval(intervalId);
  }, [session, activeWindow]);

  // Expose activeWindow globally for PushManager to check
  useEffect(() => {
    (window as any).__activeWidgetWindow = activeWindow;
  }, [activeWindow]);

  // Settings Effects (Music, Theme, Translate)
  const originalTitle = useRef<string>("");

  useEffect(() => {
    if (typeof document !== 'undefined') {
       if (!originalTitle.current && document.title) {
          originalTitle.current = document.title.replace(/^\(\d+\)\s*/, '');
       }
       if (unreadCount > 0) {
         document.title = `(${unreadCount}) ${originalTitle.current || 'PokeFun'}`;
       } else if (originalTitle.current) {
         document.title = originalTitle.current;
       }
    }
  }, [unreadCount]);

  useEffect(() => {
    // Theme setup
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark-mode");
    }

    // Message Sounds setup
    const muteSound = localStorage.getItem("muteMsgSound");
    if (muteSound === "true") {
      setMsgSounds(false);
    }

    // Audio setup via HTMLAudioElement Ref
    if (audioRef.current) {
      audioRef.current.volume = 0.2;
      // Music is now OFF by default. User can turn it on via the settings widget.
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
            'google_translate_element_ai_hub'
          );
        };
      }
    };
    addGoogleTranslateScript();
    
    const handlePause = () => {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setMusicPlaying(false);
      }
    };
    window.addEventListener('pauseGlobalMusic', handlePause);
    
    return () => {
      if (audioRef.current) audioRef.current.pause();
      window.removeEventListener('pauseGlobalMusic', handlePause);
    };
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (musicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      }
      setMusicPlaying(!musicPlaying);
    }
  };

  const toggleMsgSounds = () => {
    if (msgSounds) {
      localStorage.setItem("muteMsgSound", "true");
      setMsgSounds(false);
    } else {
      localStorage.setItem("muteMsgSound", "false");
      setMsgSounds(true);
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

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });
      
      const data = await res.json();
      
      if (data.error) {
        setMessages(prev => [...prev, { role: 'ai', content: "Error: " + data.error }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', content: data.response }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I am currently offline." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenWindow = (windowName: 'chat' | 'notifications' | 'settings') => {
    setActiveWindow(windowName);
    setIsMenuOpen(false);
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
        alignItems: "flex-end",
        gap: "15px",
        zIndex: 9999
      }}>
        
        {/* Floating Windows */}
        <div style={{
          display: activeWindow ? "flex" : "none",
          flexDirection: "column",
          width: "350px",
          height: "480px",
          background: "#1c1f21",
          borderRadius: "20px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.6)",
          border: "1px solid rgba(255,255,255,0.1)",
          animation: "fadeInUp 0.3s ease",
          overflow: "hidden"
        }}>
          
          {/* Header */}
          <div style={{ background: "linear-gradient(135deg, #10b981, #059669)", padding: "15px", color: "white", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ background: "white", color: "#10b981", borderRadius: "50%", width: "35px", height: "35px", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.2rem" }}>
              <i className={`fa-solid ${activeWindow === 'chat' ? 'fa-robot' : activeWindow === 'notifications' ? 'fa-bell' : 'fa-cog'}`}></i>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem", textTransform: 'capitalize' }}>
                {activeWindow === 'chat' ? 'Pokefun AI' : activeWindow}
              </h3>
            </div>
            
            <button onClick={() => setActiveWindow(null)} style={{ background: "transparent", border: "none", color: "white", cursor: "pointer", fontSize: "1.2rem", marginLeft: "10px" }}>
              <i className="fa-solid fa-times"></i>
            </button>
          </div>

          {/* Tab Content: CHAT (Coming Soon) */}
          <div style={{ display: activeWindow === 'chat' ? "flex" : "none", flex: 1, flexDirection: "column", overflow: "hidden", justifyContent: "center", alignItems: "center", background: "#111", padding: "20px", textAlign: "center" }}>
            <i className="fa-solid fa-robot" style={{ fontSize: "4rem", color: "#3b82f6", marginBottom: "15px", opacity: 0.8 }}></i>
            <h2 style={{ color: "white", marginBottom: "10px" }}>Pokefun AI</h2>
            <p style={{ color: "gray", fontSize: "1rem", lineHeight: "1.5" }}>
              Our AI Assistant is currently undergoing upgrades. <br/><br/>
              <strong style={{ color: "#10b981" }}>Coming Soon!</strong>
            </p>
          </div>

          {/* Tab Content: NOTIFICATIONS */}
          <div style={{ display: activeWindow === 'notifications' ? "flex" : "none", flex: 1, padding: "15px", overflowY: "auto", background: "#111", flexDirection: "column", gap: "10px" }}>
            {session ? (
              notifications.length > 0 ? (
                notifications.map((notif, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => {
                      // Instantly remove from dropdown
                      setNotifications(prev => prev.filter(n => n._id !== notif._id));
                      setUnreadCount(prev => Math.max(0, prev - 1));
                      
                      if (notif.url) {
                        window.location.href = notif.url;
                      }
                    }}
                    style={{ 
                      background: 'rgba(255,255,255,0.05)', 
                      padding: '15px', 
                      borderRadius: '10px', 
                      borderLeft: '4px solid #3b82f6',
                      cursor: notif.url ? 'pointer' : 'default',
                      transition: 'background 0.2s',
                      display: 'flex',
                      gap: '15px',
                      alignItems: 'center'
                    }}
                    onMouseOver={e => { if (notif.url) e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
                    onMouseOut={e => { if (notif.url) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                  >
                    {notif.icon && (
                      <img src={notif.icon} style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ margin: '0 0 5px 0', color: 'white' }}>
                        {notif.title} {notif.count && notif.count > 1 && <span style={{ background: '#3b82f6', color: 'white', padding: '2px 6px', borderRadius: '10px', fontSize: '0.7rem', marginLeft: '5px' }}>{notif.count}</span>}
                      </h4>
                      <p style={{ margin: 0, color: '#a3a3a3', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{notif.message}</p>
                      <span style={{ display: 'block', marginTop: '8px', fontSize: '0.7rem', color: '#666' }}>{new Date(notif.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: 'gray', textAlign: 'center', marginTop: '20px' }}>No new notifications.</p>
              )
            ) : (
              <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <i className="fa-solid fa-lock" style={{ fontSize: '2rem', color: 'gray', marginBottom: '10px' }}></i>
                <p style={{ color: 'gray' }}>Login to view your notifications.</p>
              </div>
            )}
          </div>

          {/* Tab Content: SETTINGS */}
          <div style={{ display: activeWindow === 'settings' ? "flex" : "none", flex: 1, padding: "20px", background: "#111", overflowY: "auto", flexDirection: "column", gap: "20px" }}>
            
            {/* Translate */}
            <div>
              <h4 style={{ color: 'white', margin: '0 0 10px 0' }}>Translate Page</h4>
              <div id="google_translate_element_ai_hub" style={{ background: "rgba(255,255,255,0.05)", borderRadius: "10px", padding: "10px", border: "1px solid rgba(255,255,255,0.1)", minHeight: '40px' }}></div>
            </div>

            {/* Sounds & Audio */}
            <div>
              <h4 style={{ color: 'white', margin: '0 0 10px 0' }}>Sounds & Audio</h4>
              <button 
                onClick={toggleMsgSounds} 
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)',
                  padding: '12px 15px', borderRadius: '10px', cursor: 'pointer', fontSize: '1rem', transition: '0.2s',
                  marginBottom: '10px'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className={`fa-solid ${msgSounds ? 'fa-bell' : 'fa-bell-slash'}`} style={{ color: '#3b82f6', width: '20px' }}></i> Message Ping
                </span>
                <span style={{ color: msgSounds ? '#10b981' : 'gray', fontWeight: 'bold' }}>
                  {msgSounds ? 'ON' : 'OFF'}
                </span>
              </button>

              <button 
                onClick={toggleMusic} 
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)',
                  padding: '12px 15px', borderRadius: '10px', cursor: 'pointer', fontSize: '1rem', transition: '0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className={`fa-solid ${musicPlaying ? 'fa-volume-high' : 'fa-volume-xmark'}`} style={{ color: '#10b981', width: '20px' }}></i> Background Music
                </span>
                <span style={{ color: musicPlaying ? '#10b981' : 'gray', fontWeight: 'bold' }}>
                  {musicPlaying ? 'ON' : 'OFF'}
                </span>
              </button>
            </div>

            {/* Theme */}
            <div>
              <h4 style={{ color: 'white', margin: '0 0 10px 0' }}>Appearance</h4>
              <button 
                onClick={toggleTheme} 
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)',
                  padding: '12px 15px', borderRadius: '10px', cursor: 'pointer', fontSize: '1rem', transition: '0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className={`fa-solid ${isDarkMode ? 'fa-moon' : 'fa-sun'}`} style={{ color: '#f59e0b', width: '20px' }}></i> Dark Mode
                </span>
                <span style={{ color: isDarkMode ? '#10b981' : 'gray', fontWeight: 'bold' }}>
                  {isDarkMode ? 'ON' : 'OFF'}
                </span>
              </button>
            </div>

          </div>

        </div>

        {/* Floating Menu Buttons (appear when isMenuOpen) */}
        <div style={{
          display: isMenuOpen ? "flex" : "none",
          flexDirection: "column",
          gap: "10px",
          animation: "fadeInUp 0.3s ease",
          alignItems: "flex-end",
          marginBottom: "10px"
        }}>
          
          <button 
            onClick={toggleMusic}
            className="fab-btn"
            title="Toggle Music"
          >
            <span>{musicPlaying ? 'Music Off' : 'Music On'}</span>
            <div className="fab-icon-box" style={{ background: musicPlaying ? '#10b981' : '#ef4444' }}>
              <i className={`fa-solid ${musicPlaying ? 'fa-volume-high' : 'fa-volume-xmark'}`}></i>
            </div>
          </button>
          
          <button 
            onClick={() => handleOpenWindow('notifications')}
            className="fab-btn"
            title="Alerts"
          >
            <span>Alerts</span>
            <div className="fab-icon-box" style={{ background: '#f59e0b', position: 'relative' }}>
              <i className="fa-solid fa-bell"></i>
              {unreadCount > 0 && (
                <div style={{ position: 'absolute', top: -5, right: -5, width: '15px', height: '15px', background: 'red', borderRadius: '50%', border: '2px solid #111' }}></div>
              )}
            </div>
          </button>

          <button 
            onClick={() => window.location.href = '/messages'}
            className="fab-btn"
            title="Messages"
          >
            <span>Messages</span>
            <div className="fab-icon-box" style={{ background: '#ec4899' }}>
              <i className="fa-solid fa-envelope"></i>
            </div>
          </button>

          <button 
            onClick={() => window.location.href = '/announcements'}
            className="fab-btn"
            title="Announcements"
          >
            <span>Announcements</span>
            <div className="fab-icon-box" style={{ background: '#14b8a6' }}>
              <i className="fa-solid fa-bullhorn"></i>
            </div>
          </button>

          <button 
            onClick={() => handleOpenWindow('settings')}
            className="fab-btn"
            title="Settings"
          >
            <span>Settings</span>
            <div className="fab-icon-box" style={{ background: '#8b5cf6' }}>
              <i className="fa-solid fa-cog"></i>
            </div>
          </button>

        </div>

        {/* Main Floating Toggle Button */}
        {!activeWindow && (
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              background: "linear-gradient(135deg, #10b981, #059669)",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "60px",
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "25px",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)",
              transition: "transform 0.3s",
              transform: isMenuOpen ? "rotate(45deg)" : "none"
            }}
            title="Pokefun Menu"
          >
            <i className={`fa-solid ${isMenuOpen ? "fa-plus" : "fa-cog"}`}></i>
            {unreadCount > 0 && !isMenuOpen && (
              <div style={{ position: 'absolute', top: 0, right: 0, width: '18px', height: '18px', background: 'red', borderRadius: '50%', border: '3px solid #111' }}></div>
            )}
          </button>
        )}
      </div>

      <style>{`
        .fab-btn {
          display: flex;
          align-items: center;
          gap: 15px;
          background: transparent;
          border: none;
          cursor: pointer;
          font-family: inherit;
        }
        .fab-btn span {
          background: rgba(0,0,0,0.7);
          color: white;
          padding: 5px 10px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: bold;
          opacity: 1;
          transform: translateX(0);
          transition: 0.2s;
        }
        .fab-btn:hover span {
          opacity: 1;
          transform: translateX(0);
        }
        .fab-icon-box {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          transition: 0.2s;
        }
        .fab-btn:hover .fab-icon-box {
          transform: scale(1.1);
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        /* Hide Google Translate Branding */
        .goog-te-gadget {
          font-size: 0px !important;
          color: transparent !important;
          pointer-events: none !important;
        }
        .goog-te-gadget .goog-te-combo {
          font-size: 14px !important;
          color: black !important;
          margin: 0 !important;
          pointer-events: auto !important;
          width: 100%;
          padding: 8px;
          border-radius: 5px;
        }
        .goog-te-gadget a, .goog-logo-link, .goog-te-gadget img { display: none !important; pointer-events: none !important; }
        #goog-gt-tt, .goog-te-balloon-frame { display: none !important; }
        .goog-text-highlight { background: none !important; box-shadow: none !important; }
        body { top: 0 !important; } 
        .skiptranslate iframe { display: none !important; } 
      `}</style>
    </>
  );
}
