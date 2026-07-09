import { HeroSection } from "@/components/HeroSection";
import { AboutMe } from "@/components/AboutMe";
import { CaseStudies } from "@/components/Projects";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <HeroSection />
      <AboutMe />
      <CaseStudies />
      <ExperienceTimeline />
      <Contact />
    </main>
  );
}
