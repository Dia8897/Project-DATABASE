import { Link } from "react-router-dom";
import { User, CheckCircle, XCircle, Mail, Phone, Award, Languages, Eye } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import { adminAPI } from "../../services/api";


export default function HostApplications() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHostApplications();
  }, []);

  const fetchHostApplications = async () => {
    try {
      const response = await adminAPI.getHostApplications();
      setApplications(response.data);
    } catch (error) {
      console.error("Failed to fetch host applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (applicationId) => {
    try {
      await adminAPI.approveHostApplication(applicationId);
      // Update local state
      setApplications(prev => prev.map(app =>
        app.eventAppId === applicationId ? { ...app, status: 'accepted' } : app
      ));
    } catch (error) {
      console.error("Failed to accept application:", error);
    }
  };

  const handleReject = async (applicationId) => {
    try {
      await adminAPI.rejectHostApplication(applicationId);
      // Update local state
      setApplications(prev => prev.map(app =>
        app.eventAppId === applicationId ? { ...app, status: 'rejected' } : app
      ));
    } catch (error) {
      console.error("Failed to reject application:", error);
    }
  };

  const statusFilters = ["all", "pending", "accepted", "rejected"];

  const filteredApplications = useMemo(() => {
    if (activeFilter === "all") return applications;
    return applications.filter((app) => app.status === activeFilter);
  }, [activeFilter, applications]);

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
              Filter applications
            </p>
            <h3 className="text-lg font-semibold text-gray-900">
              Browse by status
            </h3>
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

      {/* Applications Grid */}
      <section className="px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          {filteredApplications.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center text-gray-500">
              No applications match this filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredApplications.map((application) => {
                const status = application.status;

                return (
                  <article
                    key={application.eventAppId}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition p-6 space-y-4"
                  >
                    {/* Event Info Header */}
                    <div className="bg-cream rounded-xl p-4 -m-2 mb-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900">
                            {application.eventTitle}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {application.eventDate} • {application.eventLocation}
                          </p>
                          <p className="text-xs text-ocean font-medium mt-1">
                            Applied for: {application.requestedRole}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                            status
                          )}`}
                        >
                          {status}
                        </span>
                      </div>
                    </div>

                    {/* Applicant Header */}
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-sky text-ocean flex items-center justify-center flex-shrink-0">
                        <User size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 truncate">
                          {application.fName} {application.lName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Age: {application.age}
                        </p>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} className="text-ocean flex-shrink-0" />
                        <span className="truncate">{application.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={14} className="text-ocean flex-shrink-0" />
                        <span>{application.phoneNb}</span>
                      </div>
                    </div>

                    {/* Application Notes */}
                    {application.notes && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Notes:</span> {application.notes}
                        </p>
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {application.description}
                    </p>

                    {/* Application Date */}
                    <p className="text-xs text-gray-500">
                      Applied: {new Date(application.sentAt).toLocaleDateString()}
                    </p>

                    {/* Action Buttons */}
                    {status === "pending" && (
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => handleAccept(application.eventAppId)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition"
                        >
                          <CheckCircle size={18} />
                          Accept
                        </button>
                        <button
                          onClick={() => handleReject(application.eventAppId)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition"
                        >
                          <XCircle size={18} />
                          Reject
                        </button>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
