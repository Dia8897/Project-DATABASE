import React from "react";
import { Calendar, MapPin, Users } from "lucide-react";

export default function EventsSection({ events = [], onViewDetails }) {
    return (
        <section className="flex  py-16 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold text-center mb-10 text-indigo-700">
                    Available Events
                </h2>

                {/* Grid of Event Cards */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-[5rem]">

                    {events.map((event, index) => (
                        <div key={index}>
                            <div className="bg-white shadow-lg rounded-xl p-8 lg:min-w-[400px] border hover:shadow-xl hover:scale-105 transition-transform duration-200">

                                <h3 className="text-xl font-bold text-gray-800 mb-3">
                                    {event.title}
                                </h3>

                                {/* Date */}
                                <div className="flex items-center text-gray-600 mb-2">
                                    <Calendar size={18} className="mr-2 text-indigo-600" />
                                    <span>{event.date}</span>
                                </div>

                                {/* Location */}
                                <div className="flex items-center text-gray-600 mb-2">
                                    <MapPin size={18} className="mr-2 text-red-500" />
                                    <span>{event.location}</span>
                                </div>

                                {/* Hosts */}
                                <div className="flex items-center text-gray-600 mb-4">
                                    <Users size={18} className="mr-2 text-green-600" />
                                    <span>
                                        {event.hostsAdmitted} / {event.hostsRequested} hosts filled
                                    </span>
                                </div>

                                {/* BUTTON */}
                                <button
                                    className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
                                    onClick={() => onViewDetails(event)}
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
