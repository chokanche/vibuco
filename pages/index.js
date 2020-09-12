import React, { useState } from "react";
import Layout from "../components/Layout";
import { photos } from "../components/photos";
import { background } from "../components/backgrounds";
import Gallery from "react-photo-gallery";
import Lightbox from "../components/Lightbox";

const Index = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState(photos);
  const [imageBackgrounds, setImageBackgrounds] = useState(background);
  const [isFlipped, setFlipped] = useState(false);
  const [isLightbox, setLightbox] = useState(false);

  const flip = () => setFlipped((prevState) => !prevState);

  const openLightbox = (_, { index }) => {
    setCurrentImageIndex(index);
    setLightbox(true);
  };

  const closeLightbox = () => setLightbox(false);

  const currentImage = images[currentImageIndex];

  return (
    <Layout>
      <style jsx>
        {`
          h1 {
            text-align: center;
            padding: 20px;
          }
        `}
      </style>
      <div>
        <h1>Welcome to Virtual Business Coach!</h1>
      </div>
      <button onClick={flip}>Flip cards</button>
      {isFlipped ? (
        <Gallery photos={imageBackgrounds} onClick={openLightbox} />
      ) : (
        <Gallery photos={images} onClick={openLightbox} />
      )}
      {isLightbox ? (
        <Lightbox
          imgPath={currentImage.src}
          txt={currentImage.txt}
          onClose={closeLightbox}
        />
      ) : null}
    </Layout>
  );
};

export default Index;
