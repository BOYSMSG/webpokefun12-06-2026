"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function GlobalSaleBanner() {
  const [storeConfig, setStoreConfig] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState('...');

  useEffect(() => {
    fetch('/api/store-config')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.config?.saleActive) {
          setStoreConfig(data.config);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!storeConfig) return;
    const targetDate = new Date(storeConfig.saleEndDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft("0d 0h 0m 0s");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [storeConfig]);

  if (!storeConfig) return null;

  return (
    <Link href="/store" style={{ textDecoration: 'none' }}>
      <div style={{
        position: 'fixed',
        top: '80px',
        right: '30px',
        display: 'flex',
        alignItems: 'center',
        background: '#1a1a1a',
        border: '2px solid #f39c12',
        borderRadius: '8px',
        padding: '10px 15px',
        boxShadow: '0 8px 25px rgba(243, 156, 18, 0.2)',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        textAlign: 'left',
        zIndex: 9998,
        maxWidth: '300px'
      }}
      onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
      onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <div style={{
          background: '#f39c12',
          color: 'white',
          width: '35px',
          height: '35px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          flexShrink: 0,
          marginRight: '12px',
          boxShadow: '0 0 10px rgba(243, 156, 18, 0.5)'
        }}>
          <i className="fa-solid fa-hourglass-half"></i>
        </div>
        <div>
          <div style={{ color: '#f39c12', fontWeight: 'bold', fontSize: '0.75rem', marginBottom: '2px' }}>
            Ends in {timeLeft}
          </div>
          <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.85rem' }}>
            {storeConfig.saleTitle} - {storeConfig.discountPercentage}% OFF
          </div>
        </div>
      </div>
    </Link>
  );
}
