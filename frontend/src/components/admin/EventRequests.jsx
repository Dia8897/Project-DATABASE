import React, { useState, useMemo } from "react";
import { CheckCircle, XCircle, Calendar, MapPin, Users, Clock } from "lucide-react";

export default function EventRequests() {
  const [activeFilter, setActiveFilter] = useState("all");

  // Sample event requests data
  const eventRequests = [
    {
      requestId: 1,
      title: "Luxury Wedding Reception",
      type: "Wedding",
      category: "Luxury",
      clientName: "Sarah & Michael Thompson",
      clientEmail: "sarah.thompson@email.com",
      clientPhone: "+961 71 234 567",
      date: "2026-05-20",
      location: "Le Royal Hotel, Beirut",
      nbOfHosts: 12,
      dressCode: "Black Tie",
      description: "Elegant outdoor wedding reception with 200 guests. Need professional hosts for guest coordination, cocktail service, and event flow management.",
      budget: "$15,000",
      status: "Pending",
      submittedDate: "2025-11-20",
    },
    {
      requestId: 2,
      title: "Corporate Product Launch",
      type: "Corporate Event",
      category: "Corporate",
      clientName: "TechCorp Lebanon",
      clientEmail: "events@techcorp.lb",
      clientPhone: "+961 3 456 789",
      date: "2026-02-15",
      location: "BIEL Convention Center",
      nbOfHosts: 20,
      dressCode: "Business Casual",
      description: "Tech company launching new product with demo stations, VIP area, and media coverage. Need hosts for registration, demo assistance, and crowd management.",
      budget: "$25,000",
      status: "Pending",
      submittedDate: "2025-11-22",
    },
    {
      requestId: 3,
      title: "Charity Gala Dinner",
      type: "Gala",
      category: "Luxury",
      clientName: "Hope Foundation",
      clientEmail: "contact@hopefoundation.org",
      clientPhone: "+961 70 987 654",
      date: "2026-03-10",
      location: "Four Seasons Hotel",
      nbOfHosts: 15,
      dressCode: "Formal Evening Wear",
      description: "Annual charity gala with auction, entertainment, and VIP guests. Hosts needed for guest welcome, auction management, and table service.",
      budget: "$18,000",
      status: "Pending",
      submittedDate: "2025-11-23",
    },
    {
      requestId: 4,
      title: "Birthday Party Celebration",
      type: "Birthday",
      category: "Personal",
      clientName: "Nadia Khouri",
      clientEmail: "nadia.khouri@email.com",
      clientPhone: "+961 76 543 210",
      date: "2026-01-30",
      location: "Private Villa, Jounieh",
      nbOfHosts: 6,
      dressCode: "Smart Casual",
      description: "50th birthday party with 80 guests. Need hosts for guest coordination, food service, and entertainment support.",
      budget: "$8,000",
      status: "Approved",
      submittedDate: "2025-11-15",
    },
    {
      requestId: 5,
      title: "Music Festival",
      type: "Festival",
      category: "Outdoor",
      clientName: "Beirut Events Co.",
      clientEmail: "info@beirutevents.com",
      clientPhone: "+961 3 111 222",
      date: "2026-04-05",
      location: "Beirut Waterfront",
      nbOfHosts: 30,
      dressCode: "Casual/Branded T-shirts",
      description: "Two-day music festival with multiple stages. Need hosts for entry management, VIP area, artist liaison, and crowd control.",
      budget: "$40,000",
      status: "Pending",
      submittedDate: "2025-11-24",
    },
    {
      requestId: 6,
      title: "Fashion Show",
      type: "Fashion Event",
      category: "Luxury",
      clientName: "Elite Fashion House",
      clientEmail: "booking@elitefashion.lb",
      clientPhone: "+961 1 999 888",
      date: "2026-03-25",
      location: "ABC Mall - Upper Level",
      nbOfHosts: 18,
      dressCode: "All Black Chic",
      description: "Spring collection runway show with backstage coordination, front row seating, and after-party management.",
      budget: "$22,000",
      status: "Rejected",
      submittedDate: "2025-11-18",
    },
    {
      requestId: 7,
      title: "Corporate Team Building",
      type: "Corporate Event",
      category: "Corporate",
      clientName: "Global Solutions Inc.",
      clientEmail: "hr@globalsolutions.com",
      clientPhone: "+961 70 444 555",
      date: "2026-02-28",
      location: "Faraya Mountain Resort",
      nbOfHosts: 10,
      dressCode: "Outdoor Casual",
      description: "Full-day team building activities for 150 employees. Hosts needed for activity coordination, registration, and logistics support.",
      budget: "$12,000",
      status: "Pending",
      submittedDate: "2025-11-25",
    },
    {
      requestId: 8,
      title: "Art Gallery Opening",
      type: "Cultural Event",
      category: "Luxury",
      clientName: "Beirut Contemporary Art Gallery",
      clientEmail: "info@bcag.lb",
      clientPhone: "+961 1 777 666",
      date: "2026-02-08",
      location: "Gemmayzeh Art District",
      nbOfHosts: 8,
      dressCode: "Smart Casual/Artistic",
      description: "Exclusive art exhibition opening with collectors and media. Need hosts for guest welcome, artwork information, and champagne service.",
      budget: "$9,000",
      status: "Approved",
      submittedDate: "2025-11-17",
    },
  ];

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(eventRequests.map((req) => req.category).filter(Boolean))
    );
    return ["all", ...unique];
  }, [eventRequests]);

  const filteredRequests = useMemo(() => {
    if (activeFilter === "all") return eventRequests;
    return eventRequests.filter((req) => req.category === activeFilter);
  }, [activeFilter, eventRequests]);

  const pendingRequests = eventRequests.filter(req => req.status === "Pending");

  const handleApprove = (requestId) => {
    console.log(`Approved request: ${requestId}`);
    // In production: API call to approve event request
  };

  const handleReject = (requestId) => {
    console.log(`Rejected request: ${requestId}`);
    // In production: API call to reject event request
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Approved":
        return "text-green-600 bg-green-50 border-green-200";
      case "Rejected":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="space-y-8">
      {/* Filter Section */}
      <section className="px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-ocean font-semibold">
              Filter requests
            </p>
            <h3 className="text-lg font-semibold text-gray-900">
              Browse by category
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
                {cat === "all" ? "All Requests" : cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Event Requests Grid */}
      <section className="px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center text-gray-500">
              No event requests match this filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredRequests.map((request) => (
                <article
                  key={request.requestId}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition p-6 space-y-4"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-ocean font-semibold mb-2">
                        <span>{request.category}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {request.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{request.type}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>
                  </div>

                  {/* Client Info */}
                  <div className="bg-cream rounded-xl p-4 space-y-2">
                    <p className="text-sm font-semibold text-gray-700">
                      Client: {request.clientName}
                    </p>
                    <p className="text-sm text-gray-600">{request.clientEmail}</p>
                    <p className="text-sm text-gray-600">{request.clientPhone}</p>
                  </div>

                  {/* Event Details */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar size={16} className="text-ocean" />
                      <span className="font-medium">{request.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <MapPin size={16} className="text-ocean" />
                      <span>{request.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Users size={16} className="text-ocean" />
                      <span>{request.nbOfHosts} hosts needed</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Clock size={16} className="text-ocean" />
                      <span>Submitted: {request.submittedDate}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {request.description}
                  </p>

                  {/* Additional Info */}
                  <div className="flex items-center justify-between text-xs uppercase tracking-wide text-gray-500 pt-2 border-t border-gray-100">
                    <span>Dress: {request.dressCode}</span>
                    <span className="font-semibold text-ocean">
                      Budget: {request.budget}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  {request.status === "Pending" && (
                    <div className="flex gap-3 pt-3">
                      <button
                        onClick={() => handleApprove(request.requestId)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition"
                      >
                        <CheckCircle size={18} />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(request.requestId)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition"
                      >
                        <XCircle size={18} />
                        Reject
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
