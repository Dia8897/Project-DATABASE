import AdminCard from "../components/AdminCard"
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AdminHero from "../components/AdminHero";

export default function AdminPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <Navbar/>
      <AdminHero />
      <AdminCard />
      <Footer/>
    </main>
  );
}
