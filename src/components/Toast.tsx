"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  url?: string;
}

interface ToastContextProps {
  toast: {
    success: (msg: string, url?: string) => void;
    error: (msg: string, url?: string) => void;
    info: (msg: string, url?: string) => void;
  };
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: ToastType, url?: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type, url }]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const toast = {
    success: (msg: string, url?: string) => addToast(msg, 'success', url),
    error: (msg: string, url?: string) => addToast(msg, 'error', url),
    info: (msg: string, url?: string) => addToast(msg, 'info', url),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 999999, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            onClick={() => {
              if (t.url) {
                window.location.href = t.url;
              }
            }}
            style={{
              background: t.type === 'success' ? '#10b981' : t.type === 'error' ? '#ef4444' : '#3b82f6',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: t.url ? 'pointer' : 'default',
              animation: 'slideInRight 0.3s ease-out forwards',
            }}
          >
            {t.type === 'success' && <i className="fa-solid fa-circle-check"></i>}
            {t.type === 'error' && <i className="fa-solid fa-circle-xmark"></i>}
            {t.type === 'info' && <i className="fa-solid fa-circle-info"></i>}
            {t.message}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context.toast;
}
