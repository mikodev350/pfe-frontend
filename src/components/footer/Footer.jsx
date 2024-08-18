import React from 'react';
import { FaFacebookF, FaTwitter, FaPinterestP, FaInstagram, FaLinkedin, FaPhone, FaEnvelope } from 'react-icons/fa';
import logoo from "./GGGG.png";

const Footer = () => {
  return (
    <footer style={{ backgroundColor: ' #f0f4f8', color: '#10266f', padding: '30px 0px 0px 0px' 
      
    }}>
      <div className="footer__area">
        <div className="container">
          <div className="row text-center justify-content-between">
            
            {/* Logo and Description */}
            <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 mb-4">
              <div className="footer__widget">
                <div className="footer__logo">
                  <a href="/">
                    <img src={logoo} style={{ maxWidth: '170px' }} />
                  </a>
                </div>
                <p style={{ fontSize: '14px', marginTop: '3px' }}>Optimisez votre apprentissage avec Easy Learn.</p>
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
        {/* <div style={{ borderBottom: '1px solid #1e80c9', width: '450px', margin: '5px auto' }}></div> */}
        {/* Social Icons */}
        <div className="footer__social text-center" style={{ padding: '20px 0' }}>
          <ul className="d-flex justify-content-center gap-3 list-unstyled">
            <li>
              <a href="#" className="social-icon" style={{ color: '#fff', backgroundColor: '#10266f', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' ,border:'0'}}> 
                <FaFacebookF />
              </a>
            </li>
            <li>
              <a href="#" className="social-icon" style={{ color: '#fff', backgroundColor: '#00acee', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' ,border:'0'}}>
                <FaTwitter />
              </a>
            </li>
            <li>
              <a href="#" className="social-icon" style={{ color: '#fff', backgroundColor: '#E60023', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' ,border:'0'}}>
                <FaPinterestP />
              </a>
            </li>
            <li>
              <a href="#" className="social-icon" style={{ color: '#fff', backgroundColor: '#C13584', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' ,border:'0'}}>
                <FaInstagram />
              </a>
            </li>
            <li>
              <a href="#" className="social-icon" style={{ color: '#fff', backgroundColor: '#0077b5', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' ,border:'0'}}>
                <FaLinkedin />
              </a>
            </li>
          </ul>
        </div>

        {/* Footer Bottom */}
        <div className="footer__bottom " style={{ backgroundColor: '#e0e0e0', padding: '3px', textAlign: 'center',margin:0 }}>
          <p style={{ color: '#10266f', fontSize: '14px',marginBottom:'0px', }}>© 2024 Easy Learn, Tous Droits Réservés. <a></a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;