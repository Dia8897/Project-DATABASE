import React, { useState } from "react";

export default function SignInModal({ show, onClose }) {
    const [activeTab, setActiveTab] = useState("host");

    if (!show) return null;

    const tabStyle = (tab) =>
        activeTab === tab
            ? "border-b-2 border-indigo-600 text-indigo-700 font-semibold"
            : "text-gray-500 hover:text-indigo-600 transition";

    return (
        <div
            className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-xl w-full max-w-md p-8 relative"
                onClick={(e) => e.stopPropagation()}
            >

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
                >
                    X
                </button>


                <h2 className="text-3xl font-bold text-center mb-2">Elite Events</h2>
                <p className="text-center text-gray-600 mb-6">
                    Welcome Back — Sign in to access your dashboard
                </p>


                <div className="flex justify-around mb-6 border-b border-gray-200">
                    <button onClick={() => setActiveTab("host")} className={tabStyle("host")}>
                        Host / Team Leader
                    </button>
                    <button onClick={() => setActiveTab("admin")} className={tabStyle("admin")}>
                        Administrator
                    </button>
                    <button onClick={() => setActiveTab("client")} className={tabStyle("client")}>
                        Client
                    </button>
                </div>

                {/* Form */}
                <form className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <button
                        type="submit"
                        className={`py-2 rounded-lg text-white font-semibold transition ${activeTab === "host"
                            ? "bg-indigo-600 hover:bg-indigo-700"
                            : activeTab === "admin"
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        Sign In as{" "}
                        {activeTab === "host"
                            ? "Host"
                            : activeTab === "admin"
                                ? "Administrator"
                                : "Client"}
                    </button>
                </form>
            </div>
        </div>
    );
}
