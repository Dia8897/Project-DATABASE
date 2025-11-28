import React from "react";
import { Mail, Phone, MapPin, Star } from "lucide-react";

export default function ProfileHeader({ profile }) {
  const initials = `${profile.fName?.[0] || ""}${profile.lName?.[0] || ""}`;

  return (
    <section className="px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-gray-100">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt={`${profile.fName} ${profile.lName}`}
                className="w-32 h-32 rounded-full object-cover border-4 border-sky"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-ocean to-sky flex items-center justify-center text-white text-4xl font-bold">
                {initials}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-ocean font-semibold">
                  Host Profile
                </p>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-1">
                  {profile.fName} {profile.lName}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  profile.eligibility === "approved" 
                    ? "bg-mint/30 text-green-700 border border-mint" 
                    : "bg-rose/30 text-rose border border-rose"
                }`}>
                  {profile.eligibility === "approved" ? "Verified Host" : "Pending Verification"}
                </span>
                {profile.rating && (
                  <span className="px-4 py-2 rounded-full bg-sky text-ocean text-sm font-semibold flex items-center gap-1">
                    <Star size={14} fill="currentColor" />
                    {profile.rating}
                  </span>
                )}
              </div>
            </div>

            <p className="text-gray-600 max-w-2xl">
              {profile.description}
            </p>

            {/* Contact & Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-10 h-10 rounded-xl bg-cream flex items-center justify-center">
                  <Mail size={18} className="text-ocean" />
                </div>
                <span className="truncate">{profile.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-10 h-10 rounded-xl bg-cream flex items-center justify-center">
                  <Phone size={18} className="text-ocean" />
                </div>
                <span>{profile.phoneNb}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-10 h-10 rounded-xl bg-cream flex items-center justify-center">
                  <MapPin size={18} className="text-ocean" />
                </div>
                <span>{profile.address}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.spokenLanguages?.map((lang) => (
                  <span key={lang} className="px-3 py-1 rounded-full bg-mist text-gray-700 text-xs font-medium">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
