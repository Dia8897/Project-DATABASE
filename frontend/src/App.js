import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EventsPage from "./Pages/EventsPage";
import HomePage from "./Pages/HomePage";
import AdminPage from "./Pages/AdminPage";
import ClientPage from "./Pages/ClientPage";
import HostProfilePage from "./Pages/HostProfilePage";
import TeamLeaderEventPage from "./Pages/TeamLeaderEventPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/client" element={<ClientPage />} />
        <Route path="/profile" element={<HostProfilePage />} />
        <Route path="/profile/:hostId" element={<HostProfilePage />} />
        <Route path="/team-leader/event/:eventId" element={<TeamLeaderEventPage />} />
      </Routes>
    </Router>
  );
}

export default App;
