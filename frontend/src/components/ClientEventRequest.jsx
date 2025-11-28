import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ClientEventRequest({
  occasions,
  eventType,
  eventDate,      // Date or null
  guests,
  onTypeChange,
  onDateChange,   // will receive a Date
  onGuestsChange,
  onSubmit,
}) {
  return (
    <section className="w-full flex flex-col items-center">
      <div className="bg-[#FCF5EE] rounded-3xl px-8 py-10 w-full max-w-9xl shadow-sm">
        <h2 className="text-3xl font-semibold tracking-wide text-center">
          What is Your Occasion?
        </h2>
        <p className="mt-2 text-sm text-gray-500 text-center">
          (Select any occasion from the list below!)
        </p>

        {/* ICONS GRID */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
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
                  onChange={() => onTypeChange(o.label)}
                />
                <span>{o.label}</span>
              </div>
            </label>
          ))}
        </div>

        {/* DATE + GUESTS + SUBMIT */}
        <form onSubmit={onSubmit} className="mt-8 space-y-4 max-w-md mx-auto">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Event date
              </label>
              <DatePicker
                selected={eventDate}                     // Date or null
                onChange={(date) => onDateChange(date)}  // pass Date up
                placeholderText="Select a date"
                dateFormat="yyyy-MM-dd"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                popperClassName="z-50"
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
                onChange={(e) => onGuestsChange(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
          </div>
<div className="flex justify-center">
          <button
            type="submit"
            className="mt-3 inline-flex items-center justify-center rounded-xl bg-[#D9A299] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-pink-700 transition"
          >
            Submit event request
          </button>
      </div>
        </form>
      </div>
    </section>
  );
}
