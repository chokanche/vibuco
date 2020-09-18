import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { background } from "../components/backgrounds";
import Gallery from "react-photo-gallery";
import Lightbox from "../components/Lightbox";
import { getServerSideAuth, useAuth } from "./_auth";
import getDataFromDDBTable from "../actions/getDataFromDDBTable";
import s3UrlToHttps from "../helpers/s3UrlToHttps";
import { PUBLIC_BUCKET_NAME } from "../config";

const Index = ({ initialAuth }) => {
  const auth = useAuth(initialAuth);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [imageBackgrounds, setImageBackgrounds] = useState(background);
  const [isFlipped, setFlipped] = useState(false);
  const [isLightbox, setLightbox] = useState(false);

  const fetchPublicImagesData = async () => {
    const imageData = await getDataFromDDBTable("vibuco-photos-public");
    const imageDataWithImageSources = imageData.map((img) => {
      img.src = s3UrlToHttps(img.src, PUBLIC_BUCKET_NAME);
      return img;
    });

    setImages(imageDataWithImageSources);
  };

  const fetchCommonImagesData = async () => {
    const imageData = await getDataFromDDBTable("vibuco-photos-common");

    console.log(imageData);
  };

  useEffect(() => {
    if (!auth) {
      fetchPublicImagesData();
    } else {
      fetchCommonImagesData();
    }
  }, []);

  const flip = () => setFlipped((prevState) => !prevState);

  const openLightbox = (_, { index }) => {
    setCurrentImageIndex(index);
    setLightbox(true);
  };

  const closeLightbox = () => setLightbox(false);

  const currentImage = images[currentImageIndex];

  return (
    <>
      <Layout>
        <div>
          <h1>Welcome to Virtual Business Coach!</h1>
        </div>
        <button onClick={flip}>Flip cards</button>

        {isFlipped ? (
          <Gallery photos={imageBackgrounds} onClick={openLightbox} />
        ) : null}

        {!isFlipped ? <Gallery photos={images} onClick={openLightbox} /> : null}

        {isLightbox ? (
          <Lightbox
            imgPath={currentImage.src}
            txt={currentImage.txt}
            onClose={closeLightbox}
          />
        ) : null}
      </Layout>
      <style jsx>
        {`
          h1 {
            text-align: center;
            padding: 20px;
          }
        `}
      </style>
    </>
  );
};

export const getServerSideProps = async (ctx) => {
  const initialAuth = getServerSideAuth(ctx.req);

  return { props: { initialAuth } };
};

export default Index;
