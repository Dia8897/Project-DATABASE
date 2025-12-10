import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ClientEventList from "../components/ClientEventList";
import ClientEventRequest from "../components/ClientEventRequest";
import ClientProfileHeader from "../components/client/ClientProfileHeader";
import api from "../services/api";

import wedding from "../pics/wedding.png";
import birthday from "../pics/birthday.png";
import baby from "../pics/babyWelcomming.png";
import engagement from "../pics/engagement.png";
import bachelorette from "../pics/bachelorette.png";
import corporate from "../pics/corporateDinner.png";

const toMySqlDateTime = (dateObj) => {
  if (!dateObj) return "";
  const pad = (n) => String(n).padStart(2, "0");
  const year = dateObj.getFullYear();
  const month = pad(dateObj.getMonth() + 1);
  const day = pad(dateObj.getDate());
  const hours = pad(dateObj.getHours());
  const minutes = pad(dateObj.getMinutes());
  const seconds = pad(dateObj.getSeconds());
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toISOString().split("T")[0];
};

export default function ClientPage() {
  const [activeTab, setActiveTab] = useState("requests");
  const [client, setClient] = useState(null);
  const [eventType, setEventType] = useState("Wedding");
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [guests, setGuests] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [eventsError, setEventsError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [profilePicError, setProfilePicError] = useState("");
  const [profilePicSuccess, setProfilePicSuccess] = useState("");
  const [savingProfilePic, setSavingProfilePic] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      setClient(parsed);
      setProfilePicUrl(parsed.profilePic || "");
    } catch (err) {
      console.warn("Failed to parse stored client", err);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const loadEvents = async () => {
      setLoading(true);
      setEventsError("");
      try {
        const res = await api.get("/clients/me/events");
        if (!active) return;
        const normalized = res.data.map((ev) => ({
          id: ev.eventId,
          type: ev.type,
          date: formatDate(ev.startsAt),
          startsAt: ev.startsAt,
          guests: ev.nbOfHosts ?? ev.guests ?? "",
          status: ev.status || "pending",
          location: ev.location,
        }));
        setEvents(normalized);
      } catch (err) {
        if (!active) return;
        const message = err?.response?.data?.message || err.message || "Failed to load events";
        setEventsError(message);
      } finally {
        if (active) setLoading(false);
      }
    };
    loadEvents();
    return () => {
      active = false;
    };
  }, []);

  const occasions = [
    { id: "Wedding", label: "Wedding", icon: wedding },
    { id: "Birthday", label: "Birthday", icon: birthday },
    { id: "Baby Welcoming", label: "Baby Welcoming", icon: baby },
    { id: "Engagement", label: "Engagement", icon: engagement },
    { id: "Bachelorette", label: "Bachelorette", icon: bachelorette },
    { id: "Corporate dinner", label: "Corporate dinner", icon: corporate },
  ];

  const handleCreateRequest = async (e) => {
    e.preventDefault();

    if (!startDateTime || !endDateTime || !guests || !description.trim() || !location.trim()) {
      setFormError("Please provide start/end, guests, description, and location.");
      return;
    }

    setFormError("");
    setSubmitting(true);

    const payload = {
      type: eventType,
      description: description.trim(),
      location: location.trim(),
      startsAt: toMySqlDateTime(startDateTime),
      endsAt: toMySqlDateTime(endDateTime),
      nbOfHosts: Number(guests),
    };

    try {
      const response = await api.post("/events", payload);
      const newEvent = {
        id: response.data.eventId || Date.now(),
        type: eventType,
        date: formatDate(payload.startsAt),
        startsAt: payload.startsAt,
        guests: Number(guests),
        status: "pending",
        location: payload.location,
      };

      setEvents((prev) => [...prev, newEvent]);
      setActiveTab("requests");
      setStartDateTime(null);
      setEndDateTime(null);
      setDescription("");
      setLocation("");
      setGuests("");
    } catch (err) {
      const message = err?.response?.data?.message || err.message || "Failed to submit request";
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const acceptedCount =
    events.filter((e) => String(e.status).toLowerCase() === "accepted" || e.status === "Confirmed")
      .length;
  const pendingCount =
    events.filter((e) => String(e.status).toLowerCase() === "pending" || e.status === "Pending review")
      .length;
  const rejectedCount = Math.max(events.length - acceptedCount - pendingCount, 0);
  const clientStats = {
    total: events.length,
    accepted: acceptedCount,
    pending: pendingCount,
    rejected: rejectedCount,
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!newPassword || !confirmPassword) {
      setPasswordError("Please enter and confirm your new password.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    const clientId = client?.clientId || client?.userId || client?.id;
    if (!clientId) {
      setPasswordError("Unable to find your account id. Please sign in again.");
      return;
    }

    setSavingPassword(true);
    try {
      await api.put(`/clients/${clientId}`, { password: newPassword });
      setPasswordSuccess("Password updated successfully.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const message = err?.response?.data?.message || err.message || "Failed to update password";
      setPasswordError(message);
    } finally {
      setSavingPassword(false);
    }
  };

  const handleProfilePicSave = async (e) => {
    e.preventDefault();
    setProfilePicError("");
    setProfilePicSuccess("");

    const trimmed = profilePicUrl.trim();
    const clientId = client?.clientId || client?.userId || client?.id;
    if (!clientId) {
      setProfilePicError("Unable to find your account id. Please sign in again.");
      return;
    }

    setSavingProfilePic(true);
    try {
      await api.put(`/clients/${clientId}`, { profilePic: trimmed || null });
      const updatedClient = { ...(client || {}), profilePic: trimmed || null };
      setClient(updatedClient);
      localStorage.setItem("user", JSON.stringify(updatedClient));
      setProfilePicSuccess("Profile photo updated.");
    } catch (err) {
      const message = err?.response?.data?.message || err.message || "Failed to update profile photo";
      setProfilePicError(message);
    } finally {
      setSavingProfilePic(false);
    }
  };

  return (
    <main className="bg-pearl min-h-screen">
      <Navbar />

      <div className="pt-24 space-y-8">
        <ClientProfileHeader client={client} stats={clientStats} />

        <section className="px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-3xl shadow-lg p-2 flex gap-2">
              <button
                onClick={() => setActiveTab("requests")}
                className={`flex-1 px-6 py-4 rounded-2xl text-base font-semibold transition ${
                  activeTab === "requests"
                    ? "bg-ocean text-white shadow-md"
                    : "bg-transparent text-gray-700 hover:bg-cream"
                }`}
              >
                My Requests
              </button>
              <button
                onClick={() => setActiveTab("new")}
                className={`flex-1 px-6 py-4 rounded-2xl text-base font-semibold transition ${
                  activeTab === "new"
                    ? "bg-ocean text-white shadow-md"
                    : "bg-transparent text-gray-700 hover:bg-cream"
                }`}
              >
                New Request
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex-1 px-6 py-4 rounded-2xl text-base font-semibold transition ${
                  activeTab === "settings"
                    ? "bg-ocean text-white shadow-md"
                    : "bg-transparent text-gray-700 hover:bg-cream"
                }`}
              >
                Profile Settings
              </button>
            </div>
          </div>
        </section>

        <section className="px-4 pb-16">
          <div className="max-w-6xl mx-auto space-y-6">
            {activeTab === "new" ? (
              <ClientEventRequest
                occasions={occasions}
                eventType={eventType}
                startDateTime={startDateTime}
                endDateTime={endDateTime}
                guests={guests}
                location={location}
                description={description}
                onTypeChange={setEventType}
                onStartChange={setStartDateTime}
                onEndChange={setEndDateTime}
                onGuestsChange={setGuests}
                onLocationChange={setLocation}
                onDescriptionChange={setDescription}
                onSubmit={handleCreateRequest}
                submitting={submitting}
                errorMessage={formError}
              />
            ) : activeTab === "settings" ? (
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 space-y-10">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-ocean font-semibold">
                    Profile
                  </p>
                  <h2 className="text-2xl font-bold text-gray-900">Profile Photo</h2>
                  <p className="text-sm text-gray-500">
                    Paste an image URL to personalize your profile.
                  </p>
                </div>

                {profilePicError && (
                  <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-2xl px-4 py-3">
                    {profilePicError}
                  </div>
                )}
                {profilePicSuccess && (
                  <div className="bg-green-50 border border-green-100 text-green-700 text-sm rounded-2xl px-4 py-3">
                    {profilePicSuccess}
                  </div>
                )}

                <form onSubmit={handleProfilePicSave} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Profile Photo URL
                    </label>
                    <input
                      type="url"
                      value={profilePicUrl}
                      onChange={(e) => setProfilePicUrl(e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ocean focus:border-ocean bg-white"
                      disabled={savingProfilePic}
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-ocean text-white text-sm font-semibold shadow-md hover:bg-ocean/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
                      disabled={savingProfilePic}
                    >
                      {savingProfilePic ? "Saving..." : "Save Photo"}
                    </button>
                  </div>
                </form>

                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-ocean font-semibold">
                    Security
                  </p>
                  <h2 className="text-2xl font-bold text-gray-900">Change Password</h2>
                  <p className="text-sm text-gray-500">
                    Set a new password for your account. Leave blank if you do not want to change it.
                  </p>
                </div>

                {passwordError && (
                  <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-2xl px-4 py-3">
                    {passwordError}
                  </div>
                )}
                {passwordSuccess && (
                  <div className="bg-green-50 border border-green-100 text-green-700 text-sm rounded-2xl px-4 py-3">
                    {passwordSuccess}
                  </div>
                )}

                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ocean focus:border-ocean bg-white"
                        disabled={savingPassword}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ocean focus:border-ocean bg-white"
                        disabled={savingPassword}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-ocean text-white text-sm font-semibold shadow-md hover:bg-ocean/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
                      disabled={savingPassword}
                    >
                      {savingPassword ? "Saving..." : "Save Password"}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <>
                {eventsError && (
                  <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-2xl px-4 py-3">
                    {eventsError}
                  </div>
                )}
                {loading ? (
                  <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center text-gray-500">
                    Loading your event requests...
                  </div>
                ) : (
                  <ClientEventList events={events} />
                )}
              </>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
