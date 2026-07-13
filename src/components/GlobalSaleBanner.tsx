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
    <Link href="https://store.pokefun.in" className="info-card" style={{ display: "flex", alignItems: "center", gap: "15px", textDecoration: "none", color: "white", fontWeight: 900, marginBottom: "15px" }}>
        <i className="fa-solid fa-bolt"></i>
        <div className="info-text" style={{ textAlign: "left" }}>
            <div className="if-large" style={{ textTransform: "uppercase" }}>
                {storeConfig.saleTitle} <span className="count" style={{ background: '#ef4444', color: 'white' }}>{storeConfig.discountPercentage}% OFF</span>
            </div>
            <div className="if-small">Ends in {timeLeft}</div>
        </div>
    </Link>
  );
}
