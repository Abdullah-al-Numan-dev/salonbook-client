"use client";

import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#ffffff",
          color: "#2b1d22",
          border: "1px solid #eaddd8",
          fontSize: "14px",
        },
        success: { iconTheme: { primary: "#15803d", secondary: "#ffffff" } },
        error: { iconTheme: { primary: "#b91c1c", secondary: "#ffffff" } },
      }}
    />
  );
}