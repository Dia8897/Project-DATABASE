// // import EventCard from "./components/EventCard";
// import Navbar from "./components/Navbar";
// import "bootstrap/dist/css/bootstrap.min.css";
// import Hero from "./components/Hero"
// import Features from "./components/Features"
// import AboutUs from "./components/AboutUs"
// import Footer from "./components/Footer"
// import SignIn from "./components/SignIn"
// import React, { useState } from "react";
// import EventsSection from "./components/EventsSection";



// export default function Home() {
//   const [showModal, setShowModal] = useState(false);


//   const [loggedIn, setLoggedIn] = useState(false);
//   const handleLoginSuccess = () => {
//   setLoggedIn(true);
//   closeModal(); 
// };



//   const openModal = () => setShowModal(true);
//   const closeModal = () => setShowModal(false);

//   const sampleEvent = {
//     title: "Gala Night - Charity",
//     date: "2026-01-15",
//     location: "Ritz Ballroom",
//     dress: "Black Tie",
//     hostsAdmitted: 12,
//     hostsRequested: 20,
//     shortDescription: "A charity gala with VIP guests.",
//     image: "/images/gala.jpg",
//   };

//   return (
//     <main className="p-6 grid place-items-center min-h-screen bg-gray-50">
//       {/* <EventCard
//         event={sampleEvent}
//         onApply={(e) => console.log("Apply clicked:", e.title)}
//         onRequestDress={(e) => console.log("Dress requested for:", e.title)}
//       /> */}
//       <Navbar onJoinClick={openModal} />
//       <Hero onJoinClick={openModal} />
//       <Features />
//       <AboutUs />
//       <Footer />
//       <SignIn show={showModal} onClose={closeModal} onLoginSuccess={handleLoginSuccess} />
//       {loggedIn && (
//     <EventsSection
//         events={[
//             {
//                 title: "Gala Night",
//                 date: "2026-01-15",
//                 location: "Ritz Ballroom",
//                 hostsAdmitted: 12,
//                 hostsRequested: 20,
//             },
//             {
//                 title: "VIP Fashion Show",
//                 date: "2026-03-10",
//                 location: "Beirut Waterfront",
//                 hostsAdmitted: 6,
//                 hostsRequested: 15,
//             },
//             {
//                 title: "Corporate Dinner",
//                 date: "2026-02-05",
//                 location: "Phoenicia Hotel",
//                 hostsAdmitted: 5,
//                 hostsRequested: 10,
//             },
//         ]}
//         onViewDetails={(ev) => alert("Details for: " + ev.title)}
//     />
// )}


//     </main>
//   );
// }

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EventsPage from "./Pages/EventsPage";
import HomePage from "./Pages/HomePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
