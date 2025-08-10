import Navigation from "@/app/components/navigation";
import HeroSection from "@/app/components/heroSection";
import FeaturesSection from "@/app/components/featureSection";
import Footer from "@/app/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Navigation currentPage="home" />

      <HeroSection
        title={
          <>
            Welcome to <span className="text-orange-600">Vesuvius</span>
          </>
        }
        subtitle="Experience the finest flavors with our carefully crafted dishes made from fresh, local ingredients."
        showButtons={true}
      />

      <FeaturesSection />

      <Footer />
    </div>
  );
}
