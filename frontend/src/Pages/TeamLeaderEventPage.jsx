import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AcceptedHosts from "../components/teamleader/AcceptedHosts";
import EventRating from "../components/teamleader/EventRating";
import EventPlanSeating from "../components/teamleader/EventPlanSeating";
import { Calendar, MapPin, Users, Clock, Building2 } from "lucide-react";

export default function TeamLeaderEventPage() {
  const { eventId } = useParams();
  const [activeTab, setActiveTab] = useState("hosts");

  // Demo event data
  const event = {
    eventId: eventId || 1,
    title: "Luxury Wedding Reception",
    type: "Wedding",
    category: "Luxury",
    date: "2026-05-20",
    time: "18:00 - 23:00",
    location: "Le Royal Hotel, Beirut",
    dressCode: "Black Tie",
    description: "Elegant outdoor wedding reception with 200 guests. Professional hosts needed for guest coordination, cocktail service, and event flow management.",
    status: "Upcoming",
    client: {
      name: "Sarah & Michael Thompson",
      email: "sarah.thompson@email.com",
      phone: "+961 71 234 567",
      company: "Private Client",
    },
    teamLeader: {
      userId: 42,
      name: "Lina Saliba",
    },
    nbOfHosts: 12,
  };

  // Demo accepted hosts
  const acceptedHosts = [
    {
      userId: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      phone: "+961 70 123 456",
      role: "Host",
      experience: "3 years",
      languages: ["English", "French"],
      clothingSize: "S",
      profileImage: null,
      rating: 4.8,
    },
    {
      userId: 2,
      name: "Bob Smith",
      email: "bob@example.com",
      phone: "+961 71 234 567",
      role: "Host",
      experience: "2 years",
      languages: ["English", "Arabic"],
      clothingSize: "M",
      profileImage: null,
      rating: 4.5,
    },
    {
      userId: 3,
      name: "Grace Chen",
      email: "grace.chen@email.com",
      phone: "+961 71 789 012",
      role: "Host",
      experience: "3 years",
      languages: ["English", "Mandarin", "French"],
      clothingSize: "S",
      profileImage: null,
      rating: 4.9,
    },
    {
      userId: 4,
      name: "Hassan Khalil",
      email: "hassan.k@email.com",
      phone: "+961 70 890 123",
      role: "Host",
      experience: "5 years",
      languages: ["English", "Arabic", "French"],
      clothingSize: "L",
      profileImage: null,
      rating: 4.7,
    },
    {
      userId: 5,
      name: "Dana White",
      email: "dana@example.com",
      phone: "+961 76 456 789",
      role: "Host",
      experience: "4 years",
      languages: ["English", "Spanish"],
      clothingSize: "M",
      profileImage: null,
      rating: 4.6,
    },
  ];

  // Demo plan data
  const eventPlan = {
    schedule: [
      { time: "17:00", activity: "Team arrival & briefing", location: "Staff room" },
      { time: "17:30", activity: "Station setup & final checks", location: "All areas" },
      { time: "18:00", activity: "Guest arrival & welcome", location: "Main entrance" },
      { time: "18:30", activity: "Cocktail service begins", location: "Garden terrace" },
      { time: "19:30", activity: "Dinner seating coordination", location: "Ballroom" },
      { time: "20:00", activity: "Dinner service support", location: "Ballroom" },
      { time: "21:30", activity: "Cake ceremony coordination", location: "Ballroom" },
      { time: "22:00", activity: "Dancing & bar service", location: "Ballroom & Bar" },
      { time: "23:00", activity: "Guest departure & wrap-up", location: "Main entrance" },
    ],
    zones: [
      { name: "Main Entrance", hosts: ["Alice Johnson", "Bob Smith"], duties: "Guest welcome, coat check" },
      { name: "Garden Terrace", hosts: ["Grace Chen", "Dana White"], duties: "Cocktail service, canapé distribution" },
      { name: "Ballroom", hosts: ["Hassan Khalil", "Lina Saliba"], duties: "Seating coordination, dinner service" },
      { name: "Bar Area", hosts: ["Alice Johnson"], duties: "Drink orders, VIP service" },
    ],
    seatingCapacity: 200,
    tableCount: 20,
    notes: "VIP table #1 near the stage. Bride's family on left side, Groom's family on right.",
  };

  const tabs = [
    { id: "hosts", label: "Team Members", count: acceptedHosts.length },
    { id: "plan", label: "Event Plan & Seating", count: null },
    { id: "rating", label: "Rate Event", count: null },
  ];

  return (
    <main className="bg-pearl min-h-screen">
      <Navbar isLoggedIn={true} userType="team leader" />

      <div className="pt-24 space-y-6">
        {/* Event Header */}
        <section className="px-4">
          <div className="max-w-6xl mx-auto bg-white rounded-[3rem] p-8 md:p-10 shadow-xl border border-gray-100">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Event Info */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-sky text-ocean text-xs font-semibold uppercase">
                    {event.category}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-mint/30 text-green-700 text-xs font-semibold">
                    Team Leader View
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {event.title}
                </h1>

                <p className="text-gray-600">{event.description}</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={18} className="text-ocean" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={18} className="text-ocean" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={18} className="text-ocean" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users size={18} className="text-ocean" />
                    <span>{acceptedHosts.length}/{event.nbOfHosts} hosts</span>
                  </div>
                </div>
              </div>

              {/* Client Info Card */}
              <div className="lg:w-80 bg-cream rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-sky flex items-center justify-center">
                    <Building2 size={24} className="text-ocean" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Client</p>
                    <p className="font-bold text-gray-900">{event.client.name}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-700">Email:</span> {event.client.email}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-700">Phone:</span> {event.client.phone}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-700">Dress Code:</span> {event.dressCode}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <section className="px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-3xl shadow-lg p-2 flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-[140px] px-4 py-3 rounded-2xl text-sm font-semibold transition flex items-center justify-center gap-2 ${
                    activeTab === tab.id
                      ? "bg-ocean text-white shadow-md"
                      : "bg-transparent text-gray-700 hover:bg-cream"
                  }`}
                >
                  {tab.label}
                  {tab.count !== null && (
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      activeTab === tab.id ? "bg-white/20" : "bg-sky text-ocean"
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Tab Content */}
        <section className="px-4 pb-16">
          <div className="max-w-6xl mx-auto">
            {activeTab === "hosts" && <AcceptedHosts hosts={acceptedHosts} />}
            {activeTab === "plan" && <EventPlanSeating plan={eventPlan} />}
            {activeTab === "rating" && <EventRating event={event} />}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
