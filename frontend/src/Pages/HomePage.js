import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import AboutUs from "../components/AboutUs";
import Footer from "../components/Footer";
import SignIn from "../components/SignIn";

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <main className="bg-gray-50 min-h-screen">

      <Navbar onJoinClick={() => setShowModal(true)} />
      <Hero onJoinClick={() => setShowModal(true)} />
      <Features />
      <AboutUs />
      <Footer />

      <SignIn
        show={showModal}
        onClose={() => setShowModal(false)}
      />
    </main>
  );
}
