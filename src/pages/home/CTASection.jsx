import React from 'react';
import { FaMobileAlt, FaDownload } from 'react-icons/fa';

// Composant CTASection
const CTASection = () => {
  return (
    <section 
      className="cta__area mb--100" 
      style={{
        background: 'linear-gradient(to right, #10266f, #1e80c9, #59bcf3)',
        padding: '90px 0'
      }}
    >
      <style>{`
        @media (max-width: 767px) {
          .cta__link {
            padding: 10px 20px;
            font-size: 14px;
          }
          .cta__title {
            font-size: 20px;
          }
        }
      `}</style>
      <div className="container">
        <div className="cta__inner cta__inner-2 fix">
          <div className="cta__shape">
            <img 
              src="/assets/img/cta/why-shape-blue.png"
              alt="cta-shape" 
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
          <div className="row align-items-center">
            <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-6">
              <div className="cta__apps d-lg-flex justify-content-start p-relative z-index-1">
                <a 
                  target="_blank" 
                  rel="noreferrer" 
                  href="#" 
                  className="cta__link mr-10"
                  style={{
                    backgroundColor: '#eea129',
                    color: '#FFFFFF',
                    padding: '12px 25px',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    transition: 'background-color 0.3s ease, transform 0.3s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <FaMobileAlt className="cta__icon" style={{ marginRight: '8px' }} />
                  Installer l'application
                  <FaDownload style={{ marginLeft: '8px' }} />
                </a>
              </div>
            </div>
            <div className="col-xxl-7 col-xl-7 col-lg-7 col-md-6">
              <div className="cta__content">
                <h3 
                  className="cta__title" 
                  style={{
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                    fontSize: '24px',
                    marginBottom: '0'
                  }}
                >
                  Commencez à apprendre en téléchargeant notre application.
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;