import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiService } from "../../Services/api";
import { FaWifi, FaBolt, FaCrown } from "react-icons/fa";

import "../../styles/page.css";
import "./pricing.css";
import { BackButton } from "../../components/buttons/buttons";

const PricingPlanContainer = ({ plan }) => {
  const navigate = useNavigate();
  const { title, icon, price, description } = plan;
  const _title = title.toLowerCase();
  const handleClick = (e) => {
    e.preventDefault();
    console.log(`Chosen ${_title}.\nWhat now?`);
    navigate("/status");
  };
  return (
    <section className="pricing-plan-wrapper" onClick={handleClick}>
      <section className={`header ${_title}`}>
        <section className="title">
          {icon}
          <h3>{title}</h3>
        </section>
        <div className="price">{price}</div>
      </section>
      <section className="desc">{description}</section>
    </section>
  );
};

const PremiumPricing = () => {
  const location = useLocation();
  const from = location.state?.from || "/";

  const plans = [
    {
      title: "Basic",
      icon: <FaWifi className="largeIcon" />,
      price: "$5.99",
      description:
        "Perfect for casual browsing and light usage. Speeds up to 25 Mbps.",
    },
    {
      title: "Standard",
      icon: <FaBolt className="largeIcon" />,
      price: "$7.99",
      description:
        "Ideal for streaming and everyday use. Speeds up to 100 Mbps.",
    },
    {
      title: "Premium",
      icon: <FaCrown className="largeIcon" />,
      price: "$10.00",
      description:
        "Best for heavy usage and multiple devices. Speeds up to 300 Mbps.",
    },
  ];
  const token = "be3e4d99";

  useEffect(() => {}, [token]);

  return (
    <div className="main-wrapper">
      <div className="main-box">
        <BackButton to={from} />
        <h1>Our Pricing Plans</h1>

        <p style={{ color: "red", fontWeight: "bold", fontStyle: "italic" }}>
          TODO: Set pricing plan API
        </p>
        <div className="plans-list">
          {plans.map((p) => (
            <PricingPlanContainer key={p.title} plan={p} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PremiumPricing;
