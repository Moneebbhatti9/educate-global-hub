import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import UserTypeSection from "@/components/UserTypeSection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <UserTypeSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
