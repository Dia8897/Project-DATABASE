import React, { useCallback, useEffect, useState } from "react";

const getEmptyManualApplicant = () => ({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
});

export default function ApplyModal({ event, onClose, onSubmitted, currentUser }) {
  const buildFormFromProfile = useCallback(() => {
    const years = currentUser?.yearsOfExperience || 0;
    const derivedExperience =
      years >= 4 ? "seasoned" : years > 0 ? "junior" : "first_timer";
    return {
      experience: derivedExperience,
      languages: currentUser?.spokenLanguages || [],
      availability: [],
      motivation: "",
      agreeToPolicy: false,
    };
  }, [currentUser]);

  const [form, setForm] = useState(buildFormFromProfile);
  const [manualApplicant, setManualApplicant] = useState(getEmptyManualApplicant);
  const [requestedRole, setRequestedRole] = useState("host");
  const [requestDress, setRequestDress] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const languageOptions = Array.from(
    new Set([
      "English",
      "French",
      "Arabic",
      "Spanish",
      ...(currentUser?.spokenLanguages || []),
    ])
  );
  const availabilityOptions = [
    "Full day",
    "Morning shift",
    "Evening shift",
    "Setup / rehearsal day",
  ];
  const experienceOptions = [
    { value: "first_timer", label: "First-time host" },
    { value: "junior", label: "1-3 events" },
    { value: "seasoned", label: "4+ events" },
  ];

  const handleInputChange = (field) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleManualApplicantChange = (field) => (e) => {
    const value = e.target.value;
    setManualApplicant((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleExperienceChange = (value) => {
    setForm((prev) => ({ ...prev, experience: value }));
  };

  const toggleArrayField = (field, value) => {
    setForm((prev) => {
      const list = prev[field];
      const exists = list.includes(value);
      return {
        ...prev,
        [field]: exists
          ? list.filter((item) => item !== value)
          : [...list, value],
      };
    });
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!currentUser) {
      if (!manualApplicant.firstName.trim()) nextErrors.firstName = "Required";
      if (!manualApplicant.lastName.trim()) nextErrors.lastName = "Required";
      if (!manualApplicant.email.trim()) nextErrors.email = "Required";
    }
    if (form.availability.length === 0)
      nextErrors.availability = "Select at least one";
    if (!form.agreeToPolicy) nextErrors.agreeToPolicy = "Please accept";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!validate()) return;

    setSubmitting(true);

    const applicantDetails = currentUser
      ? {
          userId: currentUser.userId,
          firstName: currentUser.fName,
          lastName: currentUser.lName,
          email: currentUser.email,
          phone: currentUser.phoneNb,
          clothingSize: currentUser.clothingSize,
          eligibility: currentUser.eligibility,
        }
      : {
          firstName: manualApplicant.firstName.trim(),
          lastName: manualApplicant.lastName.trim(),
          email: manualApplicant.email.trim(),
          phone: manualApplicant.phone.trim(),
        };

    const payload = {
      eventId: event?.eventId,
      eventTitle: event?.title,
      eventDate: event?.date,
      senderId: currentUser?.userId || null,
      requestedRole,
      requestDress,
      applicant: applicantDetails,
      profile: {
        experience: form.experience,
        languages: form.languages,
        availability: form.availability,
        motivation: form.motivation.trim(),
      },
    };

    console.log("APPLICATION SUBMITTED (frontend only):", payload);

    setTimeout(() => {
      setSubmitting(false);
      onSubmitted?.(payload);
      setForm(buildFormFromProfile());
      setManualApplicant(getEmptyManualApplicant());
      setRequestedRole("host");
      setRequestDress(false);
      setErrors({});
    }, 400);
  };

  useEffect(() => {
    setForm(buildFormFromProfile());
    setManualApplicant(getEmptyManualApplicant());
    setRequestedRole("host");
    setRequestDress(false);
    setErrors({});
  }, [buildFormFromProfile, currentUser]);

  if (!event) return null;

  const disableSubmit =
    submitting ||
    (!currentUser &&
      (!manualApplicant.firstName.trim() ||
        !manualApplicant.lastName.trim() ||
        !manualApplicant.email.trim())) ||
    form.availability.length === 0 ||
    !form.agreeToPolicy;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <p className="text-xs uppercase tracking-widest text-ocean font-semibold mb-2">
            Application for
          </p>
          <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {event.date} • {event.location}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Applicant profile
              </h3>
              {currentUser && (
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  Logged in
                </span>
              )}
            </div>

            {currentUser ? (
              <div className="rounded-2xl border border-gray-100 bg-cream p-4 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-base font-semibold text-gray-900">
                      {currentUser.fName} {currentUser.lName}
                    </p>
                    <p className="text-sm text-gray-500">{currentUser.email}</p>
                    <p className="text-sm text-gray-500">
                      {currentUser.phoneNb || "Phone on profile"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                    {currentUser.clothingSize && (
                      <span className="bg-white border border-gray-200 px-3 py-1 rounded-full">
                        Size {currentUser.clothingSize}
                      </span>
                    )}
                    {currentUser.eligibility && (
                      <span className="bg-white border border-gray-200 px-3 py-1 rounded-full capitalize">
                        {currentUser.eligibility}
                      </span>
                    )}
                    {currentUser.gender && (
                      <span className="bg-white border border-gray-200 px-3 py-1 rounded-full capitalize">
                        {currentUser.gender}
                      </span>
                    )}
                  </div>
                </div>
                {currentUser.address && (
                  <p className="text-sm text-gray-600">{currentUser.address}</p>
                )}
                {currentUser.spokenLanguages?.length > 0 && (
                  <p className="text-xs text-gray-500">
                    Languages: {currentUser.spokenLanguages.join(", ")}
                  </p>
                )}
                {currentUser.description && (
                  <p className="text-xs text-gray-500">{currentUser.description}</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">First name</label>
                  <input
                    type="text"
                    value={manualApplicant.firstName}
                    onChange={handleManualApplicantChange("firstName")}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-ocean focus:border-ocean"
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Last name</label>
                  <input
                    type="text"
                    value={manualApplicant.lastName}
                    onChange={handleManualApplicantChange("lastName")}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-ocean focus:border-ocean"
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={manualApplicant.email}
                    onChange={handleManualApplicantChange("email")}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-ocean focus:border-ocean"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone (optional)</label>
                  <input
                    type="tel"
                    value={manualApplicant.phone}
                    onChange={handleManualApplicantChange("phone")}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-ocean focus:border-ocean"
                  />
                </div>
              </div>
            )}
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">Preferred role</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              {[
                { value: "host", label: "Host" },
                { value: "team_leader", label: "Team Leader" },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRequestedRole(value)}
                  className={`flex-1 px-3 py-3 rounded-xl border text-sm font-semibold transition ${
                    requestedRole === value
                      ? "bg-ocean text-white border-ocean"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-cream"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Experience & skills</h3>
            <div className="flex flex-wrap gap-2">
              {experienceOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleExperienceChange(option.value)}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition ${
                    form.experience === option.value
                      ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-cream"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Languages</p>
              <div className="flex flex-wrap gap-2">
                {languageOptions.map((lang) => (
                  <button
                    type="button"
                    key={lang}
                    onClick={() => toggleArrayField("languages", lang)}
                    className={`px-3 py-2 rounded-lg border text-sm transition ${
                      form.languages.includes(lang)
                        ? "bg-sky text-ocean border-ocean/50"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-cream"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Availability</h3>
              {errors.availability && (
                <p className="text-xs text-red-500">{errors.availability}</p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availabilityOptions.map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => toggleArrayField("availability", slot)}
                  className={`px-4 py-3 rounded-xl border text-sm font-semibold text-left transition ${
                    form.availability.includes(slot)
                      ? "bg-ocean text-white border-ocean"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-cream"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Motivation / notes</label>
              <textarea
                rows={3}
                value={form.motivation}
                onChange={handleInputChange("motivation")}
                className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-ocean focus:border-ocean"
                placeholder="Tell us about your hosting style, certifications, or anything the coordinator should know."
              />
            </div>

            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={requestDress}
                onChange={(e) => setRequestDress(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span>Request dress for this event</span>
            </label>

            <label className="flex items-start gap-2 text-sm text-gray-600 bg-cream p-3 rounded-xl border border-gray-200">
              <input
                type="checkbox"
                checked={form.agreeToPolicy}
                onChange={handleInputChange("agreeToPolicy")}
                className="mt-1 rounded border-gray-300"
              />
              <span>
                I agree to Hostify's professionalism code (punctuality, NDA, and dress code compliance).
              </span>
            </label>
            {errors.agreeToPolicy && (
              <p className="text-xs text-red-500">{errors.agreeToPolicy}</p>
            )}
          </section>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 border border-gray-300 hover:bg-cream"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={disableSubmit}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-ocean hover:bg-ocean/80 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting…" : "Submit application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
