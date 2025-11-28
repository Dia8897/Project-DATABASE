import React from "react";

const DetailRow = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="flex justify-between text-sm text-gray-600">
      <span className="font-medium text-gray-800">{label}</span>
      <span>{value}</span>
    </div>
  );
};

export default function EventDetailsModal({
  event,
  onClose,
  onApply,
}) {
  if (!event) return null;

  const filled = event.acceptedHostsCount ?? 0;
  const requested = event.nbOfHosts ?? 0;
  const coverage =
    requested > 0 ? Math.round((filled / requested) * 100) : null;

  const info = [
    { label: "Date", value: event.date || "TBA" },
    { label: "Location", value: event.location || "TBA" },
    { label: "Dress code", value: event.dressCode || "Not specified" },
    { label: "Hosts requested", value: `${filled} / ${requested || "?"}` },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {event.imageUrl && (
          <div className="h-60 w-full overflow-hidden rounded-t-3xl">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-ocean font-semibold mb-2">
                Event overview
              </p>
              <h2 className="text-3xl font-bold text-gray-900">
                {event.title}
              </h2>
              {event.type && (
                <p className="text-sm text-gray-500 mt-1">{event.type}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              {coverage !== null && (
                <span className="px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold">
                  {coverage}% staffed
                </span>
              )}
              {event.rate && (
                <span className="px-4 py-2 rounded-full bg-sky text-ocean text-sm font-semibold">
                  ★ {event.rate} rating
                </span>
              )}
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed">
            {event.description || event.shortDescription || "More details coming soon."}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-cream rounded-2xl p-4">
            {info.map(({ label, value }) => (
              <DetailRow key={label} label={label} value={value} />
            ))}
          </div>

          {event.requirements?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Requirements
              </h3>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {event.requirements.map((req) => (
                  <li key={req}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-cream"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => onApply?.(event)}
              className="px-6 py-2 rounded-lg bg-ocean text-white text-sm font-semibold hover:bg-ocean/80"
            >
              Apply to this event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
