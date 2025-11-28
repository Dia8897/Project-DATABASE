// src/Pages/EventsPage.js
import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ApplyModal from "../components/ApplyModal";
import EventDetailsModal from "../components/EventDetailsModal";

const DEMO_EVENTS = [
  {
    eventId: 1,
    title: "Gala Night",
    type: "Black-tie Gala",
    category: "Luxury",
    badge: "VIP",
    date: "2026-01-15",
    location: "Ritz Ballroom",
    nbOfHosts: 20,
    acceptedHostsCount: 12,
    dressCode: "Black Tie",
    shortDescription: "Charity gala with high-profile guests and silent auction.",
    description:
      "Elegant evening with VIPs from the fashion and finance industries. Hosts will handle guest check-in, silent auction tables, and premium lounge service.",
    requirements: ["Fluent English + French", "Previous luxury event experience"],
    imageUrl: "/images/gala.jpg",
    rate: 4.9,
  },
  {
    eventId: 2,
    title: "Corporate Conference",
    type: "Enterprise Conference",
    category: "Corporate",
    badge: "Weekday",
    date: "2026-02-01",
    location: "Downtown Convention Center",
    nbOfHosts: 15,
    acceptedHostsCount: 8,
    dressCode: "Business Formal",
    shortDescription: "Full-day conference with keynote, breakout rooms, and sponsor booths.",
    description:
      "Tech enterprise summit with 1,200 attendees. Hosts support registration, badge printing, speaker escort, and VIP lounge management.",
    requirements: ["Comfortable with tablets / lead capture apps"],
    imageUrl: "/images/conference.jpg",
    rate: 4.7,
  },
  {
    eventId: 3,
    title: "Outdoor Festival",
    type: "Food & Music Festival",
    category: "Outdoor",
    badge: "Weekend",
    date: "2026-03-10",
    location: "City Park",
    nbOfHosts: 25,
    acceptedHostsCount: 5,
    dressCode: "Casual / Comfortable",
    shortDescription: "Outdoor music, street food market, and sponsor activations.",
    description:
      "High-energy street festival needing roaming ambassadors for sponsor booths, VIP deck, and main gate crowd flow.",
    requirements: ["Comfortable standing 6+ hours", "Outgoing personality"],
    imageUrl: "/images/festival.jpg",
    rate: 4.6,
  },
  {
    eventId: 4,
    title: "Tech Product Launch",
    type: "Launch Event",
    category: "Corporate",
    badge: "New",
    date: "2026-02-18",
    location: "Atelier 9 Studio",
    nbOfHosts: 18,
    acceptedHostsCount: 6,
    dressCode: "Smart Casual",
    shortDescription: "Immersive product reveal with interactive demo stations.",
    description:
      "Hosts guide invitees through experience rooms, manage NDAs, and support live streaming teams.",
    requirements: ["Comfort with scripted demos", "NDA compliance"],
    imageUrl: "/images/productlaunch.jpg",
    rate: 4.8,
  },
  {
    eventId: 5,
    title: "Fashion Week Showcase",
    type: "Runway Show",
    category: "Luxury",
    badge: "Backstage",
    date: "2026-01-28",
    location: "Warehouse District Studio 5",
    nbOfHosts: 14,
    acceptedHostsCount: 4,
    dressCode: "All Black Chic",
    shortDescription: "Designer runway with backstage coordination and front-row management.",
    description:
      "Support backstage lineup, seat influencers, coordinate brand gift lounge, and manage photo op flow.",
    requirements: ["Calm under pressure", "Backstage experience is a plus"],
    imageUrl: "/images/fashion.jpg",
    rate: 5.0,
  },
  {
    eventId: 6,
    title: "Training Bootcamp",
    type: "Internal Training",
    category: "Training",
    badge: "Paid Training",
    date: "2026-01-08",
    location: "Agency HQ Loft",
    nbOfHosts: 30,
    acceptedHostsCount: 20,
    dressCode: "Smart Casual",
    shortDescription: "Half-day onboarding bootcamp for new and approved hosts.",
    description:
      "Brush up hospitality protocols, technology stack, and emergency procedures. Counts toward senior eligibility.",
    requirements: ["Approved hosts only", "Bring laptop or tablet"],
    imageUrl: "/images/training.jpg",
    rate: 4.5,
  },
];

