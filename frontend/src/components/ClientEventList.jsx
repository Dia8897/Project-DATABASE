import React from "react";

export default function ClientEventList({ events }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Your Event Requests</h2>

      {events.length === 0 ? (
        <p className="text-gray-500">No requests yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <h3 className="text-lg font-semibold mb-1">{ev.type}</h3>

              <p className="text-sm text-gray-600 mb-1">
                Date: <span className="font-medium">{ev.date}</span>
              </p>

              <p className="text-sm text-gray-600 mb-1">
                Guests: <span className="font-medium">{ev.guests}</span>
              </p>

              <p
                className={`inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full ${
                  ev.status === "Confirmed"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {ev.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
