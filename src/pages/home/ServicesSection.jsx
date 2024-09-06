import React, { useRef } from 'react';
import { FaBook, FaRoute, FaEnvelope, FaChalkboardTeacher, FaBell, FaUser, FaSearch, FaChartPie, FaEdit, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Définir les styles en tant que variables JavaScript
const servicesItemStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center', // Centrer verticalement
  alignItems: 'center', // Centrer horizontalement
  margin: '0 10px', // Garder les marges des cartes
  padding: '20px', // Taille initiale des cartes
  borderRadius: '18px',
  textAlign: 'center',
  boxShadow: 'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
  flex: '0 0 auto', // Taille des cartes non ajustée
  maxWidth: '200px',
  minWidth: '200px',
  transition: 'transform 0.3s ease-in-out',
};
const serviceIconStyle = {
  fontSize: '2em', // Taille des icônes gardée
  marginBottom: '10px',
};
const serviceTitleStyle = {
  fontSize: '1.2em', // Taille des titres gardée
  marginBottom: '10px',
};
const serviceLinkStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  fontSize: '1em', // Taille du texte des liens gardée
  color: 'inherit',
  textDecoration: 'none',
};

// Modifier le style pour masquer la barre de défilement et gérer le débordement
const scrollContainerStyle = {
  display: 'flex',
  flexWrap: 'nowrap', // Éviter le retour à la ligne
  justifyContent: 'flex-start', // Aligner les éléments sur la gauche
  alignItems: 'center', // Centrer verticalement
  overflowX: 'hidden', // Masquer la barre de défilement
  padding: '10px 0',
  scrollBehavior: 'smooth',
  scrollbarWidth: 'none', // Masquer la barre de défilement pour Firefox
};

// Masquer la barre de défilement pour Chrome, Safari et Edge
const scrollContainerWebkitStyle = {
  ...scrollContainerStyle,
  '&::-webkit-scrollbar': {
    display: 'none', // Masquer la barre de défilement pour Webkit
  },
};

// Styles pour les flèches de défilement, AUGMENTER leur taille
const arrowStyle = {
  fontSize: '3em', // Augmenter la taille des flèches
  cursor: 'pointer',
  padding: '10px',
  color: '#10266f', // Assurez-vous qu'elles sont bien visibles
  margin: '0 20px', // Espacement entre les flèches et les cartes
};

// Styles pour la section de titre
const sectionTitleWrapperStyle = {
  padding: '20px 0',
  marginBottom: '30px',
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
};
const sectionTitleStyle = {
  fontSize: '2.5em',
  fontWeight: 'bold',
  color: '#10266f',
  marginBottom: '15px',
};
const sectionSubtitleStyle = {
  fontSize: '1.2em',
  marginBottom: '20px',
  maxWidth: '700px',
};

