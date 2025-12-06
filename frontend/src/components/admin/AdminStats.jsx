import React, { useState, useEffect } from "react";
import { adminAPI } from "../../services/api";

export default function AdminStats() {
  const [stats, setStats] = useState({
    pendingRequests: 0,
    totalApplications: 0,
    approvedEvents: 0,
    activeHosts: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminAPI.getStats();
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    fetchStats();
  }, []);

  const statsDisplay = [
    { label: "Pending Requests", value: stats.pendingRequests, color: "text-rose" },
    { label: "Total Applications", value: stats.totalApplications, color: "text-ocean" },
    { label: "Approved Events", value: stats.approvedEvents, color: "text-mint" },
    { label: "Active Hosts", value: stats.activeHosts, color: "text-sky" },
  ];

  return (
    <section className="px-4 pt-24">
      <div className="max-w-6xl mx-auto bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-gray-100">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-ocean font-semibold">
              Admin Overview
            </p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
              Manage Events & Applications
            </h1>
            <p className="text-base text-gray-600 max-w-2xl">
              Review event requests from clients, manage host applications, and oversee all platform activities from your centralized dashboard.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            {statsDisplay.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-gray-100 bg-cream px-4 py-5 text-center hover:shadow-md transition"
              >
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-[0.7rem] uppercase tracking-wide text-gray-500 mt-2">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
