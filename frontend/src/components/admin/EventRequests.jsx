import React, { useState, useEffect, useMemo } from "react";
import { CheckCircle, XCircle, Calendar, MapPin, Users, Clock, User, Mail, Phone, Eye, ChevronDown } from "lucide-react";
import { adminAPI } from "../../services/api";

export default function EventRequests() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [eventRequests, setEventRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventApplications, setEventApplications] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchEventRequests();
  }, []);

  const fetchEventRequests = async () => {
    try {
      const response = await adminAPI.getEventRequests();
      setEventRequests(response.data);
    } catch (error) {
      console.error("Failed to fetch event requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      await adminAPI.approveEventRequest(requestId);
      // Update local state or refetch
      setEventRequests(prev => prev.filter(req => req.eventId !== requestId));
    } catch (error) {
      console.error("Failed to approve event:", error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await adminAPI.rejectEventRequest(requestId);
      // Update local state or refetch
      setEventRequests(prev => prev.filter(req => req.eventId !== requestId));
    } catch (error) {
      console.error("Failed to reject event:", error);
    }
  };

  const handleEventClick = async (event) => {
    setSelectedEvent(event);
    setModalLoading(true);
    setShowModal(true);
    try {
      const response = await adminAPI.getApplicationsForEvent(event.eventId);
      setEventApplications(response.data);
    } catch (error) {
      console.error("Failed to fetch applications for event:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleApproveApplication = async (applicationId, assignedRole) => {
    try {
      await adminAPI.approveHostApplication(applicationId, assignedRole);
      setEventApplications(prev => prev.map(app =>
        app.eventAppId === applicationId ? { ...app, status: 'accepted', assignedRole } : app
      ));
    } catch (error) {
      console.error("Failed to approve application:", error);
    }
  };

  const handleRejectApplication = async (applicationId) => {
    try {
      await adminAPI.rejectHostApplication(applicationId);
      setEventApplications(prev => prev.map(app =>
        app.eventAppId === applicationId ? { ...app, status: 'rejected' } : app
      ));
    } catch (error) {
      console.error("Failed to reject application:", error);
    }
  };

  const statusFilters = ["all", "pending", "accepted", "rejected"];

  const filteredRequests = useMemo(() => {
    if (activeFilter === "all") return eventRequests;
    return eventRequests.filter((req) => req.status === activeFilter);
  }, [activeFilter, eventRequests]);

  const pendingRequests = eventRequests.filter(req => req.status === "pending");


  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "accepted":
        return "text-green-600 bg-green-50 border-green-200";
      case "rejected":
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
                {filter === "all" ? "All Events" : filter}
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
                  key={request.eventId}
                  onClick={() => request.status === 'accepted' && handleEventClick(request)}
                  className={`bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition p-6 space-y-4 ${request.status === 'accepted' ? 'cursor-pointer' : ''}`}
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
                      Client: {request.clientFName} {request.clientLName}
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
                      <span>Event ID: {request.eventId}</span>
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
                      Budget: ${request.budget}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  {request.status === "pending" && (
                    <div className="flex gap-3 pt-3">
                      <button
                        onClick={() => handleApprove(request.eventId)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition"
                      >
                        <CheckCircle size={18} />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(request.eventId)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition"
                      >
                        <XCircle size={18} />
                        Reject
                      </button>
                    </div>
                  )}

                  {/* Manage Applications Button */}
                  {request.status === "accepted" && (
                    <div className="pt-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEventClick(request);
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-ocean text-white text-sm font-semibold hover:bg-blue-700 transition"
                      >
                        <Eye size={18} />
                        Manage Applications
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal for Event Applications */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Applications for {selectedEvent?.title}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedEvent?.eventDate} • {selectedEvent?.location}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              {modalLoading ? (
                <div className="text-center py-8">Loading applications...</div>
              ) : eventApplications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No applications found for this event.
                </div>
              ) : (
                <div className="space-y-4">
                  {eventApplications.map((application) => {
                    const status = application.status;

                    return (
                      <article
                        key={application.eventAppId}
                        className="bg-gray-50 rounded-2xl border border-gray-100 p-4 space-y-3"
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-sky text-ocean flex items-center justify-center">
                              <User size={20} />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900">
                                {application.fName} {application.lName}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Applied for: {application.requestedRole}
                                {application.assignedRole && application.assignedRole !== application.requestedRole && (
                                  <span className="ml-2 text-green-600 font-medium">
                                    (Assigned: {application.assignedRole})
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(status)}`}
                          >
                            {status}
                          </span>
                        </div>

                        {/* Contact Info */}
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail size={14} className="text-ocean" />
                            <span className="truncate">{application.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone size={14} className="text-ocean" />
                            <span>{application.phoneNb}</span>
                          </div>
                        </div>

                        {/* Description */}
                        {application.description && (
                          <p className="text-sm text-gray-600">
                            {application.description}
                          </p>
                        )}

                        {/* Notes */}
                        {application.notes && (
                          <div className="bg-white rounded-lg p-3">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Notes:</span> {application.notes}
                            </p>
                          </div>
                        )}

                        {/* Applied Date */}
                        <p className="text-xs text-gray-500">
                          Applied: {new Date(application.sentAt).toLocaleDateString()}
                        </p>

                        {/* Action Buttons */}
                        {status === "pending" && (
                          <div className="flex gap-3 pt-2">
                            <AcceptWithRoleButton
                              application={application}
                              onAccept={handleApproveApplication}
                            />
                            <button
                              onClick={() => handleRejectApplication(application.eventAppId)}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition"
                            >
                              <XCircle size={16} />
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
          </div>
        </div>
      )}
    </div>
  );
}

// Component for Accept button with role selection
function AcceptWithRoleButton({ application, onAccept }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(application.requestedRole);

  const roles = ['host', 'team_leader'];

  const handleAccept = () => {
    // Call the onAccept function with the application ID and selected role
    onAccept(application.eventAppId, selectedRole);
    setShowModal(false);
  };

  return (
    <>
      <div className="flex-1">
        <button
          onClick={() => setShowModal(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition"
        >
          <CheckCircle size={16} />
          Accept
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Assign Role for {application.fName} {application.lName}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Role:
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role.replace('_', ' ').toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAccept}
                  className="flex-1 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition"
                >
                  Accept Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
