import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import Hero from "@/components/landing/Hero";
import SearchBar from "@/components/landing/SearchBar";
import Categories from "@/components/landing/Categories";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Testimonials from "@/components/landing/Testimonials";
import CTA from "@/components/landing/CTA";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <Hero />

      <SearchBar />

      <Categories />

      <Features />

      <HowItWorks />

      <Testimonials />

      <CTA />

      <Footer />
    </>
  );
}