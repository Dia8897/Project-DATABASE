import React, { useState } from "react";

export default function ApplyModal({ event, onClose, onSubmitted }) {
// role: what the user is asking to be FOR THIS EVENT
// "host" or "team_leader"
const [requestedRole, setRequestedRole] = useState("host");
const [requestDress, setRequestDress] = useState(false);
const [submitting, setSubmitting] = useState(false);

const handleSubmit = (e) => {
e.preventDefault();
setSubmitting(true);

// 🔍 For now we just log it – later this will call the backend (EVENT_APP insert)
const payload = {
eventId: event.eventId,
requestedRole, // "host" or "team_leader"
requestDress, // true / false
};

console.log("APPLICATION SUBMITTED (frontend only):", payload);

// Fake delay feeling – but instantly call onSubmitted
setTimeout(() => {
setSubmitting(false);
alert("Application submitted! (frontend only for now)");
if (onSubmitted) onSubmitted();
}, 200);
};

if (!event) return null; // safety

return (
<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
<div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
{/* Title */}
<h2 className="text-xl font-semibold text-gray-800 mb-1">
Apply for {event.title}
</h2>
<p className="text-sm text-gray-500 mb-4">
{event.date} • {event.location}
</p>

{/* FORM */}
<form onSubmit={handleSubmit} className="space-y-4">
{/* Role selection */}
<div>
<p className="text-sm font-medium text-gray-700 mb-2">
Apply as:
</p>
<div className="flex gap-3">
<button
type="button"
onClick={() => setRequestedRole("host")}
className={
"flex-1 px-3 py-2 rounded-lg border text-sm font-semibold " +
(requestedRole === "host"
? "bg-indigo-600 text-white border-indigo-600"
: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50")
}
>
Host
</button>

<button
type="button"
onClick={() => setRequestedRole("team_leader")}
className={
"flex-1 px-3 py-2 rounded-lg border text-sm font-semibold " +
(requestedRole === "team_leader"
? "bg-indigo-600 text-white border-indigo-600"
: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50")
}
>
Team Leader
</button>
</div>
</div>

{/* Dress request */}
<label className="inline-flex items-center gap-2 text-sm text-gray-700">
<input
type="checkbox"
checked={requestDress}
onChange={(e) => setRequestDress(e.target.checked)}
className="rounded border-gray-300"
/>
<span>Request dress for this event</span>
</label>

{/* Buttons */}
<div className="flex justify-end gap-3 pt-2">
<button
type="button"
onClick={onClose}
className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50"
>
Cancel
</button>
<button
type="submit"
disabled={submitting}
className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60"
>
{submitting ? "Submitting…" : "Submit Application"}
</button>
</div>
</form>
</div>
</div>
);
}

