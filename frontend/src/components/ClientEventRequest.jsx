import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ClientEventRequest({
  occasions,
  eventType,
  eventDate,
  guests,
  onTypeChange,
  onDateChange,
  onGuestsChange,
  onSubmit,
}) {
  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky to-mist px-8 py-6 border-b border-gray-100">
        <p className="text-xs uppercase tracking-[0.3em] text-ocean font-semibold">
          Create Request
        </p>
        <h2 className="text-2xl font-bold text-gray-900 mt-1">
          What is Your Occasion?
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Select any occasion from the list below
        </p>
      </div>

      <div className="p-8">
        {/* Icons Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {occasions.map((o) => (
            <label
              key={o.id}
              className={`flex flex-col items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all border-2 ${
                eventType === o.label
                  ? "border-ocean bg-sky shadow-md"
                  : "border-gray-100 bg-cream hover:border-gray-200 hover:bg-mist"
              }`}
            >
              <img
                src={o.icon}
                alt={o.label}
                className="w-16 h-16 object-contain"
              />
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="eventType"
                  value={o.label}
                  checked={eventType === o.label}
                  onChange={() => onTypeChange(o.label)}
                  className="accent-indigo-600"
                />
                <span className={`text-sm font-medium ${
                  eventType === o.label ? "text-ocean" : "text-gray-700"
                }`}>
                  {o.label}
                </span>
              </div>
            </label>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="mt-8">
          <div className="bg-cream rounded-2xl p-6 border border-gray-100">
            <div className="grid md:grid-cols-3 gap-6 items-end">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Event Date
                </label>
                <DatePicker
                  selected={eventDate}
                  onChange={(date) => onDateChange(date)}
                  placeholderText="Select a date"
                  dateFormat="yyyy-MM-dd"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ocean focus:border-ocean bg-white"
                  popperClassName="z-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Number of Guests
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 120"
                  value={guests}
                  onChange={(e) => onGuestsChange(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ocean focus:border-ocean bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 rounded-xl bg-ocean text-white text-sm font-semibold shadow-md hover:bg-ocean/90 transition flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Submit Request
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
