import React from "react";
import useNotificationPermission from "../hooks/useNotificationPermission";

const NotificationForm = ({ message, onClose, style, onClick }) => {
  const { permission, requestPermission } = useNotificationPermission();

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        backgroundColor: "#fff",
        color: "#333",
        padding: "1rem",
        boxSizing: "border-box",
        borderTopLeftRadius: "1rem",
        borderTopRightRadius: "1rem",
        boxShadow: "0 -2px 8px rgba(0,0,0,0.2)",
        zIndex: 1000,
        cursor: onClick ? "pointer" : "default",
        maxWidth: "100vw",
        ...style,
      }}
      onClick={onClick}
    >
      <div style={{ marginBottom: "0.5rem", fontWeight: "bold", fontSize: "1.1rem" }}>
        Notification
      </div>
      <div style={{ marginBottom: "0.5rem" }}>{message}</div>

      {permission !== "granted" && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            requestPermission();
          }}
          style={{
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "0.3rem",
            padding: "0.3rem 0.6rem",
            cursor: "pointer",
            fontSize: "0.9rem",
            marginRight: "0.5rem",
          }}
        >
          Enable Notifications
        </button>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        style={{
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "0.3rem",
          padding: "0.3rem 0.6rem",
          cursor: "pointer",
          fontSize: "0.9rem",
        }}
      >
        Close
      </button>
    </div>
  );
};

export default NotificationForm;
