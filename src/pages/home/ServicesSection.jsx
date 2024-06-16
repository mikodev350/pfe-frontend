import React from 'react';
import { FaBook, FaBriefcase, FaSlack, FaFlask } from 'react-icons/fa';

// Define the styles as JavaScript variables
const servicesItemStyle = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  marginBottom: '30px',
  padding: '20px',
  borderRadius: '8px',
  textAlign: 'center',
};

const serviceIconStyle = {
  fontSize: '2em',
  marginBottom: '10px',
};

const serviceTitleStyle = {
  fontSize: '1.5em',
  marginBottom: '10px',
};

const serviceLinkStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  fontSize: '1em',
  color: 'inherit',
  textDecoration: 'none',
};

const ServicesSection = () => {
  return (
    <section className="services__area pt-115 pb-40">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xxl-6 offset-xxl-3 col-xl-6 offset-xl-3">
            <div className="section__title-wrapper section-padding mb-60 text-center">
              <h2 className="section__title">
                Pourquoi <span className="yellow-bg">Easy learn <img src="./assets/img/yellow-bg-2.png" alt="" /></span> est unique ?
              </h2>
              <p>Apprenez à votre rythme avec notre soutien constant et personnalisé.</p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6">
            <div className="services__item blue-bg-4" style={servicesItemStyle}>
              <div className="services__icon" style={serviceIconStyle}>
                <FaBook />
              </div>
              <div className="services__content">
                <h3 className="services__title" style={serviceTitleStyle}>
                  <a href="/about" style={serviceLinkStyle}>Gestion des <br /> Parcours d'Apprentissage</a>
                </h3>
                <p>Configurez et gérez facilement vos parcours académiques et de formation continue.</p>
              </div>
            </div>
          </div>
          <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6">
            <div className="services__item pink-bg" style={servicesItemStyle}>
              <div className="services__icon" style={serviceIconStyle}>
                <FaBriefcase />
              </div>
              <div className="services__content">
                <h3 className="services__title" style={serviceTitleStyle}>
                  <a href="/about" style={serviceLinkStyle}>Gestion des <br /> Ressources Éducatives</a>
                </h3>
                <p>Accédez et organisez vos ressources pédagogiques de manière efficace.</p>
              </div>
            </div>
          </div>
          <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6">
            <div className="services__item purple-bg" style={servicesItemStyle}>
              <div className="services__icon" style={serviceIconStyle}>
                <FaSlack />
              </div>
              <div className="services__content">
                <h3 className="services__title" style={serviceTitleStyle}>
                  <a href="/about" style={serviceLinkStyle}>Support <br /> et Collaboration</a>
                </h3>
                <p>Connectez-vous avec vos enseignants et pairs pour un soutien continu.</p>
              </div>
            </div>
          </div>
          <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6">
            <div className="services__item green-bg" style={servicesItemStyle}>
              <div className="services__icon" style={serviceIconStyle}>
                <FaFlask />
              </div>
              <div className="services__content">
                <h3 className="services__title" style={serviceTitleStyle}>
                  <a href="/about" style={serviceLinkStyle}>Suivi <br /> Éducatif</a>
                </h3>
                <p>Suivez et évaluez votre progression académique et professionnelle.</p>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
