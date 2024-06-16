import React from "react";
import { Helmet } from "react-helmet";
import Header from "./other-header";
import SidebarHome from "./SidebarHome";
import HeroSection from "./HeroSection";
import ServicesSection from "./ServicesSection";
import AboutSection from "./AboutSection";
import WhySection from "./WhySection";
import WhatSection from "./WhatSection";
import ProudSection from "./ProudSection";
import TestimonialSection from "./TestimonialSection";
import CTASection from "./CTASection";
import Footer from "../../components/footer/Footer";
import CustomNavbar from "./other-header";

export default function Home() {
  return (
    <>
      <Helmet>
        <link rel="stylesheet" type="text/css" href="/css/customHome.css" />
      </Helmet>
      <CustomNavbar />
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <WhatSection />
      <WhySection />
      <ProudSection />
      <TestimonialSection />
      <br />
      <CTASection />
      <br />
      <Footer />
    </>
  );
}
