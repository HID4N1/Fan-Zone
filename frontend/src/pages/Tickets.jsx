// TicketOptions.jsx
import React from "react";
import "./Tickets.css";

const Tickets = () => {
  return (
    <div className="ticket-page">
      <section className="single-ticket">
        <div className="ticket-card">
          <h3>Ticket Unitaire</h3>
          <p>Donne accès aux : <span role="img" aria-label="tram">🚊</span> <span role="img" aria-label="bus">🚌</span></p>
          <p>Ticket pour 1 voyage = 8 dhs / Ticket pour 2 voyages = 14 dhs (j'économise 2dhs)</p>
          <p className="price">8 dhs</p>
          <button>Découvrir ce titre &rarr;</button>
        </div>
      </section>

      <section className="regular-travel">
        <h2>Voyages réguliers</h2>
        <p className="subtitle">Voyagez en toute liberté avec notre carte rechargeable et nos cartes d'abonnement.</p>
        <div className="card-grid">
          {cards.map((card, idx) => (
            <div key={idx} className="card">
              <h4>{card.title}</h4>
              <p>Donne accès aux : <span role="img" aria-label="tram">🚊</span> <span role="img" aria-label="bus">🚌</span></p>
              <ul>
                {card.details.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
              <p className="price-highlight">{card.price}</p>
              <button>Découvrir ce titre &rarr;</button>
            </div>
          ))}
        </div>
      </section>

      <section className="subscription-footer">
        <button className="cta">Créer un abonnement ?</button>
        <button className="cta-outline">L'agence la plus proche ?</button>
      </section>

    </div>
  );
};

const cards = [
  {
    title: "Abonnement Hebdomadaire",
    details: [
      "J'économise 30% sur le plein tarif (sur base de 12 trajets par semaine)",
      "Voyage en illimité sur l'ensemble du réseau Casatramway + Casabusway",
      "Abonnement valable 1 semaine à partir de la 1ère validation"
    ],
    price: "60 dhs/semaine (+ 15 dhs pour la carte valable 5 ans)"
  },
  {
    title: "Abonnement Etudiant (< 26 ans) Mensuel",
    details: [
      "Réservé exclusivement aux étudiants de moins de 26 ans",
      "J'économise 50% sur le plein tarif (sur base de 48 trajets par mois)",
      "Voyage en illimité sur l'ensemble du réseau Casatramway + Casabusway",
      "Abonnement valable 30 jours à partir de la 1ère validation"
    ],
    price: "150 dhs / mois (+15 dhs pour la carte valable 5 ans)"
  },
  {
    title: "Abonnement Mensuel",
    details: [
      "J'économise 30% sur le plein tarif (sur base de 48 trajets par mois)",
      "Voyage en illimité sur l'ensemble du réseau Casatramway + Casabusway",
      "Abonnement valable 30 jours à partir de la 1ère validation"
    ],
    price: "230 dhs/mois (+ 15 dhs pour la carte valable 5 ans)"
  }
];

export default Tickets;
