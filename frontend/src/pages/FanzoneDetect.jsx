import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FanzoneDetect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate notification and redirect after arrival at fanzone
    const timer = setTimeout(() => {
      alert("You have arrived at the fanzone!");
      // Redirect to home or another page as needed
      navigate("/");
    }, 3000); // 3 seconds delay for demo

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div>
      <h1>Fanzone Detection</h1>
      <p>Detecting your arrival at the fanzone...</p>
    </div>
  );
};

export default FanzoneDetect;
