import React from 'react';
import { FaCheck } from 'react-icons/fa';

const AboutSection = () => {
  return (
    <section className="about__area pt-90 pb-150">
      <div className="container">
        <div className="row">
          <div className="col-xxl-5 offset-xxl-1 col-xl-6 col-lg-6">
            <div className="about__thumb-wrapper">
              <div className="about__thumb ml-100">
                <img src="./assets/img/about/about.jpg" alt="About" />
              </div>
            </div>
          </div>
          <div className="col-xxl-6 col-xl-6 col-lg-6">
            <div className="about__content pl-70 pr-60 pt-25">
              <div className="section__title-wrapper mb-25">
                <h2 className="section__title">
                  Atteignez Vos <br />
                  <span className="yellow-bg-big">Objectifs <img src="./assets/img/yellow-bg-2.png" alt="Yellow Shape" /></span> avec Easy Learn 
                </h2>
                <p>Améliorez vos compétences et votre savoir-faire grâce à notre plateforme d'apprentissage en ligne. Bénéficiez d'un accompagnement personnalisé pour atteindre vos objectifs académiques et professionnels.</p>
              </div>
              <div className="about__list mb-35">
                <ul>
                  <li className="d-flex align-items-center"><FaCheck className="icon_check" /> &ensp; Gérez vos parcours d'apprentissage.</li>
                  <li className="d-flex align-items-center"><FaCheck className="icon_check" /> &ensp; Accédez et organisez vos ressources éducatives.</li>
                  <li className="d-flex align-items-center"><FaCheck className="icon_check" /> &ensp; Collaborez et recevez du soutien en continu.</li>
                </ul>
              </div>
              <a className="e-btn e-btn-border" href="/register">commencer Maintenant</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
