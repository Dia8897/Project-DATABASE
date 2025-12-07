import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AcceptedHosts from "../components/teamleader/AcceptedHosts";
import EventPlanSeating from "../components/teamleader/EventPlanSeating";
import EventRating from "../components/teamleader/EventRating";
import { Calendar, MapPin, Users, Clock, Building2 } from "lucide-react";
import api from "../services/api";

const formatDate = (value) => {
  if (!value) return "TBA";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTimeRange = (start, end) => {
  if (!start || !end) return "Time TBA";
  const s = new Date(start);
  const e = new Date(end);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) {
    return "Time TBA";
  }
  const opts = { hour: "2-digit", minute: "2-digit" };
  return `${s.toLocaleTimeString([], opts)} - ${e.toLocaleTimeString([], opts)}`;
};

const formatDateTime = (value) => {
  if (!value) return "TBA";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "TBA";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const addMinutes = (isoString, minutes) => {
  if (!isoString) return null;
  const base = new Date(isoString);
  if (Number.isNaN(base.getTime())) return null;
  return new Date(base.getTime() + minutes * 60000);
};

const buildEventPlan = (event, hostList) => {
  if (!event?.startsAt || !event?.endsAt) return null;

  const start = new Date(event.startsAt);
  const end = new Date(event.endsAt);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return null;
  }

  const formatTimeOnly = (dateObj) =>
    dateObj ? dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "TBA";

  const venueLabel = event.venue || event.location || "Venue TBA";
  const schedule = [
    {
      time: formatTimeOnly(addMinutes(event.startsAt, -120)),
      activity: "Team arrival & uniform check",
      location: venueLabel,
    },
    {
      time: formatTimeOnly(addMinutes(event.startsAt, -90)),
      activity: "Briefing with client / admin",
      location: venueLabel,
    },
    {
      time: formatTimeOnly(start),
      activity: "Guest arrival & welcome",
      location: event.location || "Main entrance",
    },
    {
      time: formatTimeOnly(addMinutes(start.toISOString(), 90)),
      activity: "Peak guest support",
      location: "Assigned zones",
    },
    {
      time: formatTimeOnly(end),
      activity: "Closing & farewell",
      location: venueLabel,
    },
    {
      time: formatTimeOnly(addMinutes(event.endsAt, 30)),
      activity: "Debrief & wrap-up",
      location: venueLabel,
    },
  ].filter((item) => item.time !== "TBA");

  const zoneTemplates = [
    {
      name: "Entrance & Registration",
      duties: "Welcome guests, manage guest list, coordinate arrivals with security.",
    },
    {
      name: "VIP & Client Liaison",
      duties: "Escort VIP guests, ensure client requests are handled promptly.",
    },
    {
      name: "Main Floor Support",
      duties: "Monitor crowd flow, support host rotation, communicate updates to TL.",
    },
  ];

  const assignedZones = zoneTemplates.map((zone) => ({ ...zone, hosts: [] }));
  hostList.forEach((host, index) => {
    const targetZone = assignedZones[index % assignedZones.length];
    targetZone.hosts.push(host.name || `Host ${index + 1}`);
  });

  const seatingCapacity = Math.max(80, (event.nbOfHosts || hostList.length || 1) * 12);
  const tableCount = Math.max(6, Math.ceil(seatingCapacity / 8));

  return {
    schedule,
    zones: assignedZones,
    seatingCapacity,
    tableCount,
    notes: `Ensure all zones check in with you every 30 minutes. ${
      event.dressCode ? `Dress code: ${event.dressCode}.` : ""
    }`,
  };
};

