import React from "react";

export default function ProfileStats({ profile, eventsCount, clientsCount }) {
  const stats = [
    { label: "Years Experience", value: profile.yearsOfExperience || 0 },
    { label: "Events Attended", value: eventsCount },
    { label: "Clients Worked With", value: clientsCount },
    { label: "Average Rating", value: profile.rating ? `${profile.rating}/5` : "N/A" },
  ];

  return (
    <section className="px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 text-center hover:shadow-md transition"
            >
              <p className="text-3xl font-bold text-ocean">{stat.value}</p>
              <p className="text-xs uppercase tracking-wide text-gray-500 mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
