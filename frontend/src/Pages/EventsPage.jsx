// src/Pages/EventsPage.js
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import EventsSection from "../components/EventsSection";
import Footer from "../components/Footer";
import ApplyModal from "../components/ApplyModal";

export default function EventsPage() {
  // 🧪 Temporary test events – mimicking DB shape
  const testEvents = [
    {
      eventId: 1,
      title: "Gala Night",
      date: "2026-01-15",
      location: "Ritz Ballroom",
      nbOfHosts: 20,
      acceptedHostsCount: 12,
      dressCode: "Black Tie",
      shortDescription: "A charity gala with VIP guests.",
      imageUrl: "/images/gala.jpg",
    },
    {
      eventId: 2,
      title: "Corporate Conference",
      date: "2026-02-01",
      location: "Downtown Convention Center",
      nbOfHosts: 15,
      acceptedHostsCount: 8,
      dressCode: "Business Formal",
      shortDescription: "A full-day corporate event with multiple sessions.",
      imageUrl: "/images/conference.jpg",
    },
    {
      eventId: 3,
      title: "Outdoor Festival",
      date: "2026-03-10",
      location: "City Park",
      nbOfHosts: 25,
      acceptedHostsCount: 5,
      dressCode: "Casual / Comfortable",
      shortDescription: "Outdoor music and food festival.",
      imageUrl: "/images/festival.jpg",
    },
  ];

  // 🔐 State MUST be here, at the top, before any return/JSX
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // View details handler (still simple for now)
  const handleViewDetails = (event) => {
    alert(`Event details page coming soon for: ${event.title}`);
  };

  // When user clicks "Apply" on a card
  const handleApply = (event) => {
    setSelectedEvent(event);   // remember which event
    setIsApplyOpen(true);      // open the modal
  };

  const handleCloseModal = () => {
    setIsApplyOpen(false);
    setSelectedEvent(null);
  };

  const handleApplicationSubmitted = () => {
    // later we can re-fetch events etc.
    setIsApplyOpen(false);
    setSelectedEvent(null);
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="pt-24">
        <EventsSection
          events={testEvents}
          onViewDetails={handleViewDetails}
          onApply={handleApply}
        />
      </div>

      <Footer />

      {/* Modal: only show when it's open AND we have an event */}
      {isApplyOpen && selectedEvent && (
        <ApplyModal
          event={selectedEvent}
          onClose={handleCloseModal}
          onSubmitted={handleApplicationSubmitted}
        />
      )}
    </main>
  );
}

