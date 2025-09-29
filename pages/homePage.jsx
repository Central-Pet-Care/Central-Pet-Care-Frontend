import Header from '../components/navBar';
import Hero from '../components/hero';
import AboutSection from "../components/aboutSec";
import Footer from '../components/footer';
import HomepagePetFoodsSection from '../components/HomepagePetFoodsSection';
import CategoriesSection from '../components/homeCategorySection';
import StatsSection from '../components/statSec';
import FAQSection from '../components/faqSec';
import WhyChooseUs from '../components/whyChoose';
import GallerySection from '../components/gallery';


export default function HomePage() {
  return (
    <div className="h-screen w-full">
      <Header/>
      <Hero />
      <AboutSection/>
      <CategoriesSection/>
      <StatsSection/>
      <HomepagePetFoodsSection/>
      <GallerySection/>
      <FAQSection/>
      <WhyChooseUs/>
      <Footer/>
    </div>
    
  );
}