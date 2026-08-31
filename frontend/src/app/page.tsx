import { InitialPageLoader } from "@/components/common/InitialPageLoader";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { AudienceSection } from "@/components/landing/AudienceSection";
import { AssessmentJourney } from "@/components/landing/AssessmentJourney";
import { FeaturedAssessments } from "@/components/landing/FeaturedAssessments";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { AssessmentDimensions } from "@/components/landing/AssessmentDimensions";
import { MultiDimensionSection } from "@/components/landing/MultiDimensionSection";
import { ReportPreview } from "@/components/landing/ReportPreview";
import { InstitutionsSection } from "@/components/landing/InstitutionsSection";
import { ResponsibleGuidance } from "@/components/landing/ResponsibleGuidance";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <InitialPageLoader />
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <AudienceSection />
        <AssessmentJourney />
        <FeaturedAssessments />
        <HowItWorks />
        <AssessmentDimensions />
        <MultiDimensionSection />
        <ReportPreview />
        <InstitutionsSection />
        <ResponsibleGuidance />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
