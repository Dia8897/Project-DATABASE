import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Mail, Lock, User, ArrowRight } from "lucide-react";

export default function AuthModal({ show, onClose, initialRole = "host" }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [activeRole, setActiveRole] = useState(initialRole);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  if (!show) return null;

  const roles = [
    { id: "host", label: "Host", icon: "👤" },
    { id: "client", label: "Client", icon: "🎉" },
    { id: "admin", label: "Admin", icon: "⚙️" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose();

    if (activeRole === "admin") {
      navigate("/admin");
    } else if (activeRole === "client") {
      navigate("/client");
    } else {
      navigate("/events");
    }
  };

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const getRoleColor = (roleId) => {
    switch (roleId) {
      case "host": return "ocean";
      case "client": return "rose";
      case "admin": return "mint";
      default: return "ocean";
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900/60 flex justify-center items-center z-50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-ocean to-sky p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
          >
            <X size={18} />
          </button>
          <h2 className="text-2xl font-bold">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-white/80 mt-1 text-sm">
            {isSignUp ? "Join our community today" : "Sign in to continue"}
          </p>
        </div>

        {/* Role Selector */}
        <div className="px-6 pt-6">
          <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-3">
            I am a
          </p>
          <div className="flex gap-2">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id)}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 ${
                  activeRole === role.id
                    ? `bg-${getRoleColor(role.id)} text-white shadow-md`
                    : "bg-cream text-gray-700 hover:bg-mist"
                }`}
                style={activeRole === role.id ? {
                  backgroundColor: role.id === "host" ? "var(--color-ocean)" : 
                                   role.id === "client" ? "var(--color-rose)" : 
                                   "var(--color-mint)"
                } : {}}
              >
                <span>{role.icon}</span>
                {role.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {isSignUp && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange("firstName")}
                    placeholder="John"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ocean/50 focus:border-ocean"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange("lastName")}
                  placeholder="Doe"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ocean/50 focus:border-ocean"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={handleInputChange("email")}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ocean/50 focus:border-ocean"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={formData.password}
                onChange={handleInputChange("password")}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ocean/50 focus:border-ocean"
              />
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange("confirmPassword")}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ocean/50 focus:border-ocean"
                />
              </div>
            </div>
          )}

          {!isSignUp && (
            <div className="flex justify-end">
              <button type="button" className="text-sm text-ocean hover:underline">
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl text-white font-semibold transition flex items-center justify-center gap-2 group"
            style={{
              backgroundColor: activeRole === "host" ? "var(--color-ocean)" : 
                               activeRole === "client" ? "var(--color-rose)" : 
                               "var(--color-mint)"
            }}
          >
            {isSignUp ? "Create Account" : "Sign In"}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Footer */}
        <div className="px-6 pb-6 text-center">
          <p className="text-sm text-gray-600">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-ocean font-semibold hover:underline"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
