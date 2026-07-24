"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function RewardHistoryPage() {
  const { data: session } = useSession();
  const [points, setPoints] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      // Fetch User Points
      fetch("/api/users/profile?email=" + encodeURIComponent(session.user.email || ""))
        .then(res => res.json())
        .then(data => {
          if (data && data.user) setPoints(data.user.rewardPoints || 0);
        });

      // Fetch Transaction History
      fetch("/api/rewards/history")
        .then(res => res.json())
        .then(data => {
          if (data.transactions) setTransactions(data.transactions);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [session]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#0f172a" }}>
      <main style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
        
        {/* Header */}
        <div style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "15px",
          padding: "20px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem"
        }}>
          <div>
            <h1 style={{ margin: 0, color: "white", fontSize: "2rem", fontWeight: "bold" }}>Transaction History</h1>
            <p style={{ margin: 0, color: "#94a3b8", marginTop: "5px" }}>View your earned and spent points.</p>
          </div>
          
          <div style={{
            background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            padding: "10px 25px",
            borderRadius: "50px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <i className="fa-solid fa-gem" style={{ color: "white", fontSize: "1.2rem" }}></i>
            <span style={{ color: "white", fontSize: "1.5rem", fontWeight: "bold" }}>{points} Points</span>
          </div>
        </div>

        {/* Transaction List */}
        <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "15px", border: "1px solid rgba(255,255,255,0.1)", overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: "30px", color: "white", textAlign: "center" }}>Loading history...</div>
          ) : !session ? (
            <div style={{ padding: "30px", color: "white", textAlign: "center" }}>Please login to view history.</div>
          ) : transactions.length === 0 ? (
            <div style={{ padding: "30px", color: "gray", textAlign: "center" }}>No transactions found. Go earn some points!</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", color: "white" }}>
              <thead style={{ background: "rgba(0,0,0,0.3)" }}>
                <tr>
                  <th style={{ padding: "15px", textAlign: "left" }}>Date</th>
                  <th style={{ padding: "15px", textAlign: "left" }}>Type</th>
                  <th style={{ padding: "15px", textAlign: "left" }}>Description</th>
                  <th style={{ padding: "15px", textAlign: "right" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding: "15px", color: "gray" }}>{formatDate(tx.createdAt)}</td>
                    <td style={{ padding: "15px" }}>
                      <span style={{
                        background: tx.type === 'EARN' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: tx.type === 'EARN' ? '#10b981' : '#ef4444',
                        padding: '5px 10px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>
                        {tx.type}
                      </span>
                    </td>
                    <td style={{ padding: "15px" }}>{tx.description} <span style={{ color: "gray", fontSize: "0.8rem", marginLeft: "10px" }}>via {tx.provider}</span></td>
                    <td style={{ padding: "15px", textAlign: "right", fontWeight: "bold", color: tx.type === 'EARN' ? '#10b981' : '#ef4444' }}>
                      {tx.type === 'EARN' ? '+' : '-'}{tx.amount} <i className="fa-solid fa-gem" style={{ fontSize: '0.9rem' }}></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </main>
    </div>
  );
}
