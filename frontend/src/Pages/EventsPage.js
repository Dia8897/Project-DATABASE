import React from "react";
import Navbar from "../components/Navbar";
import EventsSection from "../components/EventsSection";
import Footer from "../components/Footer";

export default function EventsPage() {
  
  // Temporary test events
  const testEvents = [
    {
      title: "Gala Night",
      date: "2026-01-15",
      location: "Ritz Ballroom",
      hostsAdmitted: 12,
      hostsRequested: 20,
    },
    {
      title: "Fashion Show",
      date: "2026-03-10",
      location: "Beirut Waterfront",
      hostsAdmitted: 6,
      hostsRequested: 15,
    },
  ];

  return (
    <main className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="pt-24">
        <EventsSection
          events={testEvents}
          onViewDetails={(ev) => alert("Viewing: " + ev.title)}
        />
      </div>

      <Footer />
    </main>
  );
}
