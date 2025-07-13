import React from "react";
import FanzoneCard from "../components/FanzoneCard";
import FanZonesData from "../data/FanZonesData";
import "./Fanzones.css";


const Fanzones = () => {
    return (
        <div className="fanzones-page">

        <div className="fanzones-header">
            <h1>Fan Zones</h1>
            <p>A Fan Zone is a lively, public gathering space where sports fans come together to watch live MATCHES, 
            enjoy entertainment, food, and drinks, and celebrate their passion. </p>
        </div>
        <div className="fanzones-container">
            {FanZonesData.map((fanzone) => (
                <FanzoneCard
                key={fanzone.id}
                imageUrl={fanzone.image}
                title={fanzone.name}
                description={fanzone.description}
                location={fanzone.location}
                capacity={fanzone.capacity}
                features={fanzone.features}
                openingHours={fanzone.openingHours}
                />
            ))}
        </div>

        </div>
    );
    }
export default Fanzones;
