"use client";

import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#0b1421",
          color: "#e7eef6",
          border: "1px solid #1b2a3b",
          boxShadow: "0 12px 32px -12px rgba(0,0,0,.8)",
          fontSize: "14px",
        },
        success: { iconTheme: { primary: "#34d399", secondary: "#04141a" } },
        error: { iconTheme: { primary: "#fb7185", secondary: "#04141a" } },
      }}
    />
  );
}