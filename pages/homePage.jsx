// src/pages/HomePage.jsx
import Header from "../components/navBar";
import Hero from "../components/hero";
import AboutSection from "../components/aboutSec";
import { Toaster } from "react-hot-toast";



export default function HomePage() {
 
  return (
    <div className="w-full">
      <Header />
      <Hero />
      <AboutSection />
      <Toaster />

      
    </div>
  );
}