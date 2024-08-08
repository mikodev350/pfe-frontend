import React from 'react';
import { FaBook, FaRoute, FaEnvelope, FaChalkboardTeacher, FaBell, FaUser, FaSearch, FaChartPie, FaEdit } from 'react-icons/fa';

// Définir les styles en tant que variables JavaScript
const servicesItemStyle = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  margin: '0 10px',
  padding: '15px',
  borderRadius: '8px',
  textAlign: 'center',
  flex: '0 0 auto',
  minWidth: '150px',
};

const serviceIconStyle = {
  fontSize: '2em',
  marginBottom: '10px',
};

const serviceTitleStyle = {
  fontSize: '1.2em',
  marginBottom: '10px',
};

const serviceLinkStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  fontSize: '1em',
  color: 'inherit',
  textDecoration: 'none',
};

const scrollContainerStyle = {
  display: 'flex',
  overflowX: 'auto',
  whiteSpace: 'nowrap',
  padding: '10px 0',
  scrollBehavior: 'smooth',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
};

// Styles pour le conteneur du défilement
const scrollContainerWebkitStyle = {
  ...scrollContainerStyle,
  '&::-webkit-scrollbar': {
    display: 'none',
  },
};

// Styles pour la section de titre
const sectionTitleWrapperStyle = {
  padding: '20px 0', // Réduit le padding pour minimiser l'espace
  marginBottom: '30px', // Réduit la marge inférieure pour minimiser l'espace
  textAlign: 'center',
};

const sectionTitleStyle = {
  fontSize: '2.5em',
  fontWeight: 'bold',
  color: '#10266f', // Utilisation du bleu foncé
  marginBottom: '15px', // Réduit la marge inférieure pour minimiser l'espace
};

const sectionSubtitleStyle = {
  fontSize: '1.2em',
  color: '#1e80c9', // Utilisation du bleu moyen
  marginBottom: '20px', // Réduit la marge inférieure pour minimiser l'espace
};

const sectionDescriptionStyle = {
  fontSize: '1em',
  color: '#59bcf3', // Utilisation du bleu clair
  maxWidth: '700px',
  margin: '0 auto',
};

const ServicesSection = () => {
  return (
    <section className="services__area pt-115 pb-40">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xxl-6 offset-xxl-3 col-xl-6 offset-xl-3">
            <div className="section__title-wrapper section-padding mb-60 text-center" style={sectionTitleWrapperStyle}>
              <h2 className="section__title" style={sectionTitleStyle}>
                Découvrez les fonctionnalités de <span className="yellow-bg">EasyLearn <img src="./assets/img/yellow-bg-2.png" alt="" /></span>
              </h2>
              <p style={sectionSubtitleStyle}>Avec EasyLearn, profitez d'une expérience d'apprentissage enrichie grâce à nos outils innovants et faciles à utiliser. Découvrez les fonctionnalités clés qui rendent notre application unique et efficace pour tous vos besoins éducatifs.</p>
              <div style={sectionDescriptionStyle}>
                {/* Optionnel : Vous pouvez ajouter une description plus détaillée ici si nécessaire */}
              </div>
            </div>
          </div>
        </div>
        <div className="services__scroll-container" style={scrollContainerStyle}>
          <div className="services__items" style={{ display: 'flex', flexDirection: 'row', ...scrollContainerWebkitStyle }}>
            <div className="services__item" style={{...servicesItemStyle, backgroundColor: '#10266f'}}>
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
            <div className="services__item" style={{...servicesItemStyle, backgroundColor: '#1e80c9'}}>
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
            <div className="services__item" style={{...servicesItemStyle, backgroundColor: '#59bcf3'}}>
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
            <div className="services__item" style={{...servicesItemStyle, backgroundColor: '#eea129'}}>
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
            <div className="services__item" style={{...servicesItemStyle, backgroundColor: '#10266f'}}>
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
            <div className="services__item" style={{...servicesItemStyle, backgroundColor: '#1e80c9'}}>
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
            <div className="services__item" style={{...servicesItemStyle, backgroundColor: '#59bcf3'}}>
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
            <div className="services__item" style={{...servicesItemStyle, backgroundColor: '#eea129'}}>
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
            <div className="services__item" style={{...servicesItemStyle, backgroundColor: '#10266f'}}>
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
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
