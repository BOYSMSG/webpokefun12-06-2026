"use client";

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function ApplyPage() {
  const { data: session } = useSession();
  const [discordTag, setDiscordTag] = useState('');
  const [age, setAge] = useState('');
  const [reason, setReason] = useState('');
  const [experience, setExperience] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call to save application
    setSubmitted(true);
  };

  if (!session) {
    return (
      <div className="inner" style={{ paddingTop: '120px', paddingBottom: '60px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ef4444' }}>Access Denied</h1>
        <p style={{ color: 'gray' }}>You must be logged in to apply for Staff.</p>
        <a href="/login" style={{ display: 'inline-block', marginTop: '20px', padding: '10px 20px', background: '#10b981', color: 'white', borderRadius: '8px', textDecoration: 'none' }}>Go to Login</a>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="inner" style={{ paddingTop: '120px', paddingBottom: '60px', textAlign: 'center' }}>
        <i className="fa-solid fa-circle-check" style={{ fontSize: '5rem', color: '#10b981', marginBottom: '20px' }}></i>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Application Submitted!</h1>
        <p style={{ color: 'gray' }}>Thank you for applying to be a part of the Pokefun Staff team. We will review your application and contact you on Discord.</p>
      </div>
    );
  }

  return (
    <div className="inner" style={{ paddingTop: '120px', paddingBottom: '60px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '10px' }}>Staff Application</h1>
      <p style={{ color: 'gray', marginBottom: '40px' }}>Want to help moderate the best Cobblemon server? Fill out the form below!</p>

      <form onSubmit={handleSubmit} style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'gray' }}>Discord Tag (e.g. user#1234 or @user)</label>
          <input 
            type="text" 
            required 
            value={discordTag}
            onChange={(e) => setDiscordTag(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid #444', color: 'white', outline: 'none' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'gray' }}>Age</label>
          <input 
            type="number" 
            required 
            min="13"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid #444', color: 'white', outline: 'none' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'gray' }}>Why do you want to be staff?</label>
          <textarea 
            required 
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid #444', color: 'white', outline: 'none', resize: 'vertical' }}
          ></textarea>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'gray' }}>Past Experience (Minecraft/Discord moderation)</label>
          <textarea 
            required 
            rows={4}
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid #444', color: 'white', outline: 'none', resize: 'vertical' }}
          ></textarea>
        </div>

        <button type="submit" style={{ width: '100%', padding: '15px', background: '#8b5cf6', color: 'white', fontWeight: 'bold', fontSize: '1.1rem', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Submit Application
        </button>

      </form>
    </div>
  );
}
