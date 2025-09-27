// src/pages/HomePage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import PetSection from "../components/petSection";
import AdoptionStats from "../components/adoptionStats";
import Header from '../components/navBar';
import Hero from '../components/hero';
import AboutSection from "../components/aboutSec";
<<<<<<< HEAD
import Footer from "../components/footer";




=======
import Servicehome from '../components/servicehome';
import { Toaster } from "react-hot-toast";
import Footer from "../components/footer";
>>>>>>> 80c23b4e49f18729b280581aa28538eff9ad48b3


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


    
      <Toaster />
      <AdoptionStats/>

      <PetSection
        title="Pet Adoption Highlights"
        subtitle="Meet some of our lovely pets waiting for a forever home."
        pets={pets.slice(0, 5)} 
        loading={loading}
        showAllLink={true}
      />

      <AboutSection/>
      <Servicehome></Servicehome>
      <Footer/>

      
    </div>
  );
}
