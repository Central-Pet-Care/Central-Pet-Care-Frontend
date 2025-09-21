import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/navBar";
import Hero from "../components/hero";
import AboutSection from "../components/aboutSec";
import { Toaster } from "react-hot-toast";
import PetCard from "../components/petCard";

export default function HomePage() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPets() {
      try {
        const res = await axios.get("http://localhost:5000/api/pets");
        setPets(res.data);
      } catch (err) {
        console.error("Error fetching pets:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPets();
  }, []);

  return (
    <div className="w-full">
      <Header />
      <Hero />
      <AboutSection />
      <Toaster />

      {/* Pets Section */}
      <section className="px-6 py-10 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-8">
          Available Pets
        </h2>

        {loading ? (
          // ✅ Loading Spinner
          <div className="min-h-[200px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-purple-600"></div>
          </div>
        ) : pets.length === 0 ? (
          // ✅ No Pets Message
          <p className="text-center text-gray-500">
            No pets available right now.
          </p>
        ) : (
          // ✅ Pets Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center max-w-5xl mx-auto">
            {pets.map((pet) => (
              <PetCard key={pet.petId} pet={pet} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
