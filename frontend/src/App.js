import EventCard from "./components/EventCard";
import Navbar from "./components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import Hero from "./components/Hero"
import Features from "./components/Features"
import AboutUs from "./components/AboutUs"
import Footer from "./components/Footer"
import SignIn from "./components/SignIn"
import React, { useState } from "react";


export default function Home() {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const sampleEvent = {
    title: "Gala Night - Charity",
    date: "2026-01-15",
    location: "Ritz Ballroom",
    dress: "Black Tie",
    hostsAdmitted: 12,
    hostsRequested: 20,
    shortDescription: "A charity gala with VIP guests.",
    image: "/images/gala.jpg",
  };

  return (
    <main className="p-6 grid place-items-center min-h-screen bg-gray-50">
      {/* <EventCard
        event={sampleEvent}
        onApply={(e) => console.log("Apply clicked:", e.title)}
        onRequestDress={(e) => console.log("Dress requested for:", e.title)}
      /> */}
      <Navbar onJoinClick={openModal} />
      <Hero onJoinClick={openModal} />
      <Features />
      <AboutUs />
      <Footer />
      <SignIn show={showModal} onClose={closeModal} />

    </main>
  );
}
