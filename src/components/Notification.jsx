// components/Notification.jsx (actualizado con estilos del aside)
import React from "react";

export default function Notification({ show, message, type = "info" }) {
  if (!show) return null;

  const bgColor = {
    success: "bg-green-50 border border-green-200",
    error: "bg-red-50 border border-red-200",
    warning: "bg-yellow-50 border border-yellow-200",
    info: "bg-blue-50 border border-blue-200",
  }[type];

  const textColor = {
    success: "text-green-700",
    error: "text-red-700",
    warning: "text-yellow-700",
    info: "text-blue-700",
  }[type];

  const icon = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  }[type];

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
      <div
        className={`${bgColor} rounded-xl shadow-lg p-4 max-w-xs flex items-start space-x-3`}
      >
        <span className="text-lg">{icon}</span>
        <span className={`text-sm font-medium ${textColor}`}>{message}</span>
      </div>
    </div>
  );
}
