import { useEffect, useRef, useState } from "react";
import getImageAspectRatio from "../helpers/getImageAspectRatio";

const Lightbox = ({ imgPath, txt, onClose, showText, isBackground, index }) => {
  const [isSideBySide, setSideBySide] = useState(false);

  const handleClose = (e) => {
    if (e.target.classList.contains("popup-container")) {
      onClose();
    }
  };

  const setRatioSideBySide = async () => {
    const ratio = await getImageAspectRatio(imgPath);

    setSideBySide(ratio < 1);
  };

  useEffect(() => {
    setRatioSideBySide();
  }, []);

  return (
    <>
      <div onClick={handleClose} className="popup-container">
        <div className={`popup ${isSideBySide ? "popup-sidebyside" : ""}`}>
          <div className="image-container">
            <img src={imgPath} alt="" />
          </div>

          {showText ? (
            <div className="text-container">
              <p>{txt}</p>
            </div>
          ) : null}
        </div>
      </div>

      <style jsx>{`
        .popup-container {
          width: 100vw;
          height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          background-color: rgba(156, 156, 156, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }

        .popup {
          background-color: white;
          padding: 5px;
          margin: 15px;
          max-width: 710px;
          max-height: 90%;
        }

        .popup.popup-sidebyside {
          display: flex;
        }

        .popup .text-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .popup.popup-sidebyside .text-container {
          max-width: 265px;
        }

        .popup img {
          width: 100%;
          height: 100%;
          max-width: 700px;
          max-height: 700px;
        }

        @media (min-width: 720px) {
          .popup img {
            width: auto;
          }
        }

        @media (max-height: 720px) {
          .popup img {
            width: auto !important;
          }
        }
      `}</style>
    </>
  );
};

export default Lightbox;
