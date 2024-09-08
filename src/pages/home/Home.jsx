import React from "react";
import { Helmet } from "react-helmet";

import HeroSection from "./HeroSection";
import ServicesSection from "./ServicesSection";
import AboutSection from "./AboutSection";
import WhySection from "./WhySection";
import ProudSection from "./ProudSection";
import TestimonialSection from "./TestimonialSection";
import CTASection from "./CTASection";
import Footer from "../../components/footer/Footer";
import SideBarMobile from "../../components/sideBar/sideBarMobile/SideBarMobile";
import CustomHeader from "./other-header";

import styled from "styled-components";
import { FaArrowUp } from "react-icons/fa";

const ButtonTop = styled.div`
  width: 45px;
  height: 45px;
  cursor: pointer;
  display: flex;
  align-items: center; /* Center vertically */
  justify-content: center; /* Center horizontally */
  position: fixed;
  right: 10px;
  bottom: 10px;
  z-index: 100;
  background-color: #10266f;
  border-radius: 12px;
  &:hover {
    opacity: 0.8;
  }
`;
export default function Home() {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <>
      <Helmet>
        <link rel="stylesheet" type="text/css" href="/css/customHome.css" />
      </Helmet>
      <CustomHeader /> {/* CustomHeader doit être rendu en premier */}
      <SideBarMobile /> {/* SideBarMobile peut suivre CustomHeader */}
      {/* ************ header section ******* */}
      <section id="hero" style={{ marginTop: "100px" }}>
        <HeroSection />
      </section>
      {/* ************ c quoi easylearn section ******* */}
      <section id="why">
        <WhySection />
      </section>
      {/* ************ app + ens section ******* */}
      <section id="testimonial">
        <TestimonialSection />
      </section>
      {/* ************ fonctionalite section ******* */}
      <section id="services">
        <ServicesSection />
      </section>
      {/* ************ titre section  ******* */}
      <section id="proud">
        <ProudSection />
      </section>
      <br />
      {/* ************ devloppeur section ******* */}
      <section id="about">
        <AboutSection />
      </section>
      <section id="cta">
        <CTASection />
      </section>
      <br />
      <br />
            {/* ************ footer section ******* */}

      <Footer />
      {isVisible && (
        <ButtonTop onClick={handleScrollToTop}>
          <FaArrowUp color="white" size={29} />
        </ButtonTop>
      )}
    </>
  );
}
