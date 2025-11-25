import React from "react";
import AdminHero from "../components/AdminHero";
import StatsSection from "../components/StatsSection";  
import ApplicationsSection from "../components/ApplicationsSection";
import Footer from "../components/Footer";

export default function AdminPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <AdminHero />
      {/* <StatsSection /> */}
      <ApplicationsSection />
      <Footer />
    </main>
  );
}