export default function EventsPage() {
  const testEvents = DEMO_EVENTS;

  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [detailsEvent, setDetailsEvent] = useState(null);
  const [lastApplication, setLastApplication] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const loggedInUser = {
    userId: 42,
    fName: "Lina",
    lName: "Saliba",
    email: "lina.saliba@example.com",
    phoneNb: "+961 70 123 456",
    gender: "F",
    age: 26,
    address: "Beirut Downtown, Biel",
    clothingSize: "S",
    eligibility: "approved",
    yearsOfExperience: 4,
    description:
      "VIP hostess with corporate and luxury retail experience, bilingual ENG/FR",
    spokenLanguages: ["English", "French", "Arabic"],
  };

  const sortedEvents = useMemo(
    () =>
      [...testEvents].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
    [testEvents]
  );

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(testEvents.map((event) => event.category).filter(Boolean))
    );
    return ["all", ...unique];
  }, [testEvents]);

  const filteredEvents = useMemo(() => {
    if (activeFilter === "all") return testEvents;
    return testEvents.filter((event) => event.category === activeFilter);
  }, [activeFilter, testEvents]);

  const stats = useMemo(() => {
    const luxury = testEvents.filter((event) => event.category === "Luxury").length;
    const corporate = testEvents.filter((event) => event.category === "Corporate").length;
    const training = testEvents.filter((event) => event.category === "Training").length;
    return [
      { label: "Active events", value: testEvents.length },
      { label: "Luxury nights", value: luxury },
      { label: "Corporate days", value: corporate },
      { label: "Training seats", value: training * 10 + "+" },
    ];
  }, [testEvents]);

  const handleViewDetails = (event) => {
    setDetailsEvent(event);
    setIsDetailsOpen(true);
  };

  const handleApply = (event) => {
    setDetailsEvent(null);
    setIsDetailsOpen(false);
    setSelectedEvent(event);
    setIsApplyOpen(true);
  };

  const handleCloseModal = () => {
    setIsApplyOpen(false);
    setSelectedEvent(null);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setDetailsEvent(null);
  };

  const handleApplicationSubmitted = (payload) => {
    const fallbackTitle = payload?.eventTitle || selectedEvent?.title;
    setIsApplyOpen(false);
    setSelectedEvent(null);

    if (!payload) return;

    const applicantName = [payload.applicant?.firstName, payload.applicant?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();

    setLastApplication({
      id: Date.now(),
      eventTitle: fallbackTitle,
      requestedRole: payload.requestedRole,
      applicantName: applicantName || "Application",
    });
  };

  useEffect(() => {
    if (!lastApplication) return undefined;
    const timer = setTimeout(() => setLastApplication(null), 6000);
    return () => clearTimeout(timer);
  }, [lastApplication]);

  return (
    <main className="bg-pearl min-h-screen">
      <Navbar isLoggedIn={true} userType="host" />

      <div className="pt-24 space-y-12">
        <section className="px-4">
          <div className="max-w-6xl mx-auto bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="space-y-5 lg:w-2/3">
                <p className="text-xs uppercase tracking-[0.4em] text-ocean font-semibold">
                  Staffing Radar
                </p>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
                  Discover this month's curated client activations
                </h1>
                <p className="text-base text-gray-600 max-w-2xl">
                  Luxury brand launches, corporate assemblies, immersive festivals, and accelerated training sessions—updated daily by the agency team.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-gray-100 bg-pearl px-4 py-3 text-center"
                    >
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-[0.7rem] uppercase tracking-wide text-gray-500 mt-1">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              {sortedEvents[0] && (
                <div className="bg-sky text-gray-900 rounded-3xl p-6 w-full lg:w-auto shadow-inner border border-sky space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.4em] text-ocean font-semibold">
                      Spotlight
                    </p>
                    <span className="px-3 py-1 rounded-full bg-white text-sm font-semibold text-ocean">
                      {sortedEvents[0].badge}
                    </span>
                  </div>
                  <h2 className="text-2xl font-semibold">
                    {sortedEvents[0].title}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {sortedEvents[0].date} • {sortedEvents[0].location}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {sortedEvents[0].shortDescription}
                  </p>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => handleViewDetails(sortedEvents[0])}
                      className="flex-1 px-4 py-2 rounded-lg bg-white text-ocean text-sm font-semibold shadow border border-white hover:shadow-md"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleApply(sortedEvents[0])}
                      className="flex-1 px-4 py-2 rounded-lg bg-ocean text-white text-sm font-semibold hover:bg-ocean/80"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="px-4">
          <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-ocean font-semibold">
                Filter board
              </p>
              <h3 className="text-lg font-semibold text-gray-900">
                Explore by category
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    activeFilter === cat
                      ? "bg-ocean text-white"
                      : "bg-cream text-gray-700 hover:bg-mist"
                  }`}
                >
                  {cat === "all" ? "All" : cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-16">
          <div className="max-w-6xl mx-auto">
            {filteredEvents.length === 0 ? (
              <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center text-gray-500">
                No events match this filter yet — check back tomorrow or clear the filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredEvents.map((event) => (
                  <article
                    key={event.eventId}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4 items-stretch"
                  >
                    {event.imageUrl && (
                      <div className="w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0">
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-ocean font-semibold">
                        <span>{event.category}</span>
                        {event.badge && (
                          <span className="tracking-normal px-2 py-0.5 rounded-full bg-sky text-ocean">
                            {event.badge}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {event.date} • {event.location}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {event.shortDescription}
                      </p>
                      <div className="text-xs uppercase tracking-wide text-gray-500">
                        Dress: {event.dressCode || "Not set"} · Roles: {event.acceptedHostsCount}/{event.nbOfHosts || "?"}
                      </div>
                      <div className="flex gap-2 pt-1 mt-auto">
                        <button
                          onClick={() => handleViewDetails(event)}
                          className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-cream"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => handleApply(event)}
                          className="flex-1 px-3 py-2 rounded-xl bg-ocean text-white text-sm font-semibold hover:bg-ocean/80"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />

      {isApplyOpen && selectedEvent && (
        <ApplyModal
          event={selectedEvent}
          onClose={handleCloseModal}
          onSubmitted={handleApplicationSubmitted}
          currentUser={loggedInUser}
        />
      )}
      {isDetailsOpen && detailsEvent && (
        <EventDetailsModal
          event={detailsEvent}
          onClose={handleCloseDetails}
          onApply={handleApply}
        />
      )}

      {lastApplication && (
        <div className="fixed bottom-6 right-6 w-full max-w-sm bg-white border border-gray-200 rounded-2xl shadow-2xl p-4 flex items-start gap-3 transition-opacity">
          <div className="h-10 w-10 rounded-full bg-sky text-ocean flex items-center justify-center">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500">Application sent</p>
            <p className="text-base font-semibold text-gray-900">
              {lastApplication.applicantName} applied as{" "}
              {lastApplication.requestedRole === "team_leader" ? "Team Leader" : "Host"}
            </p>
            <p className="text-sm text-gray-600">
              {lastApplication.eventTitle || "Event details will sync soon"}
            </p>
          </div>
          <button
            aria-label="Close notification"
            onClick={() => setLastApplication(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            &times;
          </button>
        </div>
      )}
    </main>
  );
}
