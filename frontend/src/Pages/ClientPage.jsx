import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ClientEventList from "../components/ClientEventList";
import ClientEventRequest from "../components/ClientEventRequest";

import wedding from "../pics/wedding.png";
import birthday from "../pics/birthday.png";
import baby from "../pics/babyWelcomming.png";
import engagement from "../pics/engagement.png";
import bachelorette from "../pics/bachelorette.png";
import corporate from "../pics/corporateDinner.png";

export default function ClientPage() {
  // EVENT STATE (Date is null initially)
  const [eventType, setEventType] = useState("Wedding");
  const [eventDate, setEventDate] = useState(null);   // MUST BE Date object or null
  const [guests, setGuests] = useState("");

  // EVENTS LIST
  const [events, setEvents] = useState([
    {
      id: 1,
      type: "Wedding",
      date: "2026-06-10",
      guests: 150,
      status: "Pending review",
    },
    {
      id: 2,
      type: "Birthday Party",
      date: "2026-03-02",
      guests: 40,
      status: "Confirmed",
    },
    {
      id: 3,
      type: "Corporate Gala",
      date: "2026-09-15",
      guests: 200,
      status: "Under discussion",
    },
  ]);

  // OCCASIONS ARRAY (icons)
  const occasions = [
    { id: "Wedding", label: "Wedding", icon: wedding },
    { id: "Birthday", label: "Birthday", icon: birthday },
    { id: "Baby Welcoming", label: "Baby Welcoming", icon: baby },
    { id: "Engagement", label: "Engagement", icon: engagement },
    { id: "Bachelorette", label: "Bachelorette", icon: bachelorette },
    { id: "Corporate dinner", label: "Corporate dinner", icon: corporate },
  ];

  // HANDLE FORM SUBMIT
  const handleCreateRequest = (e) => {
    e.preventDefault();

    if (!eventDate || !guests) {
      alert("Please select an event date and number of guests.");
      return;
    }

    // Convert Date object → "YYYY-MM-DD"
    const formattedDate = eventDate.toISOString().split("T")[0];

    const newEvent = {
      id: Date.now(),
      type: eventType,
      date: formattedDate,
      guests: Number(guests),
      status: "Pending review",
    };

    setEvents((prev) => [...prev, newEvent]);

    // Reset fields
    setEventDate(null);
    setGuests("");
  };

  return (
    <>
      <Navbar />

      <div className="bg-white min-h-screen pt-24 pb-10">
        <main className="max-w-6xl mx-auto px-4">
          {/* EVENT REQUEST SECTION (icons + datepicker) */}
          <section className="mt-10">
            <ClientEventRequest
              occasions={occasions}
              eventType={eventType}
              eventDate={eventDate}
              guests={guests}
              onTypeChange={setEventType}
              onDateChange={setEventDate}      // receives Date object
              onGuestsChange={setGuests}
              onSubmit={handleCreateRequest}
            />
          </section>

          {/* EVENT LIST */}
          <ClientEventList events={events} />
        </main>
      </div>

      <Footer />
    </>
  );
}
