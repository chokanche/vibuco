import { useEffect, useState } from "react";
import getImageAspectRatio from "../helpers/getImageAspectRatio";

const Lightbox = ({ imgPath, txt, onClose }) => {
  const [isSideBySide, setSideBySide] = useState(false);

  const handleClose = (e) => {
    if (e.target.classList.contains("popup-container")) {
      onClose();
    }
  };

  const setRatioSideBySide = async () => {
    const ratio = await getImageAspectRatio(imgPath);

    setSideBySide(ratio <= 1);
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

          <div className="text-container">
            <p>{txt}</p>
          </div>
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
        }

        .popup {
          background-color: white;
          padding: 5px;
          margin: 15px;
          max-width: 710px;
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
          max-width: 700px;
          max-height: 700px;
        }

        @media (min-width: 720px) {
          .popup img {
            width: auto;
          }
        }
      `}</style>
    </>
  );
};

export default Lightbox;
