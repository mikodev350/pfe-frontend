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
import SideBarMobile from "../../components/sideBar/sideBarMobile/SideBarMobile";
import CustomHeader from "./other-header";

export default function Home() {
  return (
    <>
       <Helmet>
        <link rel="stylesheet" type="text/css" href="/css/customHome.css" />
      </Helmet>
      <CustomHeader /> {/* CustomHeader doit être rendu en premier */}
      <SideBarMobile /> {/* SideBarMobile peut suivre CustomHeader */}
      <section id="hero">
        <HeroSection />
      </section>
      <section id="services">
        <ServicesSection />
      </section>
      <section id="about">
        <AboutSection />
      </section>
      <section id="what">
        <WhatSection />
      </section>
      <section id="why">
        <WhySection />
      </section>
      <section id="proud">
        <ProudSection />
      </section>
      <section id="testimonial">
        <TestimonialSection />
      </section>
      <br />
      <section id="cta">
        <CTASection />
      </section>
      <br />
      <br />
      <Footer />
    </>
  );
}
