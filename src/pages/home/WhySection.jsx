import React from 'react';
import { FaArrowRight } from 'react-icons/fa';

const WhySection = () => {
  return (
    <section className="why__area pt-125">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-xxl-5 offset-xxl-1 col-xl-5 offset-xl-1 col-lg-6 col-md-8">
            <div className="why__content pr-50 mt-40">
              <div className="section__title-wrapper mb-30">
                <span className="section__sub-title">Pourquoi Choisir Easy Learn</span>
                <h2 className="section__title">
                  Outils pour <span className="yellow-bg yellow-bg-big">Enseignants<img src="./assets/img/yellow-bg.png" alt="Yellow Shape" /></span> et Apprenants
                </h2>
                <p>Easy Learn offre une gamme complète d'outils éducatifs innovants, conçus pour améliorer l'expérience d'apprentissage et d'enseignement. Profitez de nos fonctionnalités avancées pour optimiser vos parcours et ressources éducatives.</p>
              </div>
              <div className="why__btn">
                <a className="e-btn e-btn-3 mr-30" href="/contact">Rejoignez-nous Gratuitement</a>
              </div>
            </div>
          </div>
          <div className="col-xxl-5 col-xl-5 col-lg-6 col-md-8">
            <div className="why__thumb">
              <img src="./assets/img/why/why.png" alt="Why" />
              <img className="why-green" src="./assets/img/why/why-shape-orange.png" alt="Why Shape Orange" />
              <img className="why-pink" src="./assets/img/why/why-shape-blue.png" alt="Why Shape Blue" />
              <img className="why-dot" src="./assets/img/why/why-shape-dot.png" alt="Why Shape Dot" />
              <img className="why-line" src="./assets/img/why/why-shape-line.png" alt="Why Shape Line" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhySection;
