import React from "react";
import { FaMobileAlt, FaDownload } from "react-icons/fa";

// Composant CTASection
const CTASection = () => {
  const [deferredPrompt, setDeferredPrompt] = React.useState(null);

  React.useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      console.log("beforeinstallprompt event fired"); // Log this to check
      e.preventDefault(); // Prevent the default mini-infobar from appearing on mobile
      setDeferredPrompt(e); // Save the event so we can trigger it later
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = () => {
    deferredPrompt.prompt(); // Show the install prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the installation");
      } else {
        console.log("User dismissed the installation");
      }
      setDeferredPrompt(null); // Clear the deferred prompt once it's used
    });
  };

  return (
    deferredPrompt && (
      <section
        className="cta__area mb--100"
        style={{
          backgrou9nd: "linear-gradient(to right, #10266f, #1e80c9, #59bcf3)",
          padding: "60px 0px 70px 0px",
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
          <div
            className="cta__inner cta__inner-2 fix"
            style={{
              background:
                "linear-gradient(to right, #10266f, #1e80c9, #59bcf3)",
            }}
          >
            <div className="cta__shape">
              <img
                src="/assets/img/cta/why-shape-blue.png"
                alt="cta-shape"
                style={{ width: "auto", height: "auto" }}
              />
            </div>
            <div className="row align-items-center">
              <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-6">
                <div className="cta__apps d-lg-flex justify-content-start p-relative z-index-1">
                  <div
                    target="_blank"
                    rel="noreferrer"
                    href="#"
                    className="cta__link mr-10"
                    style={{
                      backgroundColor: "#eea129",
                      color: "#FFFFFF",
                      padding: "12px 25px",
                      borderRadius: "50px",
                      display: "flex",
                      alignItems: "center",
                      textDecoration: "none",
                      fontWeight: "bold",
                      fontSize: "16px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                      transition:
                        "background-color 0.3s ease, transform 0.3s ease",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                    onClick={handleInstallClick}
                  >
                    <FaMobileAlt
                      className="cta__icon"
                      style={{ marginRight: "8px" }}
                    />
                    installer maintenant
                    <FaDownload style={{ marginLeft: "8px" }} />
                  </div>
                </div>
              </div>
              <div className="col-xxl-7 col-xl-7 col-lg-7 col-md-6">
                <div className="cta__content">
                  <h3
                    className="cta__title"
                    style={{
                      color: "#FFFFFF",
                      fontWeight: "bold",
                      fontSize: "24px",
                      marginBottom: "0",
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
    )
  );
};

export default CTASection;
