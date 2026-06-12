import React from "react";

export default function WikiGuidesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ flexGrow: 1, padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      {children}
    </div>
  );
}
