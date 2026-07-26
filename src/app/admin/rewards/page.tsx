"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function RewardsAdmin() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("products"); // products, history, points
  
  // Products State
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  
  // History State
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Config State
  const [dailyCheckInAmount, setDailyCheckInAmount] = useState(50);
  const [rewardCategories, setRewardCategories] = useState("Items, Pokemons, Exclusive Offers");
  const [savingConfig, setSavingConfig] = useState(false);
  const [categoriesList, setCategoriesList] = useState<string[]>(["Items", "Pokemons", "Exclusive Offers"]);

  // Form State - Product
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("Keys");
  const [price, setPrice] = useState(100);
  const [image, setImage] = useState("");
  const [stock, setStock] = useState(-1);
  const [commands, setCommands] = useState("");
  const [isExclusive, setIsExclusive] = useState(false);
  const [isLimited, setIsLimited] = useState(false);
  const [discount, setDiscount] = useState(0);

  // Form State - Points
  const [targetUser, setTargetUser] = useState("");
  const [pointAmount, setPointAmount] = useState(0);
  const [pointReason, setPointReason] = useState("");
  const [givingPoints, setGivingPoints] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchHistory();
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    const res = await fetch("/api/rewards/config");
    const data = await res.json();
    if (data.config) {
      setDailyCheckInAmount(data.config.dailyCheckInAmount || 50);
      setCategoriesList(data.config.rewardCategories || ["Items", "Pokemons", "Exclusive Offers"]);
      setRewardCategories((data.config.rewardCategories || ["Items", "Pokemons", "Exclusive Offers"]).join(", "));
    }
  };

  const fetchProducts = async () => {
    setLoadingProducts(true);
    const res = await fetch("/api/rewards/products?admin=true");
    const data = await res.json();
    if (data.products) setProducts(data.products);
    setLoadingProducts(false);
  };

  const fetchHistory = async () => {
    setLoadingHistory(true);
    const res = await fetch("/api/rewards/admin-history");
    const data = await res.json();
    if (data.transactions) setHistory(data.transactions);
    setLoadingHistory(false);
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setDesc("");
    setCategory("Keys");
    setPrice(100);
    setImage("");
    setStock(-1);
    setCommands("");
    setIsExclusive(false);
    setIsLimited(false);
    setDiscount(0);
  };

  const startEditing = (p: any) => {
    setEditingId(p._id);
    setName(p.name);
    setDesc(p.description);
    setCategory(p.category);
    setPrice(p.price);
    setImage(p.image);
    setStock(p.stock);
    setCommands(p.commands.join('\n'));
    setIsExclusive(p.isExclusive);
    setIsLimited(p.isLimited);
    setDiscount(p.discount || 0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      name,
      description: desc,
      category,
      price,
      image,
      stock,
      commands: commands.split('\n').filter(c => c.trim() !== ""),
      isExclusive,
      isLimited,
      discount
    };

    if (editingId) {
      // Update
      const res = await fetch("/api/rewards/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...productData })
      });
      const data = await res.json();
      if (data.success) {
        alert("Product Updated!");
        resetForm();
        fetchProducts();
      } else {
        alert("Error: " + data.error);
      }
    } else {
      // Create
      const res = await fetch("/api/rewards/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData)
      });
      const data = await res.json();
      if (data.success) {
        alert("Product Created!");
        resetForm();
        fetchProducts();
      } else {
        alert("Error: " + data.error);
      }
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const res = await fetch(`/api/rewards/products?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      alert("Product Deleted!");
      fetchProducts();
    } else {
      alert("Error: " + data.error);
    }
  };

  const handleGivePoints = async (e: React.FormEvent) => {
    e.preventDefault();
    setGivingPoints(true);
    const res = await fetch("/api/rewards/give-points", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: targetUser, amount: pointAmount, reason: pointReason })
    });
    const data = await res.json();
    setGivingPoints(false);
    if (data.success) {
      alert(data.message);
      setTargetUser("");
      setPointAmount(0);
      setPointReason("");
      fetchHistory(); // Refresh history table
    } else {
      alert("Error: " + data.error);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingConfig(true);
    
    const catsArray = rewardCategories.split(',').map(c => c.trim()).filter(c => c !== "");
    
    const res = await fetch("/api/rewards/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dailyCheckInAmount, rewardCategories: catsArray })
    });
    
    const data = await res.json();
    setSavingConfig(false);
    
    if (data.success) {
      alert("Settings saved successfully!");
      setCategoriesList(catsArray);
    } else {
      alert("Error: " + data.error);
    }
  };

  const TabButton = ({ id, label, icon }: { id: string, label: string, icon: string }) => (
    <button 
      onClick={() => setActiveTab(id)}
      style={{
        padding: "10px 20px",
        background: activeTab === id ? "#ec4899" : "rgba(255,255,255,0.05)",
        color: "white",
        border: activeTab === id ? "1px solid #ec4899" : "1px solid rgba(255,255,255,0.1)",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        gap: "8px"
      }}
    >
      <i className={icon}></i> {label}
    </button>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#0f172a" }}>
      <main style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
        
        <h1 style={{ color: "white", fontSize: "2.5rem", marginBottom: "1rem" }}>Rewards Economy Panel</h1>
        
        <div style={{ display: "flex", gap: "10px", marginBottom: "2rem", flexWrap: "wrap" }}>
          <TabButton id="products" label="Manage Products" icon="fa-solid fa-box" />
          <TabButton id="history" label="Global History" icon="fa-solid fa-globe" />
          <TabButton id="points" label="Give Points" icon="fa-solid fa-hand-holding-dollar" />
          <TabButton id="settings" label="Settings" icon="fa-solid fa-gear" />
        </div>

        {activeTab === "products" && (
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            {/* Create/Edit Product Form */}
            <div style={{ background: "rgba(255,255,255,0.05)", padding: "30px", borderRadius: "15px", flex: "1 1 400px" }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: "20px" }}>
                <h2 style={{ color: "white", margin: 0 }}>{editingId ? "Edit Product" : "Create New Product"}</h2>
                {editingId && (
                  <button onClick={resetForm} style={{ background: "transparent", border: "1px solid #ef4444", color: "#ef4444", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" }}>Cancel Edit</button>
                )}
              </div>
              <form onSubmit={handleSaveProduct} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                
                <input type="text" placeholder="Product Name (e.g. Alpha Key)" value={name} onChange={e => setName(e.target.value)} required style={{ padding: "10px", borderRadius: "5px", border: "1px solid #334155", background: "#1e293b", color: "white" }} />
                <textarea placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} required style={{ padding: "10px", borderRadius: "5px", border: "1px solid #334155", background: "#1e293b", color: "white", minHeight: "80px" }} />
                
                <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: "10px", borderRadius: "5px", border: "1px solid #334155", background: "#1e293b", color: "white" }}>
                  {categoriesList.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <div style={{ display: "flex", gap: "10px" }}>
                  <input type="number" placeholder="Price (Points)" value={price} onChange={e => setPrice(Number(e.target.value))} required style={{ flex: 1, padding: "10px", borderRadius: "5px", border: "1px solid #334155", background: "#1e293b", color: "white" }} />
                  <input type="number" placeholder="Discount %" value={discount} onChange={e => setDiscount(Number(e.target.value))} style={{ flex: 1, padding: "10px", borderRadius: "5px", border: "1px solid #334155", background: "#1e293b", color: "white" }} />
                  <input type="number" placeholder="Stock (-1 for infinite)" value={stock} onChange={e => setStock(Number(e.target.value))} style={{ flex: 1, padding: "10px", borderRadius: "5px", border: "1px solid #334155", background: "#1e293b", color: "white" }} />
                </div>

                <input type="text" placeholder="Image URL (e.g. https://imgur.com/...)" value={image} onChange={e => setImage(e.target.value)} required style={{ padding: "10px", borderRadius: "5px", border: "1px solid #334155", background: "#1e293b", color: "white" }} />
                
                <textarea placeholder="Minecraft Commands (1 per line). Use {player} for username." value={commands} onChange={e => setCommands(e.target.value)} style={{ padding: "10px", borderRadius: "5px", border: "1px solid #334155", background: "#1e293b", color: "white", minHeight: "100px" }} />

                <div style={{ display: "flex", gap: "20px", color: "white" }}>
                  <label><input type="checkbox" checked={isExclusive} onChange={e => setIsExclusive(e.target.checked)} /> Exclusive Item</label>
                  <label><input type="checkbox" checked={isLimited} onChange={e => setIsLimited(e.target.checked)} /> Limited Edition</label>
                </div>

                <button type="submit" style={{ background: editingId ? "#3b82f6" : "#10b981", color: "white", padding: "12px", borderRadius: "8px", border: "none", fontWeight: "bold", cursor: "pointer", fontSize: "1.1rem" }}>
                  {editingId ? "Update Product" : "Create Product"}
                </button>
              </form>
            </div>

            {/* Product List */}
            <div style={{ flex: "2 1 600px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px", alignContent: "start" }}>
              {loadingProducts ? <div style={{ color: "white" }}>Loading products...</div> : products.map(p => (
                <div key={p._id} style={{ background: "rgba(255,255,255,0.03)", padding: "15px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", position: 'relative' }}>
                  <img src={p.image} alt={p.name} style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "8px", marginBottom: "10px" }} />
                  <h3 style={{ color: "white", margin: "0 0 5px 0" }}>{p.name}</h3>
                  <p style={{ color: "#f59e0b", margin: 0, fontWeight: "bold" }}>{p.price} Points</p>
                  <p style={{ color: "gray", fontSize: "0.8rem", margin: "5px 0" }}>Category: {p.category} | Stock: {p.stock === -1 ? 'Infinite' : p.stock}</p>
                  
                  <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <button onClick={() => startEditing(p)} style={{ flex: 1, background: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', padding: '5px', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => handleDeleteProduct(p._id)} style={{ flex: 1, background: '#ef4444', color: 'white', border: 'none', borderRadius: '5px', padding: '5px', cursor: 'pointer' }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "15px", border: "1px solid rgba(255,255,255,0.1)", overflow: "hidden", overflowX: "auto" }}>
            {loadingHistory ? (
              <div style={{ padding: "30px", color: "white", textAlign: "center" }}>Loading history...</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", color: "white", minWidth: "800px" }}>
                <thead style={{ background: "rgba(0,0,0,0.3)" }}>
                  <tr>
                    <th style={{ padding: "15px", textAlign: "left" }}>Date</th>
                    <th style={{ padding: "15px", textAlign: "left" }}>User</th>
                    <th style={{ padding: "15px", textAlign: "left" }}>Type</th>
                    <th style={{ padding: "15px", textAlign: "left" }}>Description</th>
                    <th style={{ padding: "15px", textAlign: "right" }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(tx => (
                    <tr key={tx._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <td style={{ padding: "15px", color: "gray" }}>{new Date(tx.createdAt).toLocaleString()}</td>
                      <td style={{ padding: "15px", color: "#3b82f6", fontWeight: "bold" }}>{tx.username} <br/><span style={{fontSize: '0.8rem', color: 'gray'}}>{tx.email}</span></td>
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
                      <td style={{ padding: "15px" }}>{tx.description} <br/><span style={{ color: "gray", fontSize: "0.8rem" }}>via {tx.provider}</span></td>
                      <td style={{ padding: "15px", textAlign: "right", fontWeight: "bold", color: tx.type === 'EARN' ? '#10b981' : '#ef4444' }}>
                        {tx.type === 'EARN' ? '+' : '-'}{tx.amount} <i className="fa-solid fa-gem" style={{ fontSize: '0.9rem' }}></i>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === "points" && (
          <div style={{ background: "rgba(255,255,255,0.05)", padding: "30px", borderRadius: "15px", border: "1px solid rgba(255,255,255,0.1)", maxWidth: "500px" }}>
            <h2 style={{ color: "white", marginBottom: "10px" }}>Manually Give Points</h2>
            <p style={{ color: "gray", marginBottom: "20px" }}>Send reward points directly to a user's account. This action is logged.</p>
            <form onSubmit={handleGivePoints} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div>
                <label style={{ display: "block", color: "gray", marginBottom: "5px" }}>Username or Email</label>
                <input type="text" placeholder="e.g. notch or admin@pokefun.in" value={targetUser} onChange={e => setTargetUser(e.target.value)} required style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #334155", background: "#1e293b", color: "white" }} />
              </div>
              
              <div>
                <label style={{ display: "block", color: "gray", marginBottom: "5px" }}>Amount to Give</label>
                <input type="number" placeholder="1000" min="1" value={pointAmount || ''} onChange={e => setPointAmount(Number(e.target.value))} required style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #334155", background: "#1e293b", color: "white" }} />
              </div>

              <div>
                <label style={{ display: "block", color: "gray", marginBottom: "5px" }}>Reason (Optional)</label>
                <input type="text" placeholder="e.g. Won a discord event" value={pointReason} onChange={e => setPointReason(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #334155", background: "#1e293b", color: "white" }} />
              </div>

              <button type="submit" disabled={givingPoints} style={{ background: "#f59e0b", color: "black", padding: "12px", borderRadius: "8px", border: "none", fontWeight: "bold", cursor: "pointer", fontSize: "1.1rem", marginTop: "10px", opacity: givingPoints ? 0.5 : 1 }}>
                {givingPoints ? "Processing..." : "Send Points"}
              </button>
            </form>
          </div>
        )}

        {activeTab === "settings" && (
          <div style={{ background: "rgba(255,255,255,0.05)", padding: "30px", borderRadius: "15px", border: "1px solid rgba(255,255,255,0.1)", maxWidth: "600px" }}>
            <h2 style={{ color: "white", marginBottom: "10px" }}>Global Settings</h2>
            <p style={{ color: "gray", marginBottom: "20px" }}>Configure how the rewards system operates.</p>
            <form onSubmit={handleSaveConfig} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              
              <div>
                <label style={{ display: "block", color: "white", marginBottom: "5px", fontWeight: "bold" }}>Daily Check-In Points</label>
                <p style={{ color: "gray", fontSize: "0.85rem", margin: "0 0 10px 0" }}>How many points should a user get for clicking the Daily Check-in button?</p>
                <input type="number" placeholder="50" min="0" value={dailyCheckInAmount} onChange={e => setDailyCheckInAmount(Number(e.target.value))} required style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #334155", background: "#1e293b", color: "white" }} />
              </div>
              
              <div>
                <label style={{ display: "block", color: "white", marginBottom: "5px", fontWeight: "bold" }}>Reward Shop Categories</label>
                <p style={{ color: "gray", fontSize: "0.85rem", margin: "0 0 10px 0" }}>Comma separated list of categories for the shop (e.g. Items, Pokemons, Exclusive Offers).</p>
                <input type="text" value={rewardCategories} onChange={e => setRewardCategories(e.target.value)} required style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #334155", background: "#1e293b", color: "white" }} />
              </div>

              <button type="submit" disabled={savingConfig} style={{ background: "#3b82f6", color: "white", padding: "12px", borderRadius: "8px", border: "none", fontWeight: "bold", cursor: "pointer", fontSize: "1.1rem", marginTop: "10px", opacity: savingConfig ? 0.5 : 1 }}>
                {savingConfig ? "Saving..." : "Save Settings"}
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}
