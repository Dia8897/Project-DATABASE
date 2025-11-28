import React from "react";

// Navbar.jsx (no external icon dependency)
// Inline SVGs used for hamburger / close icons so no extra install required.

function MenuIcon({ size = 24 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function CloseIcon({ size = 24 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default function Navbar({ onJoinClick }) {
    const [open, setOpen] = React.useState(false);
    const toggleMenu = () => setOpen(!open);

    return (
        <header className="w-full fixed top-0 left-0 z-50 bg-[#D9A299] shadow-sm">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Logo */}
                <div className="text-2xl font-bold text-white select-none">
                    Gatherly
                </div>

                {/* Desktop Links */}
                <ul className="hidden md:flex items-center space-x-8 text-gray-700 font-medium">
                    <li className="hover:text-white transition cursor-pointer">Home</li>
                    <li className="hover:text-white transition cursor-pointer">About</li>
                    <li className="hover:text-white transition cursor-pointer">Our Events</li>
                    <li className="hover:text-white transition cursor-pointer">Contact</li>
                </ul>


                <div className="hidden md:flex space-x-4">
                    <button onClick={onJoinClick}
                        className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg font-medium transition hover:bg-indigo-50">
                        Log in
                    </button>
                    <button onClick={onJoinClick}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium transition hover:bg-indigo-700">
                        Sign up
                    </button>
                </div>


                <button
                    className="md:hidden p-2 text-gray-700"
                    onClick={toggleMenu}
                    aria-label={open ? "Close menu" : "Open menu"}
                >
                    {open ? <CloseIcon size={28} /> : <MenuIcon size={28} />}
                </button>
            </nav>

            {/* Mobile Menu */}
            {open && (
                <div className="md:hidden bg-white shadow-md">
                    <ul className="px-6 py-4 space-y-4 text-gray-700 font-medium">
                        <li className="hover:text-indigo-600 transition cursor-pointer">Home</li>
                        <li className="hover:text-indigo-600 transition cursor-pointer">About</li>
                        <li className="hover:text-indigo-600 transition cursor-pointer">Our Events</li>
                        <li className="hover:text-indigo-600 transition cursor-pointer">Contact</li>
                    </ul>

                    <div className="border-t px-6 py-4 space-y-3">
                        <button className="w-full px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg font-medium transition hover:bg-indigo-50">
                            Log in
                        </button>
                        <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium transition hover:bg-indigo-700">
                            Sign up
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}
