import Header from '../components/navBar';
import Hero from '../components/hero';
import AboutSection from "../components/aboutSec";
import Footer from '../components/footer';

export default function HomePage() {
  return (
    <div className="h-screen w-full">
      <Header/>
      <Hero />
      <AboutSection/>
      <Footer/>

    </div>
    
  );
}