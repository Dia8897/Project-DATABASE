import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle, XCircle, Calendar, MapPin, Users, Clock, Eye, Mail, Phone, User, X } from "lucide-react";
import api from "../../services/api";

const CLIENT_FIELDS = ["clientFirstName", "clientLastName", "clientEmail", "clientPhone"];

const formatDate = (value) => {
  if (!value) return "TBA";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const toTitleCase = (value = "") =>
  value
    .split(/[\s_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ") || "General";

const normalizeRequest = (request) => {
  const clientName = [request.clientFirstName, request.clientLastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    id: request.eventId,
    title: request.title || "Untitled Event",
    type: request.type || "Event",
    category: toTitleCase(request.type),
    clientName: clientName || "Client details pending",
    clientEmail: request.clientEmail || "Not provided",
    clientPhone: request.clientPhone || "Not provided",
    date: formatDate(request.startsAt),
    location: request.location || "Location TBA",
    nbOfHosts: request.nbOfHosts || 0,
    dressCode: request.dressCode || "Not specified",
    description: request.description || "No description provided.",
    status: toTitleCase(request.status || "pending"),
    submittedDate: formatDate(request.createdAt),
  };
};

const needsClientHydration = (request = {}) =>
  request.clientId && CLIENT_FIELDS.some((field) => !request[field]);

const hydrateRequests = async (rawRequests) => {
  const normalized = rawRequests.map(normalizeRequest);
  const clientIds = Array.from(
    new Set(rawRequests.filter(needsClientHydration).map((req) => req.clientId))
  );

  if (!clientIds.length) {
    return normalized;
  }

  const clientResults = await Promise.allSettled(
    clientIds.map((clientId) => api.get(`/clients/${clientId}`))
  );

  const clientMap = new Map();
  clientResults.forEach((result, index) => {
    if (result.status === "fulfilled" && result.value?.data) {
      clientMap.set(clientIds[index], result.value.data);
    }
  });

  if (!clientMap.size) {
    return normalized;
  }

  return normalized.map((request, index) => {
    const raw = rawRequests[index];
    const client = clientMap.get(raw.clientId);

    if (!client) return request;

    const hydratedName = [client.fName, client.lName].filter(Boolean).join(" ").trim();

    return {
      ...request,
      clientName: hydratedName || request.clientName,
      clientEmail: client.email || request.clientEmail,
      clientPhone: client.phoneNb || request.clientPhone,
    };
  });
};

export default function EventRequests() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailModal, setDetailModal] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get("/admins/event-requests");
        if (!cancelled) {
          const hydrated = await hydrateRequests(data);
          setRequests(hydrated);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || "Failed to load event requests");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchRequests();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(requests.map((req) => req.category).filter(Boolean)));
    return ["all", ...unique];
  }, [requests]);

  const filteredRequests = useMemo(() => {
    if (activeFilter === "all") return requests;
    return requests.filter((req) => req.category === activeFilter);
  }, [activeFilter, requests]);

  const updateRequestStatus = (requestId, newStatus) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status: newStatus } : req))
    );
  };

  const handleApprove = async (requestId) => {
    try {
      await api.put(`/events/${requestId}`, { status: "accepted" });
      updateRequestStatus(requestId, "Accepted");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to approve event");
    }
  };

  const handleReject = async (requestId) => {
    try {
      await api.put(`/events/${requestId}`, { status: "rejected" });
      updateRequestStatus(requestId, "Rejected");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reject event");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Accepted":
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

      <section className="px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center text-gray-500">
              Loading event requests...
            </div>
          ) : error ? (
            <div className="bg-white rounded-3xl border border-red-100 p-12 text-center text-red-600">
              {error}
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center text-gray-500">
              No event requests match this filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredRequests.map((request) => {
                const isPending = request.status === "Pending";
                return (
                  <article
                    key={request.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition p-6 space-y-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-ocean font-semibold mb-2">
                          <Calendar size={14} />
                          <span>{request.category}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{request.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">Requested on {request.submittedDate}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {request.status}
                      </span>
                    </div>

                    <div className="bg-cream rounded-2xl p-4 space-y-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <User size={16} className="text-ocean" />
                        <span>Client</span>
                      </div>
                      <p className="text-base font-semibold text-gray-900">{request.clientName}</p>
                      <div className="flex flex-col gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-ocean" />
                          <span>{request.clientEmail}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-ocean" />
                          <span>{request.clientPhone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-ocean" />
                        <span>{request.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-ocean" />
                        <span>{request.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-ocean" />
                        <span>{request.nbOfHosts} hosts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-ocean" />
                        <span>Type: {request.type}</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed">{request.description}</p>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setDetailModal(request)}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-gray-700 font-semibold hover:border-ocean hover:text-ocean transition"
                      >
                        <Eye size={18} />
                        View Details
                      </button>
                      <div className="flex flex-1 gap-3">
                        <button
                          type="button"
                          disabled={!isPending}
                          onClick={() => handleReject(request.id)}
                          className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full font-semibold transition ${
                            isPending
                              ? "text-red-600 border border-red-200 hover:bg-red-50"
                              : "text-gray-400 border border-gray-100 bg-gray-50 cursor-not-allowed"
                          }`}
                        >
                          <XCircle size={18} />
                          Reject
                        </button>
                        <button
                          type="button"
                          disabled={!isPending}
                          onClick={() => handleApprove(request.id)}
                          className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full font-semibold transition ${
                            isPending
                              ? "text-white bg-ocean hover:bg-ocean/90"
                              : "text-gray-400 bg-gray-100 cursor-not-allowed"
                          }`}
                        >
                          <CheckCircle size={18} />
                          Approve
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {detailModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full relative p-6 space-y-5">
            <button
              type="button"
              onClick={() => setDetailModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-2xl bg-cream flex items-center justify-center text-ocean">
                <Calendar size={28} />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-ocean font-semibold">
                  {detailModal.category}
                </p>
                <h3 className="text-2xl font-bold text-gray-900">{detailModal.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {detailModal.type} • {detailModal.date}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-gray-100 p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <MapPin size={16} className="text-ocean" />
                  <span>Location</span>
                </div>
                <p className="text-sm text-gray-600">{detailModal.location}</p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users size={16} className="text-ocean" />
                  <span>{detailModal.nbOfHosts} hosts requested</span>
                </div>
              </div>
              <div className="rounded-2xl border border-gray-100 p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <User size={16} className="text-ocean" />
                  <span>Client</span>
                </div>
                <p className="text-base font-semibold text-gray-900">{detailModal.clientName}</p>
                <div className="flex flex-col gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-ocean" />
                    <span>{detailModal.clientEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-ocean" />
                    <span>{detailModal.clientPhone}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 p-4 space-y-3">
              <p className="text-sm font-semibold text-gray-700">Event Brief</p>
              <p className="text-sm text-gray-600 leading-relaxed">{detailModal.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
