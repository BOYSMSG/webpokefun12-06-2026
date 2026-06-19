"use client";

import React from 'react';

export default function OtherOptionsPage() {
  return (
    <div className="container" style={{ maxWidth: '800px', margin: '100px auto', padding: '40px' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '30px', textAlign: 'center', color: '#fff' }}>Other Features</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <a href="/gym_apply" style={{
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: 'white',
            padding: '30px',
            borderRadius: '15px',
            textDecoration: 'none',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            transition: 'transform 0.2s, filter 0.2s',
            boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
        }}
        onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.filter = 'brightness(1.1)'; }}
        onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.filter = 'brightness(1)'; }}
        >
            <i className="fa-solid fa-medal" style={{ fontSize: '2.5rem' }}></i>
            Gym Apply
        </a>

        <a href="/gym_battle" style={{
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: 'white',
            padding: '30px',
            borderRadius: '15px',
            textDecoration: 'none',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            transition: 'transform 0.2s, filter 0.2s',
            boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
        }}
        onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.filter = 'brightness(1.1)'; }}
        onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.filter = 'brightness(1)'; }}
        >
            <i className="fa-solid fa-bolt" style={{ fontSize: '2.5rem' }}></i>
            Gym Battle
        </a>

        <a href="/polls" style={{
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            color: 'white',
            padding: '30px',
            borderRadius: '15px',
            textDecoration: 'none',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            transition: 'transform 0.2s, filter 0.2s',
            boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
        }}
        onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.filter = 'brightness(1.1)'; }}
        onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.filter = 'brightness(1)'; }}
        >
            <i className="fa-solid fa-chart-pie" style={{ fontSize: '2.5rem' }}></i>
            Polls
        </a>

        <a href="/giveaways" style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            padding: '30px',
            borderRadius: '15px',
            textDecoration: 'none',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            transition: 'transform 0.2s, filter 0.2s',
            boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
        }}
        onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.filter = 'brightness(1.1)'; }}
        onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.filter = 'brightness(1)'; }}
        >
            <i className="fa-solid fa-gift" style={{ fontSize: '2.5rem' }}></i>
            Giveaways
        </a>

        <a href="/tournaments" style={{
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: 'white',
            padding: '30px',
            borderRadius: '15px',
            textDecoration: 'none',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            transition: 'transform 0.2s, filter 0.2s',
            boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
        }}
        onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.filter = 'brightness(1.1)'; }}
        onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.filter = 'brightness(1)'; }}
        >
            <i className="fa-solid fa-trophy" style={{ fontSize: '2.5rem' }}></i>
            Tournaments
        </a>

        <a href="/events" style={{
            background: 'linear-gradient(135deg, #ec4899, #db2777)',
            color: 'white',
            padding: '30px',
            borderRadius: '15px',
            textDecoration: 'none',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            transition: 'transform 0.2s, filter 0.2s',
            boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
        }}
        onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.filter = 'brightness(1.1)'; }}
        onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.filter = 'brightness(1)'; }}
        >
            <i className="fa-solid fa-calendar-star" style={{ fontSize: '2.5rem' }}></i>
            Events
        </a>
      </div>
    </div>
  );
}
