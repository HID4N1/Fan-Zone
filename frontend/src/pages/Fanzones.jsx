import React, { useEffect, useState } from "react";
import FanzoneCard from "../components/FanzoneCard";
import "./Fanzones.css";

const Fanzones = () => {
    useEffect(() => {
        document.title = "CFW | Fanzones";
      }, []);
    const [fanzones, setFanzones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFanzones = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/public-fanzones/");
                if (!response.ok) {
                    throw new Error("HTTP error! status: " + response.status);
                }
                const data = await response.json();
                setFanzones(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFanzones();
    }, []);

    if (loading) {
        return <div className="fanzones-page"><p>Loading fan zones...</p></div>;
    }

    if (error) {
        return <div className="fanzones-page"><p>Error loading fan zones: {error}</p></div>;
    }

    return (
        <div className="fanzones-page">
            <div className="fanzones-header">
                <h1>Fan Zones</h1>
                <p>
                    A Fan Zone is a lively, public gathering space where sports fans come together to watch live MATCHES, 
                    enjoy entertainment, food, and drinks, and celebrate their passion.
                </p>
            </div>
            <div className="fanzones-container">
                {fanzones.map((fanzone) => (
                    <FanzoneCard
                        key={fanzone.id}
                        imageUrl={fanzone.image}
                        title={fanzone.name}
                        description={fanzone.description}
                        location={fanzone.adresse}
                        capacity={fanzone.capacity}
                        features={fanzone.features}
                        openingHours={fanzone.openingHours}
                    />
                ))}
            </div>
        </div>
    );
};

export default Fanzones;
