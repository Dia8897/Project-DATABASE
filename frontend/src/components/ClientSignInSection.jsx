import React from "react";

export default function ClientSignInSection({
  clientName,
  email,
  isSignedIn,
  onNameChange,
  onEmailChange,
  onSignIn,
}) {
  return (
    <section className="border rounded-xl p-6 shadow-sm bg-white">
      <h2 className="text-xl font-semibold mb-4">Sign in as Client</h2>

      <form className="space-y-4" onSubmit={onSignIn}>
        <div>
          <label className="block text-sm font-medium mb-1">Full name</label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2"
            value={clientName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="e.g. Nour Haddad"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full border rounded-lg px-3 py-2"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          {isSignedIn ? "Signed in ✔" : "Sign in"}
        </button>

        {isSignedIn && (
          <p className="text-sm text-green-600 mt-2">
            Signed in as <span className="font-semibold">{clientName}</span>
          </p>
        )}
      </form>
    </section>
  );
}
