import React, { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import Ratio from "react-bootstrap/Ratio";
import "./TestimonialStyle.css";
import { BsCheckCircleFill } from "react-icons/bs"; // Icône de validation

const TestimonialSection = () => {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };
  return (
    <section className="testimonial__area">
      <Carousel
        activeIndex={index}
        onSelect={handleSelect}
        controls={true}
        indicators={true}
        interval={null}
      >
        {/* Premier Slide */}
        <Carousel.Item>
          <div className="container">
            <div className="row align-items-center">
              {/* Colonne pour la photo */}
              <div className="col-md-5 d-flex justify-content-center" >
                <div  className="display-slide" style={{ width: 440, height: 530 }}>
                  <div className="testimonial_img1 ml-3">
                    <Ratio>
                      <embed src={"/images/Learning-pana.png"} />
                    </Ratio>
                  </div>
                </div>
              </div>
              {/* Colonne pour le texte */}
              <div className="testimonial__text col-md-6">
                <h2 style={{ color: "#1e80c9" }}>
                  Rejoignez EasyLearn en tant que Apprenant
                </h2>
                <div className="features-list-container mt-40">
                  <ul className="features-list features-list-one">
                    <li>
                      <div className="icon-wrapper">
                        <BsCheckCircleFill className="icon" />
                      </div>
                      Profitez d'outils puissants pour gérer, partager et
                      collaborer sur vos ressources pédagogiques.
                    </li>
                    <li>
                      <div className="icon-wrapper">
                        <BsCheckCircleFill className="icon" />
                      </div>
                      Suivez vos parcours académiques et de formation continue
                      de manière structurée.
                    </li>
                    <li>
                      <div className="icon-wrapper">
                        <BsCheckCircleFill className="icon" />
                      </div>
                      Communiquez facilement grâce à notre messagerie intégrée.
                    </li>
                    <li>
                      <div className="icon-wrapper">
                        <BsCheckCircleFill className="icon" />
                      </div>
                      Personnalisez votre profil pour une expérience sur mesure.
                    </li>
                  </ul>
                  <ul className="features-list features-list-two">
                    <li>
                      <div className="icon-wrapper">
                        <BsCheckCircleFill className="icon" />
                      </div>
                      Trouvez rapidement les informations et contacts essentiels 
                      grâce à notre recherche avancée.
                    </li>
                    <li>
                      <div className="icon-wrapper">
                        <BsCheckCircleFill className="icon" />
                      </div>
                      Trouvez des coachs spécialisés pour vous guider tout au
                      long de votre parcours éducatif.
                    </li>
                    <li>
                      <div className="icon-wrapper">
                        <BsCheckCircleFill className="icon" />
                      </div>
                      Profitez de toutes les fonctionnalités même hors ligne, 
                      pour une productivité continue, où que vous soyez.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Carousel.Item>

        {/* Deuxième Slide */}
        <Carousel.Item>
          <div className="container">
            <div className="row align-items-center">
              {/* Colonne pour la photo */}
              <div className="col-md-5 ml-50 ">
                <div  className="display-slide"style={{ width: 450, height: 500 }} >
                  <Ratio className="testimonial_img2 ml-45">
                    <embed src={"/images/Webinar-pana.png"} />
                  </Ratio>
                </div>
              </div>
              {/* Colonne pour le texte */}
              <div className="testimonial__text col-md-6 ">
                <h2 style={{ color: "#10266f" }}>
                  Rejoignez EasyLearn en tant que Enseignant
                </h2>{" "}
                <br />
                <ul className="features-list features-list-three ml-30">
                  <li>
                    <div className="icon-wrapper">
                      <BsCheckCircleFill className="icon" />
                    </div>
                    Devenez un coach personnel pour chaque apprenant, les
                    guidant à travers leur parcours éducatif.
                  </li>
                  <li>
                    <div className="icon-wrapper">
                      <BsCheckCircleFill className="icon" />
                    </div>
                    Offrez une motivation constante et répondez aux questions
                    pour aider les apprenants à réussir.
                  </li>
                  <li>
                    <div className="icon-wrapper">
                      <BsCheckCircleFill className="icon" />
                    </div>
                    Profitez d'une vue d'ensemble des progrès des apprenants
                    avec des outils de communication instantanés.
                  </li>
                  <li>
                    <div className="icon-wrapper">
                      <BsCheckCircleFill className="icon" />
                    </div>
                    Recevez un suivi personnalisé pour aider les apprenants à
                    atteindre leurs objectifs académiques et de formation
                    continue.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Carousel.Item>
      </Carousel>
    </section>
  );
};
export default TestimonialSection;
