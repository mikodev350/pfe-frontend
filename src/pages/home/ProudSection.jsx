import React from 'react';

const OurTeamSection = () => {
  return (
    <section className="our-team-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="section-title-wrapper text-center">
              <h2 className="section-title">
                Rencontrez notre Équipe
              </h2>
              <p className="section-description">
                Découvrez les talents et les esprits créatifs qui ont contribué à la réalisation de notre application.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .our-team-section {
          background-color: #f0f4f8;
          padding: 30px 0;
        }

        .section-title-wrapper {
          margin-bottom: 20px;
          position: relative;
        }

        .section-title {
          font-size: 2.2rem;
          font-weight: bold;
          color: #10266f;
          margin-bottom: 5px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          padding: 8px 15px;
          background: #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          border-radius: 4px;
          position: relative;
          display: inline-block;
        }

        .section-description {
          font-size: 0.9rem;
          color: #1e80c9;
          line-height: 1.5;
          margin-bottom: 0;
          font-weight: 300;
        }

        .section-title::before {
          content: '';
          position: absolute;
          left: 0;
          bottom: -3px;
          width: 100%;
          height: 3px;
          background: #eea129;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease-in-out;
          animation: underline-animation 2s infinite;
        }

        .section-title:hover::before {
          transform: scaleX(1);
          animation: none;
        }

        @keyframes underline-animation {
          0% {
            transform: scaleX(0);
            opacity: 0;
          }
          50% {
            transform: scaleX(1);
            opacity: 1;
          }
          100% {
            transform: scaleX(0);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
};

export default OurTeamSection;
