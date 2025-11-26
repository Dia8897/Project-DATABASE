import React from "react";

export default function ClientEventRequest({
  eventType,
  eventDate,
  guests,
  onTypeChange,
  onDateChange,
  onGuestsChange,
  onSubmit,
}) {
  return (
    <section className="border rounded-xl p-6 shadow-sm bg-white">
      <h2 className="text-xl font-semibold mb-4">Request a New Event</h2>

      <form className="space-y-4" onSubmit={onSubmit}>
        {/* EVENT TYPE */}
        <div>
          <label className="block text-sm font-medium mb-1">Event type</label>
          <select
            className="w-full border rounded-lg px-3 py-2"
            value={eventType}
            onChange={(e) => onTypeChange(e.target.value)}
          >
            <option>Wedding</option>
            <option>Engagement</option>
            <option>Birthday Party</option>
            <option>Corporate Event</option>
            <option>Graduation</option>
            <option>Baby Shower</option>
          </select>
        </div>

        {/* EVENT DATE */}
        <div>
          <label className="block text-sm font-medium mb-1">Event date</label>
          <input
            type="date"
            className="w-full border rounded-lg px-3 py-2"
            value={eventDate}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>

        {/* GUESTS */}
        <div>
          <label className="block text-sm font-medium mb-1">Guests</label>
          <input
            type="number"
            className="w-full border rounded-lg px-3 py-2"
            value={guests}
            onChange={(e) => onGuestsChange(e.target.value)}
            min="1"
            placeholder="e.g. 120"
          />
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
        >
          Submit event request
        </button>
      </form>
    </section>
  );
}
