import React from 'react';
import { FaFacebookF, FaTwitter, FaPinterestP, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer>
      <div className="footer__area" style={{ backgroundColor: '#f9f9f9', color: '#2C3E50' }}>
        <div className="footer__top pt-100 pb-60">
          <div className="container">
            <div className="row">
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6">
                <div className="footer__widget mb-50">
                  <div className="footer__widget-head mb-22">
                    <div className="footer__logo">
                      <a href="/">
                        <img src="/assets/img/logo/logo.png" alt="Easy Learn Logo" />
                      </a>
                    </div>
                  </div>
                  <div className="footer__widget-body">
                    <p>Easy Learn vous offre des outils éducatifs de qualité pour optimiser votre apprentissage. Rejoignez-nous et accédez à des ressources diversifiées et à une communauté de professionnels passionnés.</p>
                    <div className="footer__social" style={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                      <ul style={{ display: 'flex', gap: '10px', listStyleType: 'none', padding: 0 }}>
                        <li>
                          <a href="#" className="social-icon" style={{ color: '#fff', backgroundColor: '#3b5998', padding: '10px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FaFacebookF />
                          </a>
                        </li>
                        <li>
                          <a href="#" className="social-icon" style={{ color: '#fff', backgroundColor: '#00acee', padding: '10px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FaTwitter />
                          </a>
                        </li>
                        <li>
                          <a href="#" className="social-icon" style={{ color: '#fff', backgroundColor: '#E60023', padding: '10px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FaPinterestP />
                          </a>
                        </li>
                        <li>
                          <a href="#" className="social-icon" style={{ color: '#fff', backgroundColor: '#C13584', padding: '10px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FaInstagram />
                          </a>
                        </li>
                        <li>
                          <a href="#" className="social-icon" style={{ color: '#fff', backgroundColor: '#0077b5', padding: '10px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FaLinkedin />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6">
                <div className="footer__widget mb-50">
                  <div className="footer__widget-head mb-22">
                    <h3 className="footer__widget-title" style={{ color: '#2C3E50' }}>Entreprise</h3>
                  </div>
                  <div className="footer__widget-body">
                    <ul className="footer__link">
                      <li><a href="#" style={{ color: '#2C3E50' }}>À Propos</a></li>
                      <li><a href="#" style={{ color: '#2C3E50' }}>Cours</a></li>
                      <li><a href="#" style={{ color: '#2C3E50' }}>Événements</a></li>
                      <li><a href="#" style={{ color: '#2C3E50' }}>Formateurs</a></li>
                      <li><a href="#" style={{ color: '#2C3E50' }}>Carrière</a></li>
                      <li><a href="#" style={{ color: '#2C3E50' }}>Devenir Formateur</a></li>
                      <li><a href="#" style={{ color: '#2C3E50' }}>Contact</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6">
                <div className="footer__widget mb-50">
                  <div className="footer__widget-head mb-22">
                    <h3 className="footer__widget-title" style={{ color: '#2C3E50' }}>Ressources</h3>
                  </div>
                  <div className="footer__widget-body">
                    <ul className="footer__link">
                      <li><a href="#" style={{ color: '#2C3E50' }}>Bibliothèque</a></li>
                      <li><a href="#" style={{ color: '#2C3E50' }}>Partenaires</a></li>
                      <li><a href="#" style={{ color: '#2C3E50' }}>Actualités & Blogs</a></li>
                      <li><a href="#" style={{ color: '#2C3E50' }}>FAQs</a></li>
                      <li><a href="#" style={{ color: '#2C3E50' }}>Tutoriels</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6">
                <div className="footer__widget mb-50">
                  <div className="footer__widget-head mb-22">
                    <h3 className="footer__widget-title" style={{ color: '#2C3E50' }}>Contact</h3>
                  </div>
                  <div className="footer__widget-body">
                    <p style={{ color: '#2C3E50' }}>1234 Rue de l'Éducation, Paris, France</p>
                    <p style={{ color: '#2C3E50' }}>Email: contact@easylearn.com</p>
                    <p style={{ color: '#2C3E50' }}>Téléphone: +33 1 23 45 67 89</p>
                    <p style={{ color: '#2C3E50' }}>Horaires: Lun - Ven: 9h - 18h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer__bottom" style={{ backgroundColor: '#e0e0e0' }}>
          <div className="container">
            <div className="row">
              <div className="col-xxl-12">
                <div className="footer__copyright text-center" style={{ color: '#2C3E50' }}>
                  <p>© 2024 Easy Learn, Tous Droits Réservés. Designé par <a href="/" style={{ color: '#2C3E50' }}>Votre Nom ou Entreprise</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
