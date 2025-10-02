// src/pages/HomePage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import PetSection from "../components/petSection";
import Header from '../components/navBar';
import Hero from '../components/hero';
import AboutSection from "../components/aboutSec";
import HomepagePetFoodsSection from '../components/HomepagePetFoodsSection';
import CategoriesSection from '../components/homeCategorySection';
import StatsSection from '../components/statSec';
import FAQSection from '../components/faqSec';
import WhyChooseUs from '../components/whyChoose';
import GallerySection from '../components/gallery';

import Servicehome from '../components/servicehome';
import Footer from "../components/footer";




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
      
      <AboutSection/>
      <CategoriesSection/>
      <StatsSection/>
      <PetSection
        title="Pet Adoption Highlights"
        subtitle="Meet some of our lovely pets waiting for a forever home."
        pets={pets.slice(0, 4)} 
        loading={loading}
        showAllLink={true}
      />
      <Servicehome/>

    
      <HomepagePetFoodsSection/>
      <GallerySection/>
      <FAQSection/>
      <WhyChooseUs/>


      <Footer/>
    </div>
  );
}
