import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileStats from "../components/profile/ProfileStats";
import AppliedEvents from "../components/profile/AppliedEvents";
import AttendedEvents from "../components/profile/AttendedEvents";
import Trainings from "../components/profile/Trainings";
import WorkedClients from "../components/profile/WorkedClients";

export default function HostProfilePage() {
  const { hostId } = useParams();
  const [activeTab, setActiveTab] = useState("applied");

  const hostProfile = {
    userId: hostId || 42,
    fName: "Lina",
    lName: "Saliba",
    email: "lina.saliba@example.com",
    phoneNb: "+961 70 123 456",
    gender: "F",
    age: 26,
    address: "Beirut Downtown, Biel",
    clothingSize: "S",
    eligibility: "approved",
    yearsOfExperience: 4,
    rating: 4.8,
    totalEvents: 28,
    description: "VIP hostess with corporate and luxury retail experience, bilingual ENG/FR",
    spokenLanguages: ["English", "French", "Arabic"],
    profileImage: null,
  };

  const appliedEvents = [
    { id: 1, title: "Gala Night", date: "2026-01-15", location: "Ritz Ballroom", status: "Pending", category: "Luxury" },
    { id: 2, title: "Corporate Conference", date: "2026-02-01", location: "Downtown Convention Center", status: "Accepted", category: "Corporate" },
    { id: 3, title: "Fashion Week Showcase", date: "2026-01-28", location: "Warehouse District Studio 5", status: "Pending", category: "Luxury" },
  ];

  const attendedEvents = [
    { id: 1, title: "Tech Product Launch", date: "2025-10-15", location: "Atelier 9 Studio", role: "Host", rating: 5.0, client: "TechCorp Lebanon" },
    { id: 2, title: "Charity Gala", date: "2025-09-20", location: "Four Seasons Hotel", role: "Team Leader", rating: 4.9, client: "Hope Foundation" },
    { id: 3, title: "Wedding Reception", date: "2025-08-12", location: "Le Royal Hotel", role: "Host", rating: 4.8, client: "Private Client" },
    { id: 4, title: "Corporate Summit", date: "2025-07-05", location: "BIEL Convention Center", role: "Host", rating: 4.7, client: "Global Solutions Inc." },
    { id: 5, title: "Art Gallery Opening", date: "2025-06-18", location: "Gemmayzeh Art District", role: "Host", rating: 5.0, client: "Beirut Contemporary Art" },
  ];

  const trainings = [
    { id: 1, title: "VIP Guest Management", date: "2025-11-01", duration: "4 hours", status: "Completed", certificate: true },
    { id: 2, title: "Event Safety & Protocols", date: "2025-10-15", duration: "3 hours", status: "Completed", certificate: true },
    { id: 3, title: "Luxury Brand Standards", date: "2025-09-20", duration: "6 hours", status: "Completed", certificate: true },
    { id: 4, title: "Team Leadership Essentials", date: "2026-01-08", duration: "4 hours", status: "Upcoming", certificate: false },
  ];

  const workedClients = [
    { id: 1, name: "TechCorp Lebanon", eventsWorked: 3, lastEvent: "2025-10-15", rating: 4.9 },
    { id: 2, name: "Hope Foundation", eventsWorked: 2, lastEvent: "2025-09-20", rating: 5.0 },
    { id: 3, name: "Le Royal Hotel", eventsWorked: 4, lastEvent: "2025-08-12", rating: 4.8 },
    { id: 4, name: "Global Solutions Inc.", eventsWorked: 2, lastEvent: "2025-07-05", rating: 4.7 },
    { id: 5, name: "Beirut Contemporary Art", eventsWorked: 1, lastEvent: "2025-06-18", rating: 5.0 },
  ];

  const tabs = [
    { id: "applied", label: "Applied Events", count: appliedEvents.length },
    { id: "attended", label: "Attended Events", count: attendedEvents.length },
    { id: "trainings", label: "Trainings", count: trainings.length },
    { id: "clients", label: "Clients", count: workedClients.length },
  ];

  return (
    <main className="bg-pearl min-h-screen">
      <Navbar isLoggedIn={true} userType="host" />

      <div className="pt-24 space-y-8">
        <ProfileHeader profile={hostProfile} />
        <ProfileStats profile={hostProfile} eventsCount={attendedEvents.length} clientsCount={workedClients.length} />

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
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id ? "bg-white/20" : "bg-sky text-ocean"
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Tab Content */}
        <section className="px-4 pb-16">
          <div className="max-w-6xl mx-auto">
            {activeTab === "applied" && <AppliedEvents events={appliedEvents} />}
            {activeTab === "attended" && <AttendedEvents events={attendedEvents} />}
            {activeTab === "trainings" && <Trainings trainings={trainings} />}
            {activeTab === "clients" && <WorkedClients clients={workedClients} />}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
