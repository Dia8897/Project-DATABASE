import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function MenuIcon({ size = 24 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function CloseIcon({ size = 24 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function UserIcon({ size = 24 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default function Navbar({ isLoggedIn = false, userType = null }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleProfileClick = () => navigate("/profile");
    const handleLogout = () => navigate("/");

    return (
        <header className="w-full fixed top-0 left-0 z-50 bg-rose shadow-sm">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-white select-none">
                    Gatherly
                </Link>

                {/* Desktop Links */}
                <ul className="hidden md:flex items-center space-x-8 text-gray-700 font-medium">
                    <li><Link to="/" className="hover:text-white transition">Home</Link></li>
                    <li className="hover:text-white transition cursor-pointer">About</li>
                    <li><Link to="/events" className="hover:text-white transition">Our Events</Link></li>
                    <li className="hover:text-white transition cursor-pointer">Contact</li>
                </ul>

                {/* Auth Section - Only shows when logged in */}
                <div className="hidden md:flex items-center space-x-4">
                    {isLoggedIn && (
                        <>
                            <button
                                onClick={handleProfileClick}
                                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition"
                                title="View Profile"
                            >
                                <UserIcon size={20} />
                            </button>
                            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium uppercase">
                                {userType}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 border border-white/50 text-white rounded-lg font-medium transition hover:bg-white/10"
                            >
                                Log out
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-white"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <CloseIcon size={28} /> : <MenuIcon size={28} />}
                </button>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white shadow-lg">
                    <ul className="px-6 py-4 space-y-4 text-gray-700 font-medium">
                        <li><Link to="/" className="hover:text-ocean transition block">Home</Link></li>
                        <li className="hover:text-ocean transition cursor-pointer">About</li>
                        <li><Link to="/events" className="hover:text-ocean transition block">Our Events</Link></li>
                        <li className="hover:text-ocean transition cursor-pointer">Contact</li>
                    </ul>

                    {isLoggedIn && (
                        <div className="border-t px-6 py-4 space-y-3">
                            <button
                                onClick={handleProfileClick}
                                className="w-full px-4 py-3 bg-ocean text-white rounded-lg font-medium flex items-center justify-center gap-2"
                            >
                                <UserIcon size={18} />
                                View Profile
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full px-4 py-3 border border-ocean text-ocean rounded-lg font-medium"
                            >
                                Log out
                            </button>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}
