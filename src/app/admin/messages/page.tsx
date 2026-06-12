"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminMessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [messages, setMessages] = useState<any[]>([]);
  const [users, setUsers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [filterEmail, setFilterEmail] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated' || (status === 'authenticated' && (session?.user as any)?.role !== 'ADMIN')) {
      router.push('/admin');
      return;
    }

    if (session?.user?.email) {
      fetchMessages(filterEmail);
    }
  }, [session, status, filterEmail]);

  const fetchMessages = async (emailToFilter: string) => {
    setLoading(true);
    try {
      const url = emailToFilter ? `/api/admin/messages?email=${encodeURIComponent(emailToFilter)}` : '/api/admin/messages';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
        setUsers(data.users || {});
        setActiveConversationId(null);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilterEmail(searchInput.trim());
  };

  const getUserInfo = (email: string) => {
    if (email === 'pokefun_actions') return { name: 'Pokefun Actions', image: 'https://ui-avatars.com/api/?name=PA&background=eab308&color=000' };
    if (users[email]) return users[email];
    return { name: email.split('@')[0], image: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random` };
  };

  // Group messages into conversations
  const conversationsMap = new Map<string, any>();
  
  messages.forEach(msg => {
    const p1 = msg.senderId;
    const p2 = msg.receiverId;
    const convId = [p1, p2].sort().join('|');
    
    if (!conversationsMap.has(convId)) {
      conversationsMap.set(convId, {
        id: convId,
        participants: [p1, p2],
        messages: [],
        lastMessageTime: new Date(msg.createdAt).getTime()
      });
    }
    
    const conv = conversationsMap.get(convId);
    conv.messages.push(msg);
    const msgTime = new Date(msg.createdAt).getTime();
    if (msgTime > conv.lastMessageTime) {
      conv.lastMessageTime = msgTime;
    }
  });

  const conversations = Array.from(conversationsMap.values()).sort((a, b) => b.lastMessageTime - a.lastMessageTime);
  const activeConversation = activeConversationId ? conversationsMap.get(activeConversationId) : null;

  if (loading && messages.length === 0) {
    return <div style={{ textAlign: 'center', marginTop: '100px', color: 'gray' }}>Loading Global DMs...</div>;
  }

  return (
    <div className="inner" style={{ paddingTop: '100px', paddingBottom: '100px', maxWidth: '1400px', margin: '0 auto', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <Link href="/admin" style={{ color: '#8b5cf6', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px', marginBottom: '10px', fontWeight: 'bold' }}>
            <i className="fa-solid fa-arrow-left"></i> Back to Dashboard
          </Link>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: '15px', margin: 0 }}>
            <i className="fa-solid fa-user-secret" style={{ color: '#ef4444' }}></i> Admin DM Spy
          </h1>
          <p style={{ color: 'gray', margin: '5px 0 0 0' }}>Monitor all direct messages sent across the server.</p>
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '15px' }}>
          <input 
            type="text" 
            placeholder="Filter by player's Email (e.g. user@gmail.com)" 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{ flex: 1, padding: '12px 20px', borderRadius: '8px', border: '1px solid #444', background: '#111', color: 'white', outline: 'none', fontSize: '1rem' }}
          />
          <button type="submit" style={{ padding: '0 25px', background: '#3b82f6', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            <i className="fa-solid fa-filter"></i> Filter DMs
          </button>
          {filterEmail && (
            <button type="button" onClick={() => { setSearchInput(''); setFilterEmail(''); }} style={{ padding: '0 25px', background: '#374151', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Split Pane Layout */}
      <div style={{ display: 'flex', flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', height: 'calc(100vh - 300px)', minHeight: '500px' }}>
        
        {/* Left Sidebar: Conversations */}
        <div style={{ width: '350px', borderRight: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.2)' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 style={{ margin: 0, color: 'white', fontSize: '1.2rem' }}>Conversations ({conversations.length})</h2>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {conversations.length === 0 ? (
              <div style={{ padding: '30px 20px', textAlign: 'center', color: 'gray' }}>No active conversations found.</div>
            ) : (
              conversations.map(conv => {
                const u1 = getUserInfo(conv.participants[0]);
                const u2 = getUserInfo(conv.participants[1]);
                const isActive = activeConversationId === conv.id;
                
                return (
                  <div 
                    key={conv.id} 
                    onClick={() => setActiveConversationId(conv.id)}
                    style={{ 
                      padding: '15px 20px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '15px', 
                      cursor: 'pointer', 
                      background: isActive ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      transition: 'background 0.2s',
                      borderLeft: isActive ? '4px solid #3b82f6' : '4px solid transparent'
                    }}
                    onMouseOver={e => { if(!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                    onMouseOut={e => { if(!isActive) e.currentTarget.style.background = 'transparent' }}
                  >
                    <div style={{ position: 'relative', width: '50px', height: '40px' }}>
                      <img src={u1.image} style={{ width: '30px', height: '30px', borderRadius: '50%', position: 'absolute', top: 0, left: 0, border: '2px solid #111' }} />
                      <img src={u2.image} style={{ width: '30px', height: '30px', borderRadius: '50%', position: 'absolute', bottom: 0, right: 0, border: '2px solid #111' }} />
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontWeight: 'bold', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.9rem' }}>
                        {u1.name} <span style={{ color: 'gray', fontSize: '0.8rem' }}>&</span> {u2.name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{conv.messages.length} messages</div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Right Pane: Chat History */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#111', position: 'relative', overflow: 'hidden' }}>
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <h3 style={{ margin: 0, color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    Monitoring Chat
                  </h3>
                </div>
              </div>

              {/* Messages Area */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {activeConversation.messages.map((msg: any, idx: number) => {
                  const sender = getUserInfo(msg.senderId);
                  // Assign Left/Right sides consistently based on which participant they are
                  const isP1 = msg.senderId === activeConversation.participants[0];
                  
                  return (
                    <div key={idx} style={{ alignSelf: isP1 ? 'flex-start' : 'flex-end', maxWidth: '75%', display: 'flex', flexDirection: isP1 ? 'row' : 'row-reverse', gap: '10px' }}>
                      <img src={sender.image} style={{ width: '30px', height: '30px', borderRadius: '50%', marginTop: 'auto' }} />
                      
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: isP1 ? 'flex-start' : 'flex-end' }}>
                        <span style={{ fontSize: '0.75rem', color: 'gray', marginBottom: '5px' }}>{sender.name} ({msg.senderId}) • {new Date(msg.createdAt).toLocaleString()}</span>
                        <div style={{ 
                          background: msg.senderId === 'pokefun_actions' ? 'linear-gradient(135deg, #eab308, #ca8a04)' : '#2d3748', 
                          color: msg.senderId === 'pokefun_actions' ? 'black' : 'white', 
                          padding: '12px 18px', 
                          borderRadius: '20px', 
                          borderBottomLeftRadius: isP1 ? '0' : '20px',
                          borderBottomRightRadius: !isP1 ? '0' : '20px',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                          wordWrap: 'break-word',
                          wordBreak: 'break-word',
                          whiteSpace: 'pre-wrap'
                        }}>
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div style={{ padding: '15px', background: 'rgba(0,0,0,0.5)', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', color: '#6b7280', fontSize: '0.9rem' }}>
                <i className="fa-solid fa-eye"></i> You are viewing this conversation in Admin Spy Mode.
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'gray' }}>
              <i className="fa-solid fa-user-secret" style={{ fontSize: '4rem', marginBottom: '20px', color: '#374151' }}></i>
              <h2 style={{ margin: 0, color: 'white' }}>Select a conversation</h2>
              <p>Choose a player conversation from the left to read their DMs.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
