import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileStats from "../components/profile/ProfileStats";
import AppliedEvents from "../components/profile/AppliedEvents";
import AttendedEvents from "../components/profile/AttendedEvents";
import Trainings from "../components/profile/Trainings";
import WorkedClients from "../components/profile/WorkedClients";
import api from "../services/api";

const formatDate = (value, options = { year: "numeric", month: "short", day: "numeric" }) => {
  if (!value) return "TBA";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "TBA";
  return date.toLocaleDateString(undefined, options);
};

const formatStatus = (status = "") => {
  const normalized = status.toLowerCase();
  if (normalized === "accepted") return "Accepted";
  if (normalized === "rejected") return "Rejected";
  return "Pending";
};

const formatRole = (role = "") =>
  role
    ? role
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
    : "Host";

const buildTrainingStatus = (dateValue) => {
  if (!dateValue) return "Upcoming";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const trainingDate = new Date(dateValue);
  return trainingDate < today ? "Completed" : "Upcoming";
};

const buildTrainingDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return "Time TBD";
  return `${startTime.slice(0, 5)} - ${endTime.slice(0, 5)}`;
};

export default function HostProfilePage() {
  const { hostId } = useParams();
  const [activeTab, setActiveTab] = useState("applied");
  const [profile, setProfile] = useState(null);
  const [appliedEvents, setAppliedEvents] = useState([]);
  const [attendedEvents, setAttendedEvents] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [workedClients, setWorkedClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [checkedUser, setCheckedUser] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch {
        console.warn("Failed to parse stored user");
      }
    }
    setCheckedUser(true);
  }, []);

  useEffect(() => {
    if (!checkedUser) return;
    const resolvedId = hostId || currentUser?.userId;

    if (!resolvedId) {
      setLoading(false);
      setError("Please sign in to view this profile.");
      return;
    }

    const fetchOverview = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get(`/users/${resolvedId}/overview`);

        setProfile({
          ...data.profile,
          profileImage: data.profile.profilePic || null,
          // DB does not yet store spokenLanguages or yearsOfExperience; consider adding columns later.
        });

        setAppliedEvents(
          data.appliedEvents.map((event) => ({
            id: event.eventAppId,
            title: event.title,
            date: formatDate(event.startsAt),
            location: event.location || "Location TBA",
            status: formatStatus(event.status),
            category: event.type
              ? event.type.charAt(0).toUpperCase() + event.type.slice(1)
              : "General",
          }))
        );

        setAttendedEvents(
          data.attendedEvents.map((event) => ({
            id: event.eventId,
            title: event.title,
            date: formatDate(event.startsAt),
            location: event.location || "Location TBA",
            role: formatRole(event.assignedRole),
            rating: typeof event.starRating === "number" ? event.starRating.toFixed(1) : "N/A",
            client: event.clientName || "Client undisclosed",
          }))
        );

        setTrainings(
          data.trainings.map((training) => ({
            id: training.trainingId,
            title: training.title,
            date: formatDate(training.date),
            duration: buildTrainingDuration(training.startTime, training.endTime),
            status: buildTrainingStatus(training.date),
            certificate: false, // Certificates are not tracked in the DB yet.
          }))
        );

        setWorkedClients(
          data.workedClients.map((client) => ({
            id: client.clientId,
            name: client.name,
            eventsWorked: client.eventsWorked,
            lastEvent: client.lastEvent ? formatDate(client.lastEvent) : "N/A",
            rating:
              typeof client.rating === "number" && !Number.isNaN(client.rating)
                ? client.rating.toFixed(1)
                : "N/A",
          }))
        );
      } catch (err) {
        const message = err.response?.data?.message || "Failed to load profile";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [hostId, currentUser, checkedUser]);

  const tabs = [
    { id: "applied", label: "Applied Events", count: appliedEvents.length },
    { id: "attended", label: "Attended Events", count: attendedEvents.length },
    { id: "trainings", label: "Trainings", count: trainings.length },
    { id: "clients", label: "Clients", count: workedClients.length },
  ];

  if (loading) {
    return (
      <main className="bg-pearl min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading profile...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-pearl min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center border border-gray-100">
          <p className="text-gray-700 font-semibold">{error}</p>
        </div>
      </main>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <main className="bg-pearl min-h-screen">
      <Navbar />

      <div className="pt-24 space-y-8">
        <ProfileHeader profile={profile} />
        <ProfileStats profile={profile} eventsCount={attendedEvents.length} clientsCount={workedClients.length} />

        {/* Tab Navigation */}
        <section className="px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-3xl shadow-lg p-2 flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-[140px] px-4 py-3 rounded-2xl text-sm font-semibold transition flex items-center justify-center gap-2 ${
                    activeTab === tab.id
                      ? "bg-ocean text-white shadow-md"
                      : "bg-transparent text-gray-700 hover:bg-cream"
                  }`}
                >
                  {tab.label}
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id ? "bg-white/20" : "bg-sky text-ocean"
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Tab Content */}
        <section className="px-4 pb-16">
          <div className="max-w-6xl mx-auto">
            {activeTab === "applied" && <AppliedEvents events={appliedEvents} />}
            {activeTab === "attended" && <AttendedEvents events={attendedEvents} />}
            {activeTab === "trainings" && <Trainings trainings={trainings} />}
            {activeTab === "clients" && <WorkedClients clients={workedClients} />}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
