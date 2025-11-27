import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ClientHero from "../components/ClientHero";
import ClientSignInSection from "../components/ClientSignInSection";
import ClientEventRequest from "../components/ClientEventRequest";
import ClientEventList from "../components/ClientEventList";
import wedding from "../pics/wedding.png";
import birthday from "../pics/birthday.png"
import  baby from "../pics/babyWelcomming.png"
import engagement from "../pics/engagement.png"
import bachelorette from "../pics/bachelorette.png"
import corporate from "../pics/corporateDinner.png"
// import React, { useState } from "react";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import ClientHero from "../components/ClientHero";
// import ClientEventList from "../components/ClientEventList";

export default function ClientPage() {
  // CLIENT DETAILS STATE (left side)
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  // EVENT REQUEST STATE (right side)
  const [eventType, setEventType] = useState("Wedding");
  const [eventDate, setEventDate] = useState("");
  const [guests, setGuests] = useState("");

  // EVENTS LIST STATE
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
    { id: "Wedding", label: "Wedding", icon: wedding},
    { id: "Birthday", label: "Birthday", icon:birthday },
    { id: "Baby Welcoming", label: "Baby Welcoming", icon: baby },
    { id: "Engagement", label: "Engagement", icon: engagement },
    { id: "Bachelorette", label: "Bachelorette", icon: bachelorette },
    { id: "Corporate dinner", label: "Corporate dinner", icon: corporate },
    
  ];

  // HANDLE EVENT CREATION (form submit)
  const handleCreateRequest = (e) => {
    e.preventDefault();

    if (!clientName || !email) {
      alert("Please enter your name and email.");
      return;
    }
    if (!eventDate || !guests) {
      alert("Please select an event date and number of guests.");
      return;
    }

    const newEvent = {
      id: Date.now(),
      type: eventType,
      date: eventDate,
      guests: Number(guests),
      status: "Pending review",
    };

    setEvents((prev) => [...prev, newEvent]);

    // clear only event-related fields (you can also clear contact fields if you want)
    setEventDate("");
    setGuests("");
    setSubject("");
    setMessage("");
  };

  return (
    <>
      <Navbar />

      <div className="bg-gray-100 min-h-screen pt-24 pb-10">
        <main className="max-w-6xl mx-auto px-4">
          {/* top "Client Portal" hero still there */}
          <ClientHero />

          {/* MAIN 2-COLUMN SECTION */}
          <section className="mt-10 grid gap-10 lg:grid-cols-2 items-start">
            {/* LEFT: soft pink form */}
            <form
              onSubmit={handleCreateRequest}
              className="bg-[#fdf1ee] rounded-3xl px-8 py-10 space-y-5"
            >
              <input
                type="text"
                placeholder="Your Name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full rounded-full bg-[#fbe5e0] px-5 py-3 text-sm placeholder:text-gray-400 border border-transparent focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-full bg-[#fbe5e0] px-5 py-3 text-sm placeholder:text-gray-400 border border-transparent focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
              <input
                type="tel"
                placeholder="Your Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-full bg-[#fbe5e0] px-5 py-3 text-sm placeholder:text-gray-400 border border-transparent focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-full bg-[#fbe5e0] px-5 py-3 text-sm placeholder:text-gray-400 border border-transparent focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
              <input
                type="text"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-full bg-[#fbe5e0] px-5 py-3 text-sm placeholder:text-gray-400 border border-transparent focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
              <textarea
                placeholder="Message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-3xl bg-[#fbe5e0] px-5 py-3 text-sm placeholder:text-gray-400 border border-transparent resize-none focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
              {/* Submit is on right side in the design, so no button here */}
            </form>

            {/* RIGHT: "What is Your Occasion?" + icons + date/guests + button */}
            <div>
              <h2 className="text-3xl font-semibold tracking-wide">
                What is Your Occasion?
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                (Please select any one occasion from the list below.)
              </p>

              {/* icons grid */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-6">
                {occasions.map((o) => (
                  <label
                    key={o.id}
                    className="flex flex-col items-center gap-2 cursor-pointer"
                  >
                    <img
                      src={o.icon}
                      alt={o.label}
                      className="w-20 h-20 object-contain"
                    />
                    <div className="flex items-center gap-1 text-sm">
                      <input
                        type="radio"
                        name="eventType"
                        value={o.label}
                        checked={eventType === o.label}
                        onChange={() => setEventType(o.label)}
                      />
                      <span>{o.label}</span>
                    </div>
                  </label>
                ))}
              </div>

              {/* date + guests + submit button (under icons) */}
              <form
                onSubmit={handleCreateRequest}
                className="mt-8 space-y-4 max-w-md"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Event date
                    </label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Guests
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g. 120"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-3 inline-flex items-center justify-center rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 transition"
                >
                  Submit event request
                </button>
              </form>
            </div>
          </section>

          {/* EVENTS LIST stays the same */}
          <ClientEventList events={events} />
        </main>
      </div>

      <Footer />
    </>
  );
}


