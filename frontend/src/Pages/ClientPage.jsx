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
  const [eventType, setEventType] = useState("Wedding");
  const [eventDate, setEventDate] = useState(null);
  const [guests, setGuests] = useState("");

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

  const occasions = [
    { id: "Wedding", label: "Wedding", icon: wedding },
    { id: "Birthday", label: "Birthday", icon: birthday },
    { id: "Baby Welcoming", label: "Baby Welcoming", icon: baby },
    { id: "Engagement", label: "Engagement", icon: engagement },
    { id: "Bachelorette", label: "Bachelorette", icon: bachelorette },
    { id: "Corporate dinner", label: "Corporate dinner", icon: corporate },
  ];

  const handleCreateRequest = (e) => {
    e.preventDefault();

    if (!eventDate || !guests) {
      alert("Please select an event date and number of guests.");
      return;
    }

    const formattedDate = eventDate.toISOString().split("T")[0];

    const newEvent = {
      id: Date.now(),
      type: eventType,
      date: formattedDate,
      guests: Number(guests),
      status: "Pending review",
    };

    setEvents((prev) => [...prev, newEvent]);

    setEventDate(null);
    setGuests("");
  };

  const stats = [
    { label: "Total Requests", value: events.length },
    { label: "Confirmed", value: events.filter(e => e.status === "Confirmed").length },
    { label: "Pending", value: events.filter(e => e.status === "Pending review").length },
    { label: "In Discussion", value: events.filter(e => e.status === "Under discussion").length },
  ];

  return (
    <main className="bg-pearl min-h-screen">
      <Navbar />

      <div className="pt-24 space-y-8">
        {/* Header Section */}
        <section className="px-4">
          <div className="max-w-6xl mx-auto bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="space-y-5 lg:w-2/3">
                <p className="text-xs uppercase tracking-[0.4em] text-ocean font-semibold">
                  Event Planning
                </p>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
                  Plan your perfect event with us
                </h1>
                <p className="text-base text-gray-600 max-w-2xl">
                  From intimate gatherings to grand celebrations—select your occasion, pick a date, and let our professional hosts bring your vision to life.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-gray-100 bg-cream px-4 py-3 text-center"
                    >
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-[0.7rem] uppercase tracking-wide text-gray-500 mt-1">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Quick Info Card */}
              <div className="bg-sky text-gray-900 rounded-3xl p-6 w-full lg:w-auto shadow-inner border border-sky space-y-4">
                <p className="text-xs uppercase tracking-[0.4em] text-ocean font-semibold">
                  How it works
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-ocean text-white text-xs flex items-center justify-center font-bold">1</span>
                    <span className="text-sm text-gray-700">Choose your occasion type</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-ocean text-white text-xs flex items-center justify-center font-bold">2</span>
                    <span className="text-sm text-gray-700">Select date & guest count</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-ocean text-white text-xs flex items-center justify-center font-bold">3</span>
                    <span className="text-sm text-gray-700">Submit & we'll reach out</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Event Request Section */}
        <section className="px-4">
          <div className="max-w-6xl mx-auto">
            <ClientEventRequest
              occasions={occasions}
              eventType={eventType}
              eventDate={eventDate}
              guests={guests}
              onTypeChange={setEventType}
              onDateChange={setEventDate}
              onGuestsChange={setGuests}
              onSubmit={handleCreateRequest}
            />
          </div>
        </section>

        {/* Event List Section */}
        <section className="px-4 pb-16">
          <div className="max-w-6xl mx-auto">
            <ClientEventList events={events} />
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
