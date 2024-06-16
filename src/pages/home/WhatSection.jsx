import React from 'react';

const WhatSection = () => {
  return (
    <section className="what__area pt-115">
      <div className="container">
        <div className="row">
          <div className="col-xxl-6 offset-xxl-3 col-xl-6 offset-xl-3 col-lg-8 offset-lg-2">
            <div className="section__title-wrapper mb-60 text-center">
              <h2 className="section__title">
                Qu'est-ce que <span className="yellow-bg-big">Easy Learn? <img src="./assets/img/yellow-bg-2.png" alt="Yellow Background" /></span>
              </h2>
              <p>Easy Learn est une application web progressive (PWA) qui rend l'apprentissage simple et accessible pour tous. Avec nos outils intuitifs, organisez vos parcours éducatifs, accédez à une vaste bibliothèque de ressources et collaborez facilement avec vos pairs et enseignants. Découvrez une nouvelle manière d'apprendre, adaptée à vos besoins et à votre rythme.</p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xxl-5 col-xl-5 col-lg-6 offset-xl-1">
            <div className="what__item transition-3 mb-30 p-relative fix">
              <div className="what__thumb w-img">
                <img src="./assets/img/why/what-1.jpg" alt="What 1" />
              </div>
              <div className="what__content p-absolute text-center">
                <h3 className="what__title white-color">Personnalisez <br /> Vos Parcours</h3>
                <a className="e-btn e-btn-border-2" href="/contact">Débutez dès maintenant</a>
              </div>
            </div>
          </div>
          <div className="col-xxl-5 col-xl-5 col-lg-6">
            <div className="what__item transition-3 mb-30 p-relative fix">
              <div className="what__thumb w-img">
                <img src="./assets/img/why/what-2.jpg" alt="What 2" />
              </div>
              <div className="what__content p-absolute text-center">
                <h3 className="what__title white-color">Pilotez  <br /> Votre Contenu</h3>
                <a className="e-btn e-btn-border-2" href="/contact">Commencez votre aventure</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhatSection;
