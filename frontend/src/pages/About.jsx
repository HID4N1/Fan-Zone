import React from "react";
import "./About.css";

const stats = [
  { label: "Transaction Success Rate", value: "99%" },
  { label: "Average User Savings", value: "$12,000+" },
  { label: "Improved Fan Experience", value: "85%" },
  { label: "Active Users Worldwide", value: "50K+" },
];

const About = () => (
  <>
    <section className="about-hero paynext-style">
      <div className="about-hero-content">
        <h1>Empowering Fan Experience</h1>
        <p className="about-hero-sub">Transforming the way fans connect, explore, and enjoy events with innovation, security, and trust.</p>
      </div>
    </section>

    <section className="about-section about-vision-mission-grid">
      {/* Vision */}
      <div className="about-vision-row">
        <div className="about-vision-imgbox">
          <img src={process.env.PUBLIC_URL + "/assets/icons/smartphone.png"} alt="Vision" />
        </div>
        <div className="about-vision-textbox">
          <span className="about-section-label vision">Vision</span>
          <h2>Our Vision Is To Be The Leading Global Fan Experience Solution</h2>
          <p>We empower fans and communities to enjoy events with clarity and excitement. We strive to foster a world where connecting, navigating, and sharing is simple, secure, and accessible to all.</p>
        </div>
      </div>
      {/* Mission */}
      <div className="about-mission-row">
        <div className="about-mission-textbox">
          <span className="about-section-label mission">Mission</span>
          <h2>Our Mission Is To Simplify Event Access With Secure Technology</h2>
          <p>We build tools that enable fans to gain clarity and control over their event experience while promoting trust and innovation. By cultivating a user-centric approach, we ensure every individual and community can achieve more from every event.</p>
        </div>
        <div className="about-mission-imgbox">
          <img src={process.env.PUBLIC_URL + "/assets/icons/mission.png"} alt="Mission" />
        </div>
      </div>
      {/* Stats bar placée ici */}
      <div className="about-stats-bar about-stats-bar-centered">
        {stats.map((stat) => (
          <div className="about-stat" key={stat.label}>
            <div className="about-stat-value">{stat.value}</div>
            <div className="about-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>

    <div style={{ minHeight: '60px' }}></div>
  </>
);

export default About;