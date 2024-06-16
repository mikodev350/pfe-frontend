import React from 'react';
import { FaMobileAlt } from 'react-icons/fa';

const CTASection = () => {
  return (
    <section className="cta__area mb--100">
      <div className="container">
        <div className="cta__inner cta__inner-2 blue-bg fix">
          <div className="cta__shape">
            <img src="/assets/img/cta/why-shape-orange.png" alt="cta-shape" />
          </div>
          <div className="row align-items-center">
            <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-6">
              <div className="cta__apps d-lg-flex justify-content-start p-relative z-index-1">
                <a target="_blank" rel="noreferrer" href="#" className="cta__link mr-10">
                  <FaMobileAlt className="cta__icon" /> Installer l'application
                </a>
              </div>
            </div>
            <div className="col-xxl-7 col-xl-7 col-lg-7 col-md-6">
              <div className="cta__content">
                <h3 className="cta__title">Commencez à apprendre en téléchargeant notre application.</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
