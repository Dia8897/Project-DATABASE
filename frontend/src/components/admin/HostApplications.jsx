import React, { useEffect, useMemo, useState } from "react";
import { User, CheckCircle, XCircle, Mail, Phone, Award, Languages, Eye, X } from "lucide-react";
import api from "../../services/api";

const FALLBACK_DESCRIPTION = "No additional notes provided.";
const HYDRATION_FIELDS = ["applicantFirstName", "applicantLastName", "applicantEmail", "applicantPhone"];

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

const titleCase = (value = "") =>
  value
    .split(/[\s_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const normalizeApplication = (app) => {
  const firstName = app.applicantFirstName ?? app.fName;
  const lastName = app.applicantLastName ?? app.lName;
  const name = [firstName, lastName].filter(Boolean).join(" ").trim();

  return {
    id: app.eventAppId,
    userId: app.applicantUserId ?? app.senderId,
    name: name || `Applicant #${app.senderId}`,
    email: app.applicantEmail ?? app.email ?? "Email unavailable",
    phone: app.applicantPhone ?? app.phoneNb ?? "Phone unavailable",
    role: titleCase(app.requestedRole || "host"),
    status: titleCase(app.status || "pending"),
    clothingSize: app.applicantClothingSize ?? "N/A",
    appliedDate: formatDate(app.sentAt),
    description: app.notes || app.applicantDescription || FALLBACK_DESCRIPTION,
    requestedRole: app.requestedRole,
  };
};

const needsProfileHydration = (rawApp = {}) =>
  HYDRATION_FIELDS.some((field) => !rawApp[field]);

const hydrateApplications = async (rawApps) => {
  const normalized = rawApps.map(normalizeApplication);
  const userIdsToHydrate = Array.from(
    new Set(
      rawApps
        .filter((raw) => needsProfileHydration(raw) && raw.senderId)
        .map((raw) => raw.senderId)
    )
  );

  if (!userIdsToHydrate.length) {
    return normalized;
  }

  const profileResults = await Promise.allSettled(
    userIdsToHydrate.map((userId) => api.get(`/users/${userId}`))
  );

  const profileMap = new Map();
  profileResults.forEach((result, index) => {
    if (result.status === "fulfilled" && result.value?.data) {
      profileMap.set(userIdsToHydrate[index], result.value.data);
    }
  });

  if (!profileMap.size) {
    return normalized;
  }

  return normalized.map((app) => {
    const profile = profileMap.get(app.userId);
    if (!profile) return app;
    const profileName = [profile.fName, profile.lName].filter(Boolean).join(" ").trim();
    const enrichedDescription =
      app.description && app.description !== FALLBACK_DESCRIPTION
        ? app.description
        : profile.description || app.description;

    return {
      ...app,
      name: profileName || app.name,
      email: profile.email || app.email,
      phone: profile.phoneNb || app.phone,
      clothingSize: profile.clothingSize || app.clothingSize,
      description: enrichedDescription,
    };
  });
};

export default function HostApplications() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileModal, setProfileModal] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchApplications = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get("/applications");
        if (!cancelled) {
          const hydrated = await hydrateApplications(data);
          setApplicants(hydrated);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || "Failed to load applications");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchApplications();
    return () => {
      cancelled = true;
    };
  }, []);

  const statusFilters = ["all", "pending", "accepted", "rejected"];

  const filteredApplicants = useMemo(() => {
    if (activeFilter === "all") return applicants;
    return applicants.filter((app) => String(app.status || "").toLowerCase() === activeFilter);
  }, [activeFilter, applicants]);

  const updateStatus = (applicationId, status) => {
    setApplicants((prev) =>
      prev.map((app) => (app.id === applicationId ? { ...app, status } : app))
    );
  };

  const handleAccept = async (applicationId, requestedRole) => {
    try {
      await api.put(`/applications/${applicationId}`, {
        status: "accepted",
        assignedRole: requestedRole,
      });
      updateStatus(applicationId, "Accepted");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to accept application");
    }
  };

  const handleReject = async (applicationId) => {
    try {
      await api.put(`/applications/${applicationId}`, { status: "rejected" });
      updateStatus(applicationId, "Rejected");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reject application");
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
      <section className="px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-ocean font-semibold">
              Filter applications
            </p>
            <h3 className="text-lg font-semibold text-gray-900">Browse by status</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  activeFilter === filter
                    ? "bg-ocean text-white"
                    : "bg-cream text-gray-700 hover:bg-mist"
                }`}
              >
                {filter === "all" ? "All Applications" : filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center text-gray-500">
              Loading applications...
            </div>
          ) : error ? (
            <div className="bg-white rounded-3xl border border-red-100 p-12 text-center text-red-600">
              {error}
            </div>
          ) : filteredApplicants.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center text-gray-500">
              No applications match this filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredApplicants.map((app) => {
                const isPending = app.status === "Pending";
                return (
                  <article
                    key={app.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition p-6 space-y-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-ocean font-semibold mb-2">
                          <User size={14} />
                          <span>{app.role}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{app.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">Applied on {app.appliedDate}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-start gap-3 text-gray-700">
                          <Mail size={18} className="text-ocean" />
                          <div>
                            <p className="text-xs uppercase text-gray-400 tracking-widest">Email</p>
                            <p className="font-medium">{app.email}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 text-gray-700">
                          <Phone size={18} className="text-ocean" />
                          <div>
                            <p className="text-xs uppercase text-gray-400 tracking-widest">Phone</p>
                            <p className="font-medium">{app.phone}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-cream rounded-2xl p-4 space-y-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                          <Award size={16} className="text-ocean" />
                          <span>Experience</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{app.description}</p>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-700 font-medium">
                            Size: {app.clothingSize}
                          </span>
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-700 font-medium">
                            <Languages size={16} className="text-ocean" />
                            Languages coming soon
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setProfileModal(app)}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-gray-700 font-semibold hover:border-ocean hover:text-ocean transition"
                      >
                        <Eye size={18} />
                        View Profile
                      </button>
                      <div className="flex flex-1 gap-3">
                        <button
                          type="button"
                          disabled={!isPending}
                          onClick={() => handleReject(app.id)}
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
                          onClick={() => handleAccept(app.id, app.requestedRole)}
                          className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full font-semibold transition ${
                            isPending
                              ? "text-white bg-ocean hover:bg-ocean/90"
                              : "text-gray-400 bg-gray-100 cursor-not-allowed"
                          }`}
                        >
                          <CheckCircle size={18} />
                          Accept
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

      {profileModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full relative p-6 space-y-5">
            <button
              type="button"
              onClick={() => setProfileModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-cream flex items-center justify-center text-ocean">
                <User size={28} />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-ocean font-semibold">
                  {profileModal.role}
                </p>
                <h3 className="text-2xl font-bold text-gray-900">{profileModal.name}</h3>
                <p className="text-sm text-gray-500 mt-1">Applied on {profileModal.appliedDate}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="rounded-2xl border border-gray-100 p-4 space-y-3">
                <div className="flex items-start gap-3 text-gray-700">
                  <Mail size={18} className="text-ocean" />
                  <div>
                    <p className="text-xs uppercase text-gray-400 tracking-widest">Email</p>
                    <p className="font-semibold">{profileModal.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-gray-700">
                  <Phone size={18} className="text-ocean" />
                  <div>
                    <p className="text-xs uppercase text-gray-400 tracking-widest">Phone</p>
                    <p className="font-semibold">{profileModal.phone}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Award size={16} className="text-ocean" />
                  <span>Notes & Experience</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {profileModal.description}
                </p>
                <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                  <span className="px-3 py-1 rounded-full bg-cream text-gray-800 font-semibold">
                    Clothing Size: {profileModal.clothingSize}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-cream text-gray-800 font-semibold inline-flex items-center gap-2">
                    <Languages size={16} className="text-ocean" />
                    Languages coming soon
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
