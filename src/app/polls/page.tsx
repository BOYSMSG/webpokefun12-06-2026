"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useSession } from "next-auth/react";

export default function PollsPage() {
  const { data: session } = useSession();
  const [polls, setPolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Create Poll State
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [durationHours, setDurationHours] = useState('24');
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  // Voting State
  const [selectedOptions, setSelectedOptions] = useState<{ [pollId: string]: number[] }>({});
  const [voteLoading, setVoteLoading] = useState<{ [pollId: string]: boolean }>({});

  useEffect(() => {
    fetchPolls();
    // In a real app, verify admin status securely.
    // For this UI, we check if they have an admin session.
    if (session?.user?.role === 'ADMIN' || session?.user?.role === 'OWNER') {
       setIsAdmin(true);
    }
  }, [session]);

  const fetchPolls = () => {
    fetch('/api/polls')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPolls(data.polls);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const newOpts = [...options];
      newOpts.splice(index, 1);
      setOptions(newOpts);
    }
  };

  const handleOptionChange = (index: number, val: string) => {
    const newOpts = [...options];
    newOpts[index] = val;
    setOptions(newOpts);
  };

  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      const res = await fetch('/api/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, options: options.filter(o => o.trim() !== ''), durationHours, allowMultiple })
      });
      const data = await res.json();
      if (data.success) {
        setShowCreateModal(false);
        setQuestion('');
        setOptions(['', '']);
        fetchPolls();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Something went wrong");
    }
    setCreateLoading(false);
  };

  const handleVote = async (pollId: string) => {
    const selections = selectedOptions[pollId] || [];
    if (selections.length === 0) return;

    setVoteLoading({ ...voteLoading, [pollId]: true });
    try {
      const res = await fetch('/api/polls/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pollId, optionIndexes: selections })
      });
      const data = await res.json();
      if (data.success) {
        fetchPolls(); // Refresh to see results
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Something went wrong");
    }
    setVoteLoading({ ...voteLoading, [pollId]: false });
  };

  const toggleOptionSelection = (pollId: string, index: number, isMultiple: boolean) => {
    const current = selectedOptions[pollId] || [];
    if (isMultiple) {
      if (current.includes(index)) {
        setSelectedOptions({ ...selectedOptions, [pollId]: current.filter(i => i !== index) });
      } else {
        setSelectedOptions({ ...selectedOptions, [pollId]: [...current, index] });
      }
    } else {
      setSelectedOptions({ ...selectedOptions, [pollId]: [index] });
    }
  };

  const renderPoll = (poll: any) => {
    const totalVotes = poll.options.reduce((sum: number, opt: any) => sum + opt.votes.length, 0);
    const hasVoted = session?.user?.username && poll.options.some((opt: any) => opt.votes.includes(session.user.username));
    const canVote = !hasVoted && poll.isActive && session?.user;

    return (
      <div key={poll._id} style={{ background: "rgba(30, 34, 39, 0.7)", borderRadius: "12px", padding: "25px", marginBottom: "20px", border: "1px solid #333", position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
          <h3 style={{ margin: 0, color: "#fff", fontSize: "1.3rem", fontWeight: 700 }}>{poll.question}</h3>
          {!poll.isActive && <span style={{ background: "#e74c3c", color: "#fff", padding: "3px 8px", borderRadius: "4px", fontSize: "0.8rem", fontWeight: "bold" }}>Ended</span>}
        </div>
        <div style={{ marginBottom: "20px" }}>
          {poll.options.map((opt: any, index: number) => {
            const percentage = totalVotes === 0 ? 0 : Math.round((opt.votes.length / totalVotes) * 100);
            const isSelected = selectedOptions[poll._id]?.includes(index);
            const userVotedForThis = session?.user?.username && opt.votes.includes(session.user.username);

            return (
              <div 
                key={index} 
                onClick={() => canVote && toggleOptionSelection(poll._id, index, poll.allowMultiple)}
                style={{ 
                  position: "relative",
                  background: hasVoted ? "transparent" : (isSelected ? "rgba(139, 92, 246, 0.2)" : "#2a2e33"),
                  border: hasVoted ? "none" : `1px solid ${isSelected ? "var(--accent-primary)" : "#444"}`,
                  borderRadius: "8px", 
                  padding: "12px 15px", 
                  marginBottom: "10px", 
                  cursor: canVote ? "pointer" : "default",
                  overflow: "hidden",
                  transition: "all 0.2s"
                }}
              >
                {/* Result Progress Bar Background */}
                {hasVoted && (
                  <div style={{
                    position: "absolute",
                    top: 0, left: 0, height: "100%",
                    width: `${percentage}%`,
                    background: userVotedForThis ? "var(--ghost-accent-color)" : "#444",
                    opacity: userVotedForThis ? 0.3 : 0.4,
                    zIndex: 0,
                    borderRadius: "8px"
                  }} />
                )}
                
                <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", color: "#fff" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {canVote && (
                      <div style={{ 
                        width: "18px", height: "18px", 
                        borderRadius: poll.allowMultiple ? "4px" : "50%", 
                        border: `2px solid ${isSelected ? "var(--accent-primary)" : "#888"}`,
                        background: isSelected ? "var(--accent-primary)" : "transparent",
                        display: "flex", justifyContent: "center", alignItems: "center"
                      }}>
                        {isSelected && <i className="fa-solid fa-check" style={{ fontSize: "10px", color: "#fff" }}></i>}
                      </div>
                    )}
                    <span style={{ fontWeight: userVotedForThis ? "bold" : "normal" }}>{opt.text}</span>
                  </div>
                  {hasVoted && <span style={{ fontWeight: "bold" }}>{percentage}%</span>}
                </div>
              </div>
            );
          })}
        </div>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#888", fontSize: "0.9rem" }}>
          <span>{totalVotes} votes • Created by {poll.createdBy}</span>
          {canVote && (
            <button 
              onClick={() => handleVote(poll._id)}
              disabled={voteLoading[poll._id] || !(selectedOptions[poll._id]?.length > 0)}
              style={{ 
                background: "var(--ghost-accent-color)", color: "#000", border: "none", 
                padding: "8px 20px", borderRadius: "20px", fontWeight: "bold", 
                cursor: (selectedOptions[poll._id]?.length > 0) ? "pointer" : "not-allowed",
                opacity: (selectedOptions[poll._id]?.length > 0) ? 1 : 0.5
              }}
            >
              {voteLoading[poll._id] ? "Voting..." : "Vote"}
            </button>
          )}
          {!session?.user && poll.isActive && <span>Login to vote</span>}
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Community Polls - Pokefun</title>
      </Head>
      
      <div className="container" style={{ paddingTop: "40px", paddingBottom: "40px", maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: "var(--ghost-accent-color)", margin: 0 }}>
            Community Polls
          </h1>
          {isAdmin && (
            <button 
              onClick={() => setShowCreateModal(true)}
              style={{ background: "#6366f1", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
            >
              <i className="fa-solid fa-plus"></i> Create Poll
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", color: "#a3a3a3", padding: "40px" }}>Loading Polls...</div>
        ) : polls.length === 0 ? (
          <div style={{ textAlign: "center", background: "#1c1f21", padding: "40px", borderRadius: "12px", color: "#888" }}>
            <i className="fa-solid fa-chart-pie" style={{ fontSize: "3rem", marginBottom: "15px", opacity: 0.5 }}></i>
            <h2>No active polls</h2>
            <p>Check back later to vote on server decisions!</p>
          </div>
        ) : (
          <div>{polls.map(renderPoll)}</div>
        )}
      </div>

      {/* Create Poll Modal */}
      {showCreateModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
          <div style={{ background: "#313338", borderRadius: "8px", width: "100%", maxWidth: "500px", boxShadow: "0 8px 30px rgba(0,0,0,0.5)" }}>
            <div style={{ padding: "20px", borderBottom: "1px solid #1e1f22", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ margin: 0, color: "#f2f3f5", fontSize: "1.2rem", fontWeight: "bold" }}>Create a Poll</h2>
              <button onClick={() => setShowCreateModal(false)} style={{ background: "none", border: "none", color: "#b5bac1", fontSize: "1.5rem", cursor: "pointer" }}>&times;</button>
            </div>
            
            <form onSubmit={handleCreatePoll} style={{ padding: "20px" }}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", color: "#b5bac1", marginBottom: "8px", fontSize: "0.85rem", fontWeight: "bold" }}>Question</label>
                <textarea 
                  required maxLength={300} placeholder="What question do you want to ask?" 
                  value={question} onChange={e => setQuestion(e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: "4px", background: "#1e1f22", border: "none", color: "#dbdee1", resize: "none", minHeight: "80px", outline: "none" }}
                />
                <div style={{ textAlign: "right", color: "#80848e", fontSize: "0.75rem", marginTop: "4px" }}>{question.length} / 300</div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", color: "#b5bac1", marginBottom: "8px", fontSize: "0.85rem", fontWeight: "bold" }}>Answers</label>
                {options.map((opt, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", marginBottom: "10px", background: "#1e1f22", borderRadius: "4px", padding: "0 12px" }}>
                    <i className="fa-regular fa-face-smile" style={{ color: "#b5bac1" }}></i>
                    <input 
                      required type="text" placeholder="Type your answer" value={opt} onChange={e => handleOptionChange(idx, e.target.value)}
                      style={{ flexGrow: 1, padding: "12px 10px", background: "transparent", border: "none", color: "#dbdee1", outline: "none" }}
                    />
                    {options.length > 2 && (
                      <i className="fa-solid fa-trash" onClick={() => handleRemoveOption(idx)} style={{ color: "#b5bac1", cursor: "pointer" }}></i>
                    )}
                  </div>
                ))}
                <button type="button" onClick={handleAddOption} style={{ width: "100%", padding: "10px", background: "#2b2d31", color: "#dbdee1", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
                  <i className="fa-solid fa-plus"></i> Add another answer
                </button>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", color: "#b5bac1", marginBottom: "8px", fontSize: "0.85rem", fontWeight: "bold" }}>Duration</label>
                <select value={durationHours} onChange={e => setDurationHours(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "4px", background: "#1e1f22", border: "none", color: "#dbdee1", outline: "none" }}>
                  <option value="1">1 hour</option>
                  <option value="24">24 hours</option>
                  <option value="72">3 days</option>
                  <option value="168">1 week</option>
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label style={{ display: "flex", alignItems: "center", color: "#b5bac1", cursor: "pointer", fontWeight: "bold" }}>
                  <input type="checkbox" checked={allowMultiple} onChange={e => setAllowMultiple(e.target.checked)} style={{ marginRight: "10px", width: "18px", height: "18px", accentColor: "#5865F2" }} />
                  Allow Multiple Answers
                </label>
                <button type="submit" disabled={createLoading} style={{ background: "#5865F2", color: "#fff", border: "none", padding: "10px 24px", borderRadius: "4px", fontWeight: "bold", cursor: createLoading ? "not-allowed" : "pointer" }}>
                  {createLoading ? "Posting..." : "Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
