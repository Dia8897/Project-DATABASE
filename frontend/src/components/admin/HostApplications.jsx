import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { User, CheckCircle, XCircle, Mail, Phone, Award, Languages, Eye } from "lucide-react";

export default function HostApplications() {
  const [activeFilter, setActiveFilter] = useState("all");

  // Sample applicant data with more details
  const applicants = [
    {
      applicationId: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      phone: "+961 70 123 456",
      role: "Host",
      status: "Pending",
      experience: "3 years",
      languages: ["English", "French"],
      appliedDate: "2025-11-25",
      description: "Experienced host with luxury hotel background. Worked at Four Seasons for 2 years.",
    },
    {
      applicationId: 2,
      name: "Bob Smith",
      email: "bob@example.com",
      phone: "+961 71 234 567",
      role: "Host",
      status: "Pending",
      experience: "2 years",
      languages: ["English", "Arabic"],
      appliedDate: "2025-11-24",
      description: "Corporate event specialist with strong communication skills.",
    },
    {
      applicationId: 3,
      name: "Charlie Lee",
      email: "charlie@example.com",
      phone: "+961 3 345 678",
      role: "Team Leader",
      status: "Pending",
      experience: "5 years",
      languages: ["English", "French", "Arabic"],
      appliedDate: "2025-11-26",
      description: "Senior host with leadership experience. Managed teams at international events.",
    },
    {
      applicationId: 4,
      name: "Dana White",
      email: "dana@example.com",
      phone: "+961 76 456 789",
      role: "Host",
      status: "Accepted",
      experience: "4 years",
      languages: ["English", "Spanish"],
      appliedDate: "2025-11-20",
      description: "Professional hostess with VIP event experience.",
    },
    {
      applicationId: 5,
      name: "Emma Brown",
      email: "emma.brown@email.com",
      phone: "+961 70 567 890",
      role: "Team Leader",
      status: "Pending",
      experience: "6 years",
      languages: ["English", "French", "German"],
      appliedDate: "2025-11-27",
      description: "Multilingual team leader with extensive luxury event portfolio.",
    },
    {
      applicationId: 6,
      name: "Frank Miller",
      email: "frank.m@email.com",
      phone: "+961 3 678 901",
      role: "Host",
      status: "Rejected",
      experience: "1 year",
      languages: ["English"],
      appliedDate: "2025-11-18",
      description: "Entry-level host seeking opportunities.",
    },
    {
      applicationId: 7,
      name: "Grace Chen",
      email: "grace.chen@email.com",
      phone: "+961 71 789 012",
      role: "Host",
      status: "Pending",
      experience: "3 years",
      languages: ["English", "Mandarin", "French"],
      appliedDate: "2025-11-26",
      description: "Bilingual host with experience in fashion and corporate events.",
    },
    {
      applicationId: 8,
      name: "Hassan Khalil",
      email: "hassan.k@email.com",
      phone: "+961 70 890 123",
      role: "Team Leader",
      status: "Accepted",
      experience: "7 years",
      languages: ["English", "Arabic", "French"],
      appliedDate: "2025-11-15",
      description: "Experienced team coordinator with proven track record in large-scale events.",
    },
  ];

  const statusFilters = ["all", "Pending", "Accepted", "Rejected"];

  const filteredApplicants = useMemo(() => {
    if (activeFilter === "all") return applicants;
    return applicants.filter((app) => app.status === activeFilter);
  }, [activeFilter, applicants]);

  const handleAccept = (applicationId) => {
    console.log(`Accepted application: ${applicationId}`);
    // In production: API call to accept application
  };

  const handleReject = (applicationId) => {
    console.log(`Rejected application: ${applicationId}`);
    // In production: API call to reject application
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
          {filteredApplicants.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center text-gray-500">
              No applications match this filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApplicants.map((applicant) => (
                <article
                  key={applicant.applicationId}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition p-6 space-y-4"
                >
                  {/* Header with Avatar and Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-sky text-ocean flex items-center justify-center flex-shrink-0">
                        <User size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 truncate">
                          {applicant.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {applicant.role}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${getStatusColor(
                        applicant.status
                      )}`}
                    >
                      {applicant.status}
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail size={14} className="text-ocean flex-shrink-0" />
                      <span className="truncate">{applicant.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={14} className="text-ocean flex-shrink-0" />
                      <span>{applicant.phone}</span>
                    </div>
                  </div>

                  {/* Experience and Languages */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Award size={14} className="text-ocean flex-shrink-0" />
                      <span className="font-medium">Experience: {applicant.experience}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <Languages size={14} className="text-ocean flex-shrink-0 mt-0.5" />
                      <span className="flex-1">{applicant.languages.join(", ")}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 line-clamp-3 pt-2 border-t border-gray-100">
                    {applicant.description}
                  </p>

                  {/* Applied Date */}
                  <p className="text-xs text-gray-500">
                    Applied: {applicant.appliedDate}
                  </p>

                  {/* View Profile Button */}
                  <Link
                    to={`/profile/${applicant.applicationId}`}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-ocean text-ocean text-sm font-semibold hover:bg-sky transition"
                  >
                    <Eye size={16} />
                    View Profile
                  </Link>

                  {/* Action Buttons */}
                  {applicant.status === "Pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAccept(applicant.applicationId)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition"
                      >
                        <CheckCircle size={16} />
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(applicant.applicationId)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition"
                      >
                        <XCircle size={16} />
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
