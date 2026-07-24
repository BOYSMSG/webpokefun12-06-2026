"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function RewardsAdmin() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
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

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch("/api/rewards/products?admin=true");
    const data = await res.json();
    if (data.products) setProducts(data.products);
    setLoading(false);
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct = {
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

    const res = await fetch("/api/rewards/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct)
    });

    const data = await res.json();
    if (data.success) {
      alert("Product Created!");
      fetchProducts();
    } else {
      alert("Error: " + data.error);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#0f172a" }}>
      <main style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
        
        <h1 style={{ color: "white", fontSize: "2.5rem", marginBottom: "2rem" }}>Rewards Admin Panel</h1>

        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          {/* Create Product Form */}
          <div style={{ background: "rgba(255,255,255,0.05)", padding: "30px", borderRadius: "15px", flex: "1 1 400px" }}>
            <h2 style={{ color: "white", marginBottom: "20px" }}>Create New Product</h2>
            <form onSubmit={handleCreateProduct} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              
              <input type="text" placeholder="Product Name (e.g. Alpha Key)" value={name} onChange={e => setName(e.target.value)} required style={{ padding: "10px", borderRadius: "5px", border: "1px solid #334155", background: "#1e293b", color: "white" }} />
              <textarea placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} required style={{ padding: "10px", borderRadius: "5px", border: "1px solid #334155", background: "#1e293b", color: "white", minHeight: "80px" }} />
              
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: "10px", borderRadius: "5px", border: "1px solid #334155", background: "#1e293b", color: "white" }}>
                {["Keys", "Coins", "Pokemon", "Ranks", "Cosmetics", "Titles", "Limited Items", "Exclusive Items", "Bundles", "Special Offers"].map(c => <option key={c} value={c}>{c}</option>)}
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

              <button type="submit" style={{ background: "#10b981", color: "white", padding: "12px", borderRadius: "8px", border: "none", fontWeight: "bold", cursor: "pointer", fontSize: "1.1rem" }}>Create Product</button>
            </form>
          </div>

          {/* Product List */}
          <div style={{ flex: "2 1 600px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px", alignContent: "start" }}>
            {products.map(p => (
              <div key={p._id} style={{ background: "rgba(255,255,255,0.03)", padding: "15px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)" }}>
                <img src={p.image} alt={p.name} style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "8px", marginBottom: "10px" }} />
                <h3 style={{ color: "white", margin: "0 0 5px 0" }}>{p.name}</h3>
                <p style={{ color: "#f59e0b", margin: 0, fontWeight: "bold" }}>{p.price} Points</p>
                <p style={{ color: "gray", fontSize: "0.8rem", margin: "5px 0" }}>Category: {p.category}</p>
                <p style={{ color: "gray", fontSize: "0.8rem", margin: 0 }}>Stock: {p.stock === -1 ? 'Infinite' : p.stock}</p>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}
