import React from 'react';
import { FaFacebookF, FaTwitter, FaPinterestP, FaInstagram, FaLinkedin, FaPhone, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#f9f9f9', color: '#10266f', padding: '80px 0' }}>
      <div className="footer__area">
        <div className="container">
          <div className="row text-center justify-content-between">
            
            {/* Logo and Description */}
            <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 mb-4">
              <div className="footer__widget">
                <div className="footer__logo">
                  <a href="/">
                    <img src="/assets/img/logo/logo.png" alt="Easy Learn Logo" style={{ maxWidth: '100px' }} />
                  </a>
                </div>
                <p style={{ fontSize: '14px', marginTop: '10px' }}>Optimisez votre apprentissage avec Easy Learn.</p>
              </div>
            </div>

            {/* Entreprise Section */}
            <div className="col-xxl-2 col-xl-2 col-lg-2 col-md-6 col-sm-12 mb-4">
              <div className="footer__widget">
                <h3 className="footer__widget-title" style={{ color: '#10266f', fontSize: '16px' }}>Entreprise</h3>
                <ul className="footer__link" style={{ listStyleType: 'none', padding: 0, fontSize: '14px' }}>
                  <li><a href="#" style={{ color: '#10266f' }}>À Propos</a></li>
                  <li><a href="#" style={{ color: '#10266f' }}>Cours</a></li>
                  <li><a href="#" style={{ color: '#10266f' }}>Événements</a></li>
                  <li><a href="#" style={{ color: '#10266f' }}>Contact</a></li>
                </ul>
              </div>
            </div>

            {/* Ressources Section */}
            <div className="col-xxl-2 col-xl-2 col-lg-2 col-md-6 col-sm-12 mb-4">
              <div className="footer__widget">
                <h3 className="footer__widget-title" style={{ color: '#10266f', fontSize: '16px' }}>Ressources</h3>
                <ul className="footer__link" style={{ listStyleType: 'none', padding: 0, fontSize: '14px' }}>
                  <li><a href="#" style={{ color: '#10266f' }}>Bibliothèque</a></li>
                  <li><a href="#" style={{ color: '#10266f' }}>Actualités</a></li>
                  <li><a href="#" style={{ color: '#10266f' }}>FAQs</a></li>
                </ul>
              </div>
            </div>

            {/* Contact Section */}
            <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 mb-4">
              <div className="footer__widget">
                <h3 className="footer__widget-title" style={{ color: '#10266f', fontSize: '16px' }}>Contact</h3>
                <p style={{ color: '#10266f', fontSize: '14px' }}>
                  <FaEnvelope style={{ marginRight: '8px' }} />
                  contact@easylearn.com
                </p>
                <p style={{ color: '#10266f', fontSize: '14px' }}>
                  <FaPhone style={{ marginRight: '8px' }} />
                  +213 673482329
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Short Border Line */}
        <div style={{ borderBottom: '1px solid #1e80c9', width: '450px', margin: '20px auto' }}></div>
        {/* Social Icons */}
        <div className="footer__social text-center" style={{ padding: '20px 0' }}>
          <ul className="d-flex justify-content-center gap-2 list-unstyled">
            <li>
              <a href="#" className="social-icon" style={{ color: '#fff', backgroundColor: '#10266f', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FaFacebookF />
              </a>
            </li>
            <li>
              <a href="#" className="social-icon" style={{ color: '#fff', backgroundColor: '#00acee', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FaTwitter />
              </a>
            </li>
            <li>
              <a href="#" className="social-icon" style={{ color: '#fff', backgroundColor: '#E60023', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FaPinterestP />
              </a>
            </li>
            <li>
              <a href="#" className="social-icon" style={{ color: '#fff', backgroundColor: '#C13584', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FaInstagram />
              </a>
            </li>
            <li>
              <a href="#" className="social-icon" style={{ color: '#fff', backgroundColor: '#0077b5', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FaLinkedin />
              </a>
            </li>
          </ul>
        </div>

        {/* Footer Bottom */}
        <div className="footer__bottom" style={{ backgroundColor: '#e0e0e0', padding: '10px 0', textAlign: 'center' }}>
          <p style={{ color: '#10266f', fontSize: '14px' }}>© 2024 Easy Learn, Tous Droits Réservés. Designé par <a href="/" style={{ color: '#1e80c9', fontSize: '14px' }}>Votre Nom ou Entreprise</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;