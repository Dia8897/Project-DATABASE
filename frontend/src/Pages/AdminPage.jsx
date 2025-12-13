import React, { useState } from "react";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AdminStats from "../components/admin/AdminStats";
import EventRequests from "../components/admin/EventRequests";
import HostApplications from "../components/admin/HostApplications";
import ClientDirectory from "../components/admin/ClientDirectory";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("events");

  return (
    <main className="bg-pearl min-h-screen">
      <Navbar />
      
      {/* Stats Section */}
      <div>
        <AdminStats />
      </div>

      {/* Tab Navigation */}
      <section className="px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl shadow-lg p-2 flex gap-2">
            <button
              onClick={() => setActiveTab("events")}
              className={`flex-1 px-6 py-4 rounded-2xl text-base font-semibold transition ${
                activeTab === "events"
                  ? "bg-ocean text-white shadow-md"
                  : "bg-transparent text-gray-700 hover:bg-cream"
              }`}
            >
              Event Requests
            </button>
            <button
              onClick={() => setActiveTab("hosts")}
              className={`flex-1 px-6 py-4 rounded-2xl text-base font-semibold transition ${
                activeTab === "hosts"
                  ? "bg-ocean text-white shadow-md"
                  : "bg-transparent text-gray-700 hover:bg-cream"
              }`}
            >
              Host Applications
            </button>
            <button
              onClick={() => setActiveTab("clients")}
              className={`flex-1 px-6 py-4 rounded-2xl text-base font-semibold transition ${
                activeTab === "clients"
                  ? "bg-ocean text-white shadow-md"
                  : "bg-transparent text-gray-700 hover:bg-cream"
              }`}
            >
              Clients
            </button>
          </div>
        </div>
      </section>

      {/* Content based on active tab */}
      {activeTab === "events" ? (
        <EventRequests />
      ) : activeTab === "hosts" ? (
        <HostApplications />
      ) : (
        <ClientDirectory />
      )}

      <Footer />
    </main>
  );
}