export default function TeamLeaderEventPage() {
  const { eventId } = useParams();
  const [activeTab, setActiveTab] = useState("hosts");
  const [eventData, setEventData] = useState(null);
  const [client, setClient] = useState(null);
  const [hosts, setHosts] = useState([]);
  const [transportation, setTransportation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendance, setAttendance] = useState({});

  const attendanceStorageKey = useMemo(
    () => (eventId ? `team-event-${eventId}-attendance` : null),
    [eventId]
  );

  useEffect(() => {
    if (!eventId) {
      setError("No event selected.");
      setLoading(false);
      return;
    }

    const fetchOverview = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get(`/events/${eventId}/team-view`);
        setEventData(data.event);
        setClient(data.client);
        setHosts(
          data.hosts.map((host) => ({
            ...host,
            languages: host.languages ?? [],
            rating: host.rating ?? null,
          }))
        );
        setTransportation(data.transportation || []);
      } catch (err) {
        const message = err.response?.data?.message || "Failed to load event overview";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [eventId]);

  useEffect(() => {
    if (!attendanceStorageKey || typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(attendanceStorageKey);
      if (stored) {
        setAttendance(JSON.parse(stored));
      }
    } catch (err) {
      console.warn("Failed to parse stored attendance", err);
    }
  }, [attendanceStorageKey]);

  useEffect(() => {
    if (!attendanceStorageKey || hosts.length === 0 || typeof window === "undefined") return;
    setAttendance((prev) => {
      const validIds = new Set(hosts.map((h) => String(h.userId)));
      const filteredEntries = Object.entries(prev).filter(([id]) => validIds.has(String(id)));
      const filtered = Object.fromEntries(filteredEntries);
      window.localStorage.setItem(attendanceStorageKey, JSON.stringify(filtered));
      return filtered;
    });
  }, [hosts, attendanceStorageKey]);

  const handleToggleAttendance = useCallback(
    (hostId) => {
      if (!attendanceStorageKey || typeof window === "undefined") return;
      setAttendance((prev) => {
        const key = String(hostId);
        const next = { ...prev, [key]: !prev[key] };
        window.localStorage.setItem(attendanceStorageKey, JSON.stringify(next));
        return next;
      });
    },
    [attendanceStorageKey]
  );

  const tabs = useMemo(
    () => [
      { id: "hosts", label: "Team Members", count: hosts.length },
      { id: "plan", label: "Event Plan & Seating", count: null },
      { id: "rating", label: "Rate Event", count: null },
    ],
    [hosts.length]
  );
  const planData = useMemo(() => buildEventPlan(eventData, hosts), [eventData, hosts]);

  if (loading) {
    return (
      <main className="bg-pearl min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading event overview...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-pearl min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center border border-gray-100 max-w-md">
          <p className="text-gray-700 font-semibold mb-2">Unable to load event</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </main>
    );
  }

  if (!eventData) {
    return null;
  }

  const formattedDate = formatDate(eventData.startsAt);
  const formattedTime = formatTimeRange(eventData.startsAt, eventData.endsAt);

  return (
    <main className="bg-pearl min-h-screen">
      <Navbar />

      <div className="pt-24 space-y-6">
        <section className="px-4">
          <div className="max-w-6xl mx-auto bg-white rounded-[3rem] p-8 md:p-10 shadow-xl border border-gray-100">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  {eventData.type && (
                    <span className="px-3 py-1 rounded-full bg-sky text-ocean text-xs font-semibold uppercase">
                      {eventData.type}
                    </span>
                  )}
                  <span className="px-3 py-1 rounded-full bg-mint/30 text-green-700 text-xs font-semibold">
                    Team Leader View
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {eventData.title}
                </h1>

                <p className="text-gray-600">{eventData.description || "Event details will appear here."}</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={18} className="text-ocean" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={18} className="text-ocean" />
                    <span>{formattedTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={18} className="text-ocean" />
                    <span>{eventData.location || "Location TBA"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users size={18} className="text-ocean" />
                    <span>
                      {hosts.length}/{eventData.nbOfHosts ?? "?"} hosts
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:w-80 bg-cream rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-sky flex items-center justify-center">
                    <Building2 size={24} className="text-ocean" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Client</p>
                    <p className="font-bold text-gray-900">{client?.name || "Undisclosed"}</p>
                  </div>
                </div>
                {client ? (
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-700">Email:</span> {client.email || "—"}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-700">Phone:</span> {client.phone || "—"}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-700">Address:</span> {client.address || "—"}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Client details will appear here once assigned.</p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4">
          <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-ocean font-semibold">
                Management panel
              </p>
              <h3 className="text-lg font-semibold text-gray-900">
                Coordinate hosts and review event data
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    activeTab === tab.id
                      ? "bg-ocean text-white"
                      : "bg-cream text-gray-700 hover:bg-mist"
                  }`}
                >
                  {tab.label}
                  {typeof tab.count === "number" && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-white/20">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {transportation.length > 0 && (
          <section className="px-4">
            <div className="max-w-6xl mx-auto space-y-4">
              <div className="bg-white rounded-3xl shadow p-6 border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-ocean font-semibold">
                      Logistics
                    </p>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Transportation schedule
                    </h3>
                  </div>
                  <span className="px-4 py-2 rounded-full bg-mint/30 text-green-700 text-sm font-semibold">
                    {transportation.length} Trip{transportation.length > 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {transportation.map((trip) => (
                  <article
                    key={trip.transportationId}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                          Pickup Location
                        </p>
                        <p className="text-base font-bold text-gray-900">{trip.pickupLocation}</p>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-cream text-gray-700 text-xs font-semibold">
                        Capacity {trip.vehicleCapacity}
                      </div>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-ocean" />
                        <span>Departure: {formatDateTime(trip.departureTime)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-ocean" />
                        <span>Return: {formatDateTime(trip.returnTime)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-ocean" />
                        <span>{trip.vehicleCapacity} seats reserved</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 size={16} className="text-ocean" />
                        <span>Compensation: ${Number(trip.payment ?? 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="px-4 pb-16">
          <div className="max-w-6xl mx-auto">
            {activeTab === "hosts" && (
              <AcceptedHosts
                hosts={hosts}
                attendance={attendance}
                onToggleAttendance={handleToggleAttendance}
              />
            )}

            {activeTab === "plan" &&
              (planData ? (
                <EventPlanSeating plan={planData} />
              ) : (
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 text-center text-gray-600">
                  <p className="font-semibold text-gray-900 mb-2">Event plan unavailable</p>
                  <p className="text-sm">
                    We need confirmed start and end times to generate a timeline. Once the event
                    dates are finalized, the plan will appear automatically.
                  </p>
                </div>
              ))}

            {activeTab === "rating" && <EventRating event={eventData} />}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
