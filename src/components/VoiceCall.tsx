"use client";

import React, { useEffect, useRef } from 'react';

export default function VoiceCall({ roomID, username, onClose }: { roomID: string, username: string, onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let zp: any = null;

    const initCall = async () => {
      try {
        const { ZegoUIKitPrebuilt } = await import('@zegocloud/zego-uikit-prebuilt');

        const appIDStr = process.env.NEXT_PUBLIC_ZEGO_APP_ID || "";
        const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET || "";

        if (!appIDStr || !serverSecret) {
          alert("ZegoCloud API Keys are missing! The developer needs to add NEXT_PUBLIC_ZEGO_APP_ID and NEXT_PUBLIC_ZEGO_SERVER_SECRET in Vercel Environment Variables.");
          onClose();
          return;
        }

        const appID = Number(appIDStr);

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomID,
          username.replace(/[^a-zA-Z0-9]/g, "") + "_" + Math.random().toString(36).substring(7),
          username
        );

        zp = ZegoUIKitPrebuilt.create(kitToken);

        zp.joinRoom({
          container: containerRef.current,
          scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall,
          },
          turnOnCameraWhenJoining: false,
          showMyCameraToggleButton: false,
          showAudioVideoSettingsButton: true,
          showScreenSharingButton: false,
          onLeaveRoom: () => {
            onClose();
          }
        });
      } catch (err) {
        console.error("ZegoCloud initialization failed:", err);
        alert("Failed to start the call. Please try again later.");
        onClose();
      }
    };

    if (typeof window !== 'undefined') {
      initCall();
    }

    return () => {
      if (zp) {
        zp.destroy();
      }
    };
  }, [roomID, username, onClose]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999999, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div 
        ref={containerRef} 
        style={{ width: '100%', maxWidth: '800px', height: '100%', maxHeight: '600px', background: '#1c1f21', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
      ></div>
    </div>
  );
}
