import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";
import Experience from "@/components/Experience";
import Emprendimiento from "@/components/Emprendimiento";
import TrabajaConmigo from "@/components/TrabajaConmigo";
import Contact from "@/components/Contact";
import Skills from "@/components/Skills";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="contenido" tabIndex={-1} className="outline-none">
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Emprendimiento />
        <Testimonials />
        <TrabajaConmigo />
        <Contact />
        <Skills />
      </main>
      <Footer />
    </>
  );
}
