const NumberedGalleryImage = ({ photo, margin, onClick, index, key }) => {
  return (
    <>
      <div key={key} className="gallery-image">
        <div className="gallery-image__number">{index + 1}</div>
        <img
          onClick={() => onClick(undefined, { index })}
          style={{ margin }}
          {...photo}
        />
      </div>
      <style jsx>{`
        .gallery-image {
          position: relative;
        }

        .gallery-image__number {
          color: white;
          position: absolute;
          top: 15px;
          left: 15px;
          font-size: 22px;
        }
      `}</style>
    </>
  );
};

export default NumberedGalleryImage;
