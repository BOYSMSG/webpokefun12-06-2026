"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface SaleBannerProps {
  endDate: string;
  title: string;
  subtitle: string;
  link?: string;
}

export default function SaleBanner({ endDate, title, subtitle, link }: SaleBannerProps) {
  const [timeLeft, setTimeLeft] = useState('...');

  useEffect(() => {
    const targetDate = new Date(endDate).getTime();

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
  }, [endDate]);

  const bannerContent = (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      background: '#1a1a1a',
      border: '2px solid #f39c12',
      borderRadius: '8px',
      padding: '16px 20px',
      margin: '0 auto 30px',
      maxWidth: '850px',
      boxShadow: '0 8px 25px rgba(243, 156, 18, 0.15)',
      cursor: link ? 'pointer' : 'default',
      transition: 'transform 0.2s',
      textAlign: 'left'
    }}
    onMouseOver={e => link && (e.currentTarget.style.transform = 'scale(1.02)')}
    onMouseOut={e => link && (e.currentTarget.style.transform = 'scale(1)')}
    >
      <div style={{
        background: '#f39c12',
        color: 'white',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        flexShrink: 0,
        marginRight: '20px',
        boxShadow: '0 0 10px rgba(243, 156, 18, 0.5)'
      }}>
        <i className="fa-solid fa-hourglass-half"></i>
      </div>
      <div>
        <div style={{ color: '#f39c12', fontWeight: 'bold', fontSize: '1rem', marginBottom: '6px' }}>
          Only {timeLeft} left before the {title} is gone for good!
        </div>
        <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1.15rem' }}>
          {subtitle}
        </div>
      </div>
    </div>
  );

  if (link) {
    return <Link href={link} style={{ textDecoration: 'none' }}>{bannerContent}</Link>;
  }

  return bannerContent;
}
