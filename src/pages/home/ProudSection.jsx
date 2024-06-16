import React from 'react';

const ProudSection = () => {
  return (
    <section className="proud__area pt-115">
      <div className="container">
        <div className="row">
          <div className="col-xxl-6 offset-xxl-3 col-xl-6 offset-xl-3">
            <div className="section__title-wrapper text-center mb-60">
              <h2 className="section__title">
                Nous sommes <span className="yellow-bg yellow-bg-big">Fiers <img src="./assets/img/yellow-bg.png" alt="Yellow Background" /></span>
              </h2>
              <p>Nous n'avons pas à lutter seuls, avec l'aide de nos encadreurs, nous progressons chaque jour.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProudSection;
