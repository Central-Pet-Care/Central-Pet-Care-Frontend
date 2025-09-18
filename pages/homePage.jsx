import axios from "axios";
import Header from '../components/navBar';
import Hero from '../components/hero';
import { Toaster } from 'react-hot-toast'
import AboutSection from "../components/aboutSec";

export default function HomePage() {
  return (
    <div className="h-screen w-full">
      <Header/>
      <Hero />
      <AboutSection/>

    </div>
    
  );
}