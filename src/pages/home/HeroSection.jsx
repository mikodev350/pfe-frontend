import React from "react";
//******  link t3 hero image *****
import headerimg from "./images/Innovation-pana.png";
//********* hero style ********
import "./HeroSectionStyle.css";
// ***** had la page bdltha presk g3 *****
import Ratio from "react-bootstrap/Ratio";

const HeroSection = () => {
  return (
    <section className="hero__area hero__height hero__height-small d-flex align-items-center white-bg-3 p-relative">
      {/* Grande forme ajoutée ici */}
      {/* <div className="hero__big-shape"></div> */}
      <div className="hero__big-shape2"></div>
      <div className="container">
        <div className="hero__content-wrapper mt-60">
          <div className="row align-items-center">
            <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6">
              <div className="hero__content hero__content-2 p-relative z-index-1">
              <h3 className="hero__title hero__title-2 mt-40" style={{color:'#10266f'}}>
                  L'éducation à portée <br />
                  <span className="yellow-shape">
                    de clic  , partout{" "}
                    <img
                      src={`./assets/img/yellow-bg.png`}
                      alt="yellow-shape"
                    />
                  </span>
                  et à tout moment.
                </h3>

                {/* <h4> Transformez votre apprentissage avec une gestion facile et flexible.</h4> */}
                <p style={{ paddingLeft: "0px"}}>
                  Transformez votre apprentissage avec une gestion facile et
                  flexible, accessible même hors ligne.
                </p>
              </div>
            </div>
            <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6">
              <div className="hero__thumb-wrapper">
                <div className="hero__thumb-2 scene">
                  {/* ****** Ajoutit image t3 hero ****** */}
                  <div className='imgStyle'>
                    <Ratio>
                      <img src={`./assets/img/Innovation-pana.png`} alt="Innovation-pana.png"/>
                    </Ratio>
                  </div>
                  {/* <img className="hero-shape-purple" src="/assets/img/why/why-shape-orange.png" alt="hero-shape-purple" /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Petite forme ajoutée ici */}
        {/* <div className="hero__small-shape"></div>
        <div className="hero__small-shape2"></div> */}
      </div>
    </section>
  );
};

export default HeroSection;
