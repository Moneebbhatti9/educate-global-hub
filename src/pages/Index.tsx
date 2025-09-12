import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import UserTypeSection from "@/components/UserTypeSection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import JobAdRequestForm from "@/components/JobAdRequestForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <UserTypeSection />
        <FeaturesSection />
        {/* Job Advertisement Request Section */}
        {/* <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4">
                Advertise Your Job Opening
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Reach thousands of qualified educators worldwide. Submit your job advertisement request and let us help you find the perfect candidate.
              </p>
            </div>
            <JobAdRequestForm />
          </div>
        </section> */}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
