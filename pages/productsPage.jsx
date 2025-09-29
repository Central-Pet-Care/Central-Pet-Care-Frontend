import CategoriesBanner from "../components/cateBanner";
import Footer from "../components/footer";
import Header from "../components/navBar";
import NutritionSection from "../components/nutritionSec";
import PetAccessories from "../components/petAccessories";
import PetFoods from "../components/petFoods";
import PetMedicines from "../components/petMedicines";
import HeroSection from "../components/shopHero";
import ToysSectionBanner from "../components/toysSectionBanner";

export default function ProductsPage() {
  return (
    <div className="h-screen w-full scroll-smooth">
      <Header />
      <HeroSection />
      <NutritionSection />
      <CategoriesBanner />


      <div id="pet-foods">
        <PetFoods />
      </div>

      <div id="toys">
        <ToysSectionBanner />
      </div>

      <div id="accessories">
        <PetAccessories />
      </div>

      <div id="medicines">
        <PetMedicines />
      </div>

      <Footer />
    </div>
  );
}
