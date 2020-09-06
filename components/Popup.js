const Popup = ({ imgPath, isOpen, onClose }) => {

  const handleClose = e => {
    if (e.target.classList.contains('popup-container')) {
      onClose();
    }
  }

  return isOpen ? (
    <>
      <div onClick={handleClose} className="popup-container">
        <div className="popup">
          <img src={imgPath} alt=""/>
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
        }

        .popup img {
          max-width: 500px;
          max-height: 500px;
        }

      `}</style>
    </>
  ): null;
}

export default Popup;