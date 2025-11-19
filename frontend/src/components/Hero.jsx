import React from "react";
import { Star, ShieldCheck, Users } from "lucide-react";

// HERO SECTION COMPONENT
// Full-width background, centered title, paragraph, and 3 buttons.
// Also includes a flexbox with 3 informational boxes showing agency value.
// Uses lucide-react icons. Make sure to install: npm install lucide-react

export default function HeroSection({ onJoinClick }) {
    return (
        <section className="w-full bg-indigo-50 pt-32 pb-20 px-4">
            {/* MAIN HERO CONTENT */}
            <div className="max-w-4xl mx-auto text-center">
                {/* Dynamic, Creative Title */}
                <h1 className="text-5xl md:text-6xl font-extrabold text-indigo-800 mb-4 animate-fade-in">
                    Elevate Your Events with Elite Hosts
                </h1>

                {/* Introduction Paragraph */}
                <p className="text-gray-700 text-lg md:text-xl max-w-2xl mx-auto mb-8">
                    Welcome to our hosting agency platform, where professional hosts and event
                    organizers connect seamlessly. Whether you're looking to work as a host,
                    manage events as an admin, or hire talent as a client — we've got you covered.
                </p>

                {/* BUTTONS SECTION */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                    <button onClick={onJoinClick}
                        className="px-6 py-3 bg-indigo-600 text-white text-lg rounded-lg font-medium shadow-md hover:bg-indigo-700 transition">
                        Join as Host
                    </button>

                    <button onClick={onJoinClick}
                        className="px-6 py-3 bg-white border border-indigo-600 text-indigo-700 text-lg rounded-lg font-medium shadow-md hover:bg-indigo-50 transition">
                        Join as Admin
                    </button>

                    <button onClick={onJoinClick}
                        className="px-6 py-3 bg-indigo-100 text-indigo-800 border border-indigo-300 text-lg rounded-lg font-medium shadow-md hover:bg-indigo-200 transition">
                        Join as Client
                    </button>
                </div>
            </div>

            {/* INFORMATION BOXES */}
            <div className="mt-16 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Box 1 */}
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center border-t-4 border-indigo-600 hover:shadow-xl transition">
                    <Star className="mx-auto text-indigo-600 mb-4" size={42} />
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">Top Quality Hosts</h3>
                    <p className="text-gray-600">
                        We provide trained and highly professional hosts ensuring exceptional
                        service for every occasion.
                    </p>
                </div>

                {/* Box 2 */}
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center border-t-4 border-indigo-600 hover:shadow-xl transition">
                    <ShieldCheck className="mx-auto text-indigo-600 mb-4" size={42} />
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">Reliable & Secure System</h3>
                    <p className="text-gray-600">
                        Our platform ensures safe, transparent management for events,
                        applications, and user roles.
                    </p>
                </div>

                {/* Box 3 */}
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center border-t-4 border-indigo-600 hover:shadow-xl transition">
                    <Users className="mx-auto text-indigo-600 mb-4" size={42} />
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">Efficient Collaboration</h3>
                    <p className="text-gray-600">
                        Hosts, leaders, admins, and clients work together seamlessly for
                        smooth event execution.
                    </p>
                </div>
            </div>
        </section>
    );
}