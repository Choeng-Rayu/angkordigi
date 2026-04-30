import { Hero } from "./sections/Hero";
import { About } from "./sections/About";
import { VisionMissionGoal } from "./sections/VisionMissionGoal";
import { Timeline } from "./sections/Timeline";
import { Services } from "./sections/Services";
import { SolarSystem } from "./sections/SolarSystem";
import { Team } from "./sections/Team";
import { Contact } from "./sections/Contact";
import { Footer } from "./components/layout/Footer";
import { BackToTop } from "./components/ui/BackToTop";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <About />
      <VisionMissionGoal />
      <Timeline />
<Services />
<SolarSystem />
<Team />
      <Contact />
      <Footer />
      <BackToTop />
    </main>
  );
}
