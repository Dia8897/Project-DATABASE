import React from "react";

// EventCard.jsx
// A simple, testable React component for the frontend folder.
// TailwindCSS utility classes are used for styling.

export default function EventCard({
    event = {},
    onApply = () => { },
    onRequestDress = () => { },
}) {
    const {
        title = "Untitled Event",
        date = "Date TBA",
        location = "Location TBA",
        dress = "Not specified",
        hostsAdmitted = 0,
        hostsRequested = 0,
        image = null,
        shortDescription = "No description provided.",
    } = event;

    return (
        <article className="max-w-md rounded-2xl shadow-md overflow-hidden bg-white">
            {image ? (
                <img src={image} alt={title} className="w-full h-44 object-cover" />
            ) : (
                <div className="w-full h-44 bg-gray-100 flex items-center justify-center text-gray-400">
                    No image
                </div>
            )}

            <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                <p className="mt-1 text-sm text-gray-600">{shortDescription}</p>

                <div className="mt-3 text-sm text-gray-700 grid grid-cols-2 gap-2">
                    <div>
                        <div className="text-xs text-gray-500">Date</div>
                        <div className="font-medium">{date}</div>
                    </div>

                    <div>
                        <div className="text-xs text-gray-500">Location</div>
                        <div className="font-medium">{location}</div>
                    </div>

                    <div>
                        <div className="text-xs text-gray-500">Dress</div>
                        <div className="font-medium">{dress}</div>
                    </div>

                    <div>
                        <div className="text-xs text-gray-500">Hosts</div>
                        <div className="font-medium">{hostsAdmitted} / {hostsRequested}</div>
                    </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                    <button
                        onClick={() => onApply(event)}
                        className="flex-1 py-2 px-4 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                        aria-label={`Apply for ${title}`}
                    >
                        Apply
                    </button>

                    <button
                        onClick={() => onRequestDress(event)}
                        className="py-2 px-3 rounded-lg border border-gray-200 text-gray-700 text-sm hover:bg-gray-50 transition"
                        aria-label={`Request dress for ${title}`}
                    >
                        Request Dress
                    </button>
                </div>
            </div>
        </article>
    );
}

// Usage example (for quick manual test):
//
// import EventCard from "./EventCard";
//
// const sampleEvent = {
//   title: "Gala Night - Charity",
//   date: "2026-01-15",
//   location: "Ritz Ballroom",
//   dress: "Black Tie",
//   hostsAdmitted: 12,
//   hostsRequested: 20,
//   shortDescription: "A charity gala with VIP guests.",
//   image: "/images/gala.jpg",
//};
//
// <EventCard
//   event={sampleEvent}
//   onApply={(e) => console.log("apply clicked", e.title)}
//   onRequestDress={(e) => console.log("dress requested for", e.title)}
///>