const ServicesSection = () => {
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    scrollContainerRef.current.scrollBy({
      left: -300, // Ajuster la vitesse du défilement
      behavior: 'smooth',
    });
  };

  const scrollRight = () => {
    scrollContainerRef.current.scrollBy({
      left: 300, // Ajuster la vitesse du défilement
      behavior: 'smooth',
    });
  };

  return (
    <section className="services__area pt-80 pb-40">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xxl-5">
            <div className="section__title-wrapper section-padding mb-60 text-center" style={sectionTitleWrapperStyle}>
              <h2 className="section__title mb-15" style={sectionTitleStyle}>
                Découvrez les fonctionnalités de <span className="yellow-bg">EasyLearn <img src="./assets/img/yellow-bg-2.png" alt="" /></span>
              </h2>
              <p style={sectionSubtitleStyle}>Avec EasyLearn, profitez d'une expérience d'apprentissage enrichie grâce à nos outils innovants et faciles à utiliser.</p>
            </div>
          </div>
        </div>
        <div className="services__scroll-container mb-90" style={{ display: 'flex', alignItems: 'center' }}>
          <FaChevronLeft style={arrowStyle} onClick={scrollLeft} />
          <div className="services__items" ref={scrollContainerRef} style={scrollContainerStyle}>
            <div className="services__item" style={{ ...servicesItemStyle, backgroundColor: '#10266f' }}>
              <div className="services__icon" style={serviceIconStyle}>
                <FaBook />
              </div>
              <div className="services__content">
                <h3 className="services__title" style={serviceTitleStyle}>
                  <a href="/about" style={serviceLinkStyle}>Gestion des <br /> Ressources</a>
                </h3>
                <p>Créez, gérez et partagez des documents, vidéos et autres ressources pédagogiques.</p>
              </div>
            </div>
            <div className="services__item" style={{ ...servicesItemStyle, backgroundColor: '#1e80c9' }}>
              <div className="services__icon" style={serviceIconStyle}>
                <FaRoute />
              </div>
              <div className="services__content">
                <h3 className="services__title" style={serviceTitleStyle}>
                  <a href="/about" style={serviceLinkStyle}>Parcours d'<br />Apprentissage</a>
                </h3>
                <p>Suivez des parcours d'apprentissage structurés pour une progression optimale.</p>
              </div>
            </div>
            <div className="services__item" style={{ ...servicesItemStyle, backgroundColor: '#59bcf3' }}>
              <div className="services__icon" style={serviceIconStyle}>
                <FaEnvelope />
              </div>
              <div className="services__content">
                <h3 className="services__title" style={serviceTitleStyle}>
                  <a href="/about" style={serviceLinkStyle}>Messagerie</a>
                </h3>
                <p>Communiquez facilement avec des messages privés ou de groupe.</p>
              </div>
            </div>
            <div className="services__item" style={{ ...servicesItemStyle, backgroundColor: '#eea129' }}>
              <div className="services__icon" style={serviceIconStyle}>
                <FaChalkboardTeacher />
              </div>
              <div className="services__content">
                <h3 className="services__title" style={serviceTitleStyle}>
                  <a href="/about" style={serviceLinkStyle}>Suivi <br />Pédagogique</a>
                </h3>
                <p>Suivez et évaluez les progrès des apprenants, avec des feedbacks personnalisés.</p>
              </div>
            </div>
            <div className="services__item" style={{ ...servicesItemStyle, backgroundColor: '#10266f' }}>
              <div className="services__icon" style={serviceIconStyle}>
                <FaEdit />
              </div>
              <div className="services__content">
                <h3 className="services__title" style={serviceTitleStyle}>
                  <a href="/about" style={serviceLinkStyle}>Travaux remis <br />(Quiz)</a>
                </h3>
                <p>Soumettez et corrigez des travaux sous forme de quiz facilement.</p>
              </div>
            </div>
            <div className="services__item" style={{ ...servicesItemStyle, backgroundColor: '#1e80c9' }}>
              <div className="services__icon" style={serviceIconStyle}>
                <FaBell />
              </div>
              <div className="services__content">
                <h3 className="services__title" style={serviceTitleStyle}>
                  <a href="/about" style={serviceLinkStyle}>Notifications</a>
                </h3>
                <p>Recevez des notifications pour les nouvelles ressources, messages, et événements.</p>
              </div>
            </div>
            <div className="services__item" style={{ ...servicesItemStyle, backgroundColor: '#59bcf3' }}>
              <div className="services__icon" style={serviceIconStyle}>
                <FaUser />
              </div>
              <div className="services__content">
                <h3 className="services__title" style={serviceTitleStyle}>
                  <a href="/about" style={serviceLinkStyle}>Profils <br />Utilisateur</a>
                </h3>
                <p>Personnalisez votre profil avec vos informations et préférences.</p>
              </div>
            </div>
            <div className="services__item" style={{ ...servicesItemStyle, backgroundColor: '#eea129' }}>
              <div className="services__icon" style={serviceIconStyle}>
                <FaSearch />
              </div>
              <div className="services__content">
                <h3 className="services__title" style={serviceTitleStyle}>
                  <a href="/about" style={serviceLinkStyle}>Recherche <br /> Avancée</a>
                </h3>
                <p>Trouvez rapidement des ressources et utilisateurs avec des filtres avancés.</p>
              </div>
            </div>
            <div className="services__item" style={{ ...servicesItemStyle, backgroundColor: '#10266f' }}>
              <div className="services__icon" style={serviceIconStyle}>
                <FaChartPie />
              </div>
              <div className="services__content">
                <h3 className="services__title" style={serviceTitleStyle}>
                  <a href="/about" style={serviceLinkStyle}>Tableau de <br /> Bord</a>
                </h3>
                <p>Accédez rapidement à toutes les fonctionnalités depuis une interface centralisée.</p>
              </div>
            </div>
          </div>
          <FaChevronRight style={arrowStyle} onClick={scrollRight} />
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
