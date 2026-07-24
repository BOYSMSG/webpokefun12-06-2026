"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function RewardShopPage() {
  const { data: session } = useSession();
  const [points, setPoints] = useState(0);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");

  const categories = [
    "All", "Exclusive", "Limited", "Keys", "Coins", "Pokemon", 
    "Ranks", "Cosmetics", "Titles", "Bundles"
  ];

  useEffect(() => {
    // Fetch User Points
    if (session?.user) {
      fetch("/api/users/profile?email=" + encodeURIComponent(session.user.email || ""))
        .then(res => res.json())
        .then(data => {
          if (data && data.user) setPoints(data.user.rewardPoints || 0);
        });
    }

    // Fetch Products
    fetch(`/api/rewards/products?category=${category}`)
      .then(res => res.json())
      .then(data => {
        if (data.products) setProducts(data.products);
        setLoading(false);
      });
  }, [session, category]);

  const handlePurchase = async (productId: string) => {
    const res = await fetch("/api/rewards/purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId })
    });
    const data = await res.json();
    if (data.success) {
      alert("Purchase successful! Item is queued for delivery.");
      setPoints(data.newBalance);
    } else {
      alert("Purchase failed: " + data.error);
    }
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
            <h1 style={{ margin: 0, color: "white", fontSize: "2rem", fontWeight: "bold" }}>Reward Shop</h1>
            <p style={{ margin: 0, color: "#94a3b8", marginTop: "5px" }}>Spend your hard-earned points on exclusive items!</p>
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

        {/* Category Filters */}
        <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "15px", marginBottom: "20px" }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => { setLoading(true); setCategory(cat); }}
              style={{
                background: category === cat ? "#1cc6db" : "rgba(255,255,255,0.05)",
                color: category === cat ? "black" : "white",
                border: "none",
                padding: "8px 20px",
                borderRadius: "50px",
                fontWeight: "bold",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s"
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <h2 style={{ color: "white", textAlign: "center", marginTop: "50px" }}>Loading products...</h2>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "25px"
          }}>
            {products.length === 0 ? (
              <h3 style={{ color: "#94a3b8" }}>No products found in this category.</h3>
            ) : (
              products.map(product => {
                const finalPrice = product.discount > 0 
                  ? product.price - (product.price * (product.discount / 100)) 
                  : product.price;

                return (
                  <div key={product._id} style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "15px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    position: "relative"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                  >
                    {/* Badges */}
                    <div style={{ position: "absolute", top: "10px", left: "10px", display: "flex", flexDirection: "column", gap: "5px", zIndex: 10 }}>
                      {product.isExclusive && <span style={{ background: "#ef4444", color: "white", padding: "3px 8px", borderRadius: "5px", fontSize: "0.8rem", fontWeight: "bold" }}>Exclusive</span>}
                      {product.isLimited && <span style={{ background: "#8b5cf6", color: "white", padding: "3px 8px", borderRadius: "5px", fontSize: "0.8rem", fontWeight: "bold" }}>Limited</span>}
                      {product.discount > 0 && <span style={{ background: "#10b981", color: "white", padding: "3px 8px", borderRadius: "5px", fontSize: "0.8rem", fontWeight: "bold" }}>{product.discount}% OFF</span>}
                    </div>

                    <div style={{ height: "200px", width: "100%", background: "#1e293b", display: "flex", justifyContent: "center", alignItems: "center" }}>
                      {/* Replace with next/image in production */}
                      <img src={product.image || "/images/placeholder.png"} alt={product.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover" }} />
                    </div>

                    <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                      <span style={{ color: "#1cc6db", fontSize: "0.8rem", fontWeight: "bold", textTransform: "uppercase" }}>{product.category}</span>
                      <h2 style={{ margin: "5px 0", color: "white", fontSize: "1.3rem" }}>{product.name}</h2>
                      <p style={{ color: "#94a3b8", fontSize: "0.9rem", flex: 1 }}>{product.description.length > 80 ? product.description.substring(0, 80) + '...' : product.description}</p>
                      
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "15px" }}>
                        <div>
                          {product.discount > 0 && <span style={{ color: "#ef4444", textDecoration: "line-through", fontSize: "0.9rem", marginRight: "5px" }}>{product.price}</span>}
                          <span style={{ color: "#f59e0b", fontSize: "1.4rem", fontWeight: "bold" }}>{finalPrice} <i className="fa-solid fa-gem" style={{ fontSize: "1rem" }}></i></span>
                        </div>
                        
                        <button 
                          onClick={() => handlePurchase(product._id)}
                          disabled={points < finalPrice || product.stock === 0}
                          style={{
                            background: points >= finalPrice && product.stock !== 0 ? "#1cc6db" : "#475569",
                            color: points >= finalPrice && product.stock !== 0 ? "black" : "#94a3b8",
                            border: "none",
                            padding: "8px 15px",
                            borderRadius: "8px",
                            fontWeight: "bold",
                            cursor: points >= finalPrice && product.stock !== 0 ? "pointer" : "not-allowed"
                          }}
                        >
                          {product.stock === 0 ? "Out of Stock" : "Buy Now"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

      </main>
    </div>
  );
}
