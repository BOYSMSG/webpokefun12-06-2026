"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [messages, setMessages] = useState<any[]>([]);
  const [contacts, setContacts] = useState<Record<string, any>>({});
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'RECENT' | 'ALL'>('RECENT');
  const [myUsername, setMyUsername] = useState<string>("");
  
  const [activeContact, setActiveContact] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const OWNER_USERNAME = "boysmsg01"; // Or whatever the admin username is

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (session?.user?.email) {
      fetchMessages();
      fetchAllUsers();
      
      const searchParams = new URLSearchParams(window.location.search);
      const userToSelect = searchParams.get('user');
      if (userToSelect) {
        setActiveContact(userToSelect);
        (window as any).__activeChatContact = userToSelect;
      }
      
      // Instant fetch when a push notification arrives
      const handleNewMessage = () => fetchMessages();
      window.addEventListener('newMessageReceived', handleNewMessage);
      
      // Fallback polling (slower to save server resources)
      const interval = setInterval(() => {
        fetchMessages();
      }, 10000);
      
      return () => {
        clearInterval(interval);
        window.removeEventListener('newMessageReceived', handleNewMessage);
      };
    }
  }, [session, status]);

  const fetchMessages = () => {
    fetch('/api/messages')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setMessages(data.messages || []);
          setContacts(data.contacts || {});
          if (data.myUsername) setMyUsername(data.myUsername);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const fetchAllUsers = () => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setAllUsers(data.users || []);
      });
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, activeContact]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeContact) return;

    const content = newMessage;
    setNewMessage("");

    const tempMsg = {
      _id: Date.now().toString(),
      senderId: myUsername || session?.user?.name,
      receiverId: activeContact,
      content,
      createdAt: new Date().toISOString()
    };
    setMessages([...messages, tempMsg]);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: activeContact, content })
      });
      if (!res.ok) throw new Error();
      fetchMessages(); // Refresh to get actual DB message
    } catch {
      alert("Failed to send message.");
      setMessages(messages.filter(m => m._id !== tempMsg._id));
    }
  };

  if (loading || status === 'loading') return <div style={{ textAlign: 'center', marginTop: '100px', color: 'gray' }}>Loading Messages...</div>;

  const contactUsernames = Object.keys(contacts);
  
  const getLatestMessageTime = (username: string) => {
    const userMsgs = messages.filter(m => m.senderId === username || m.receiverId === username);
    if (userMsgs.length === 0) return 0;
    const latest = userMsgs[userMsgs.length - 1];
    return new Date(latest.createdAt).getTime();
  };

  const recentContactsSorted = [...contactUsernames].sort((a, b) => getLatestMessageTime(b) - getLatestMessageTime(a));
  
  // Sort all users so online users are at the top, then idle, then offline
  const sortedAllUsers = [...allUsers].sort((a, b) => {
    const valA = a.status === 'Online' ? 2 : (a.status === 'Idle' ? 1 : 0);
    const valB = b.status === 'Online' ? 2 : (b.status === 'Idle' ? 1 : 0);
    return valB - valA;
  });
  
  const displayList = activeTab === 'RECENT' ? recentContactsSorted : sortedAllUsers.map(u => u.username || u.email);

  const activeChat = messages.filter(m => 
    (m.senderId === myUsername && m.receiverId === activeContact) ||
    (m.receiverId === myUsername && m.senderId === activeContact)
  );

  const unreadCounts: Record<string, number> = {};
  messages.forEach(m => {
    if (m.receiverId === myUsername && !m.read) {
      unreadCounts[m.senderId] = (unreadCounts[m.senderId] || 0) + 1;
    }
  });

  const getContactInfo = (username: string) => {
    if (username === 'pokefun_actions') return { name: 'Pokefun Actions', username: 'system', image: 'https://ui-avatars.com/api/?name=PA&background=eab308&color=000' };
    if (contacts[username]) return contacts[username];
    const found = allUsers.find(u => u.username === username || u.email === username);
    if (found) return found;
    return { name: username, username, image: null };
  };

  const activeContactInfo = activeContact ? getContactInfo(activeContact) : null;

  return (
    <div className="inner" style={{ paddingTop: '100px', paddingBottom: '100px', maxWidth: '1200px', margin: '0 auto', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        .messages-sidebar {
          width: 300px;
          border-right: 1px solid rgba(255,255,255,0.1);
          display: flex;
          flex-direction: column;
          background: rgba(0,0,0,0.2);
        }
        .messages-chat {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #111;
          position: relative;
          overflow: hidden;
        }
        @media (max-width: 768px) {
          .messages-sidebar {
            width: 100% !important;
            border-right: none !important;
            display: ${activeContact ? 'none' : 'flex'} !important;
          }
          .messages-chat {
            width: 100% !important;
            display: ${activeContact ? 'flex' : 'none'} !important;
          }
          .mobile-back-btn {
            display: block !important;
          }
        }
        .mobile-back-btn {
          display: none;
        }
      `}</style>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '20px' }}>Messages</h1>

      <div style={{ display: 'flex', flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', height: 'calc(100vh - 200px)', minHeight: '500px' }}>
        
        {/* Left Sidebar */}
        <div className="messages-sidebar">
          
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <button 
              onClick={() => setActiveTab('RECENT')}
              style={{ flex: 1, padding: '15px', background: 'transparent', border: 'none', borderBottom: activeTab === 'RECENT' ? '2px solid #3b82f6' : '2px solid transparent', color: activeTab === 'RECENT' ? '#3b82f6' : 'gray', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Recent
            </button>
            <button 
              onClick={() => setActiveTab('ALL')}
              style={{ flex: 1, padding: '15px', background: 'transparent', border: 'none', borderBottom: activeTab === 'ALL' ? '2px solid #3b82f6' : '2px solid transparent', color: activeTab === 'ALL' ? '#3b82f6' : 'gray', fontWeight: 'bold', cursor: 'pointer' }}
            >
              All Users
            </button>
          </div>

          <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <input 
              type="text" 
              placeholder="Search..." 
              style={{ width: '100%', padding: '10px 15px', borderRadius: '30px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', outline: 'none' }}
            />
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {displayList.length === 0 ? (
              <p style={{ color: 'gray', textAlign: 'center', marginTop: '20px' }}>No users found.</p>
            ) : (
              displayList.map(username => {
                const info = getContactInfo(username);
                const isOwner = username === OWNER_USERNAME;
                return (
                  <div 
                    key={username} 
                    onClick={() => {
                      setActiveContact(username);
                      (window as any).__activeChatContact = username;
                      window.history.replaceState({}, document.title, `/messages?user=${username}`);
                      fetch('/api/messages/read', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ senderId: username })
                      });
                      setMessages(prev => prev.map(m => (m.senderId === username && m.receiverId === myUsername) ? { ...m, read: true } : m));
                    }}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '15px', padding: '15px 20px', cursor: 'pointer',
                      background: activeContact === username ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                      borderLeft: activeContact === username ? '4px solid #3b82f6' : '4px solid transparent',
                      transition: '0.2s'
                    }}
                    onMouseOver={e => e.currentTarget.style.background = activeContact === username ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.05)'}
                    onMouseOut={e => e.currentTarget.style.background = activeContact === username ? 'rgba(59, 130, 246, 0.2)' : 'transparent'}
                  >
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <img src={info.image || `https://ui-avatars.com/api/?name=${info.name}&background=random`} style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover' }} />
                      {username !== 'pokefun_actions' && (
                        <div style={{ position: 'absolute', bottom: '0', right: '0', width: '13px', height: '13px', borderRadius: '50%', background: info.status === 'Online' ? '#10b981' : (info.status === 'Idle' ? '#fbbf24' : '#6b7280'), border: '2px solid #1c1f21', zIndex: 2 }} title={info.status}></div>
                      )}
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <h4 style={{ margin: 0, color: isOwner ? '#ef4444' : (username === 'pokefun_actions' ? '#facc15' : 'white'), display: 'flex', alignItems: 'center', gap: '5px' }}>
                        {info.name}
                        {isOwner && <span style={{ fontSize: '0.7rem', background: 'rgba(239, 68, 68, 0.2)', padding: '2px 6px', borderRadius: '8px' }}>👑 OWNER</span>}
                        {username === 'pokefun_actions' && <span style={{ fontSize: '0.7rem', background: 'rgba(250, 204, 21, 0.2)', color: '#facc15', padding: '2px 6px', borderRadius: '8px', border: '1px solid rgba(250,204,21,0.5)' }}>🛡️ SYSTEM</span>}
                      </h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ margin: 0, color: 'gray', fontSize: '0.8rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          @{username}
                        </p>
                        {unreadCounts[username] > 0 && (
                          <span style={{ background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                            {unreadCounts[username]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Right Pane: Active Chat */}
        <div className="messages-chat">
          {activeContact && activeContactInfo ? (
            <>
              {/* Chat Header */}
              <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <button className="mobile-back-btn" onClick={() => setActiveContact(null)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}>
                    <i className="fa-solid fa-arrow-left"></i>
                  </button>
                  <img src={activeContactInfo.image || `https://ui-avatars.com/api/?name=${activeContactInfo.name}&background=random`} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                  <div>
                    <h3 style={{ margin: 0, color: activeContact === OWNER_USERNAME ? '#ef4444' : (activeContact === 'pokefun_actions' ? '#facc15' : 'white'), display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {activeContactInfo.name}
                      {activeContact === OWNER_USERNAME && <span style={{ fontSize: '0.7rem', background: 'rgba(239, 68, 68, 0.2)', padding: '2px 6px', borderRadius: '8px' }}>👑 OWNER</span>}
                      {activeContact === 'pokefun_actions' && <span style={{ fontSize: '0.7rem', background: 'rgba(250, 204, 21, 0.2)', color: '#facc15', padding: '2px 6px', borderRadius: '8px', border: '1px solid rgba(250,204,21,0.5)' }}>🛡️ SYSTEM</span>}
                    </h3>
                    {activeContact !== 'pokefun_actions' && (
                      <p style={{ margin: 0, color: activeContactInfo.status === 'Online' ? '#10b981' : (activeContactInfo.status === 'Idle' ? '#fbbf24' : 'gray'), fontSize: '0.8rem', fontWeight: 'bold' }}>
                        {activeContactInfo.status === 'Online' ? '● Online' : (activeContactInfo.status === 'Idle' ? '◐ Idle' : '○ Offline')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions: Menu & Close */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
                  <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer', padding: '10px' }}>
                    <i className="fa-solid fa-ellipsis-vertical"></i>
                  </button>
                  <button onClick={() => setActiveContact(null)} style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '1.2rem', cursor: 'pointer', padding: '10px' }} title="Close Chat">
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                  {menuOpen && (
                    <div style={{ position: 'absolute', top: '100%', right: '0', background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', overflow: 'hidden', zIndex: 10 }}>
                      <button style={{ display: 'block', width: '100%', padding: '12px 20px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', textAlign: 'left', whiteSpace: 'nowrap' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'} onClick={() => { alert('Added to friends!'); setMenuOpen(false); }}>
                        <i className="fa-solid fa-user-plus" style={{ marginRight: '10px', color: '#10b981' }}></i> Add Friend
                      </button>
                      <button style={{ display: 'block', width: '100%', padding: '12px 20px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', textAlign: 'left', whiteSpace: 'nowrap' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'} onClick={() => { alert('Removed from friends!'); setMenuOpen(false); }}>
                        <i className="fa-solid fa-user-minus" style={{ marginRight: '10px', color: '#ef4444' }}></i> Unfriend
                      </button>
                      <button style={{ display: 'block', width: '100%', padding: '12px 20px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', textAlign: 'left', whiteSpace: 'nowrap' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'} onClick={() => { setMenuOpen(false); router.push(`/profile/${activeContact}`); }}>
                        <i className="fa-solid fa-id-card" style={{ marginRight: '10px', color: '#3b82f6' }}></i> Check User
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Chat Messages */}
              <div ref={chatContainerRef} style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }} onClick={() => setMenuOpen(false)}>
                {activeChat.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'gray', marginTop: '40px' }}>Say hi to start the conversation!</div>
                ) : (
                  activeChat.map((msg, idx) => {
                    const isMe = msg.senderId === myUsername;
                    const isMsgOwner = msg.senderId === OWNER_USERNAME;
                    return (
                      <div key={idx} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '75%', marginRight: isMe ? '15px' : '0' }}>
                        {isMsgOwner && !isMe && <div style={{ fontSize: '0.7rem', color: '#ef4444', marginBottom: '5px', fontWeight: 'bold' }}>👑 OWNER</div>}
                        {msg.senderId === 'pokefun_actions' && <div style={{ fontSize: '0.7rem', color: '#facc15', marginBottom: '5px', fontWeight: 'bold' }}>🛡️ SYSTEM</div>}
                        <div style={{ 
                          background: isMe ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : (isMsgOwner ? 'linear-gradient(135deg, #ef4444, #b91c1c)' : (msg.senderId === 'pokefun_actions' ? 'linear-gradient(135deg, #eab308, #ca8a04)' : '#2d3748')), 
                          color: msg.senderId === 'pokefun_actions' ? 'black' : 'white', 
                          padding: '12px 18px', 
                          borderRadius: '20px', 
                          borderBottomRightRadius: isMe ? '0' : '20px',
                          borderBottomLeftRadius: !isMe ? '0' : '20px',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                          wordWrap: 'break-word',
                          wordBreak: 'break-word',
                          whiteSpace: 'pre-wrap'
                        }}>
                          {msg.content}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'gray', marginTop: '5px', textAlign: isMe ? 'right' : 'left' }}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Chat Input */}
              {activeContact === 'pokefun_actions' ? (
                <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', textAlign: 'center', color: 'gray' }}>
                  You cannot reply to system messages.
                </div>
              ) : (
                <form onSubmit={handleSendMessage} style={{ padding: '20px', paddingRight: '90px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '15px', background: 'rgba(0,0,0,0.3)' }} onClick={() => setMenuOpen(false)}>
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..." 
                    style={{ flex: 1, padding: '15px 20px', borderRadius: '30px', border: '1px solid #444', background: 'rgba(0,0,0,0.5)', color: 'white', outline: 'none', fontSize: '1rem', minWidth: 0 }}
                  />
                  <button type="submit" style={{ flexShrink: 0, width: '50px', height: '50px', borderRadius: '50%', border: 'none', background: '#10b981', color: 'white', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)' }}>
                    <i className="fa-solid fa-paper-plane"></i>
                  </button>
                </form>
              )}
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'gray' }}>
              <i className="fa-regular fa-comments" style={{ fontSize: '5rem', marginBottom: '20px', color: '#333' }}></i>
              <h2>Select a conversation to start chatting</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
