import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const QRCodeScanner = ({ onScan, onError, onClose }) => {
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const scannerId = useRef("qr-reader-container-" + Math.random().toString(36).substr(2, 9));

  const [isRunning, setIsRunning] = useState(true);

  const { dispatch } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!scannerRef.current) return;
  
    const html5QrCode = new Html5Qrcode(scannerId.current);
    html5QrCodeRef.current = html5QrCode;
  
    let isMounted = true;
    const isStarted = { current: false };
  
    html5QrCode
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        async (decodedText) => {
          if (!isMounted || !isStarted.current) return;
  
          let eventId = decodedText.trim();
          try {
            const url = new URL(eventId);
            const paths = url.pathname.split("/");
            eventId = paths[paths.length - 1] || eventId;
          } catch (e) {
            // Not a valid URL, keep eventId as is
          }
  
          // Call onScan prop with decodedText to let parent handle event lookup and navigation
          if (onScan) {
            onScan(eventId);
          }
  
          try {
            if (isStarted.current) {
              await html5QrCodeRef.current.stop();
              await html5QrCodeRef.current.clear();
              isStarted.current = false;
            }
          } catch (err) {
            console.warn("Safe stop failed:", err.message);
          }
        },
        (error) => {
          // Optionally log or ignore scan errors
        }
      )
      .then(() => {
        if (isMounted) {
          isStarted.current = true; // ✅ Scanner is fully running
        }
      })
      .catch((err) => {
        onError(err);
      });
  
    return () => {
      isMounted = false;
  
      if (html5QrCodeRef.current && isStarted.current) {
        html5QrCodeRef.current
          .stop()
          .then(() => {
            html5QrCodeRef.current.clear();
            isStarted.current = false;
          })
          .catch((err) => console.warn("Cleanup stop failed:", err.message));
      }
  
      if (scannerRef.current) {
        scannerRef.current.innerHTML = "";
      }
    };
  }, [onScan, onError]);
  

  return (
    <div>
      <div
        id={scannerId.current}
        ref={scannerRef}
        style={{ width: 300, margin: "0 auto" }}
      />
      <button
        onClick={onClose}
        style={{
          marginTop: 12,
          background: "#FF7900",
          color: "white",
          border: "none",
          borderRadius: "8px",
          padding: "8px 18px",
          fontWeight: 700,
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        Cancel
      </button>
    </div>
  );
};

export default QRCodeScanner;
