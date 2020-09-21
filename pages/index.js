import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { background } from "../backgrounds";
import Gallery from "react-photo-gallery";
import Lightbox from "../components/Lightbox";
import { useAuth } from "../auth";
import getDataFromDDBTable from "../actions/getDataFromDDBTable";
import s3UrlToHttps from "../helpers/s3UrlToHttps";
import presignImageSources from "../helpers/presignImageSources";
import { PUBLIC_BUCKET_NAME, COMMON_BUCKET_NAME } from "../config";
import getImageAspectRatio from "../helpers/getImageAspectRatio";
import Loading from "../components/Loading";
import Container from "../components/grid/Container";
import _ from "lodash";
import NumberedGalleryImage from "../components/NumberedGalleryImage";

const Index = ({ initialAuth }) => {
  const auth = useAuth(initialAuth);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [showText, setShowText] = useState(true);
  const [images, setImages] = useState([]);
  const [imageBackgrounds, setImageBackgrounds] = useState(background);
  const [isFlipped, setFlipped] = useState(false);
  const [isLightbox, setLightbox] = useState(false);

  const getImageWidths = async (imgData) => {
    const promises = imgData.map(async (img) => ({
      ...img,
      height: 1,
      width: await getImageAspectRatio(img.src).catch((err) => {
        return 1;
      }),
    }));

    return await Promise.all(promises);
  };

  const convertSourcesToHttps = (data, bucketName) => {
    return data.map((img) => ({
      ...img,
      src: s3UrlToHttps(img.src, bucketName),
    }));
  };

  const fetchPublicImagesData = async () => {
    const imageData = await getDataFromDDBTable("vibuco-photos-public");

    const imageDataWithSources = convertSourcesToHttps(
      imageData,
      PUBLIC_BUCKET_NAME
    );

    const imagesWithWidth = await getImageWidths(imageDataWithSources);

    setImages(_.shuffle(imagesWithWidth));
    setLoading(false);
  };

  const fetchCommonImagesData = async () => {
    const imageData = await getDataFromDDBTable("vibuco-photos", auth.idToken);

    const imageWithPresignedUrls = await presignImageSources(
      imageData,
      COMMON_BUCKET_NAME,
      auth
    );

    const imagesWithWidth = await getImageWidths(imageWithPresignedUrls);

    setImages(_.shuffle(imagesWithWidth));
    setLoading(false);
  };

  useEffect(() => {
    if (isLoading) {
      if (!auth) {
        fetchPublicImagesData();
      } else {
        fetchCommonImagesData();
      }
    }
  }, [auth]);

  useEffect(() => {
    if (!isFlipped) {
      setImages((prevImgs) => _.shuffle(prevImgs));
    }
  }, [isFlipped]);

  const toggleTextSwitch = () => {
    setShowText((prevShowText) => !prevShowText);
  };

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

        {!isLoading ? (
          <Container className="mt-5 mb-4" xs="12">
            <div className="d-flex align-items-center justify-content-center justify-content-md-end">
              {auth ? (
                <div className="d-flex mb-4 justify-content-center align-items-center">
                  <button
                    className={`btn mr-4 ${
                      isFlipped ? "btn-dark" : "btn-light"
                    }`}
                    onClick={flip}
                  >
                    Flip cards
                  </button>
                  <div
                    onChange={toggleTextSwitch}
                    className="custom-control custom-switch"
                  >
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="customSwitch1"
                      checked={showText}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="customSwitch1"
                    >
                      Show image question
                    </label>
                  </div>
                </div>
              ) : null}
            </div>
          </Container>
        ) : null}

        {isLoading ? <Loading /> : null}

        {isFlipped ? (
          <Gallery
            photos={imageBackgrounds}
            renderImage={NumberedGalleryImage}
            onClick={openLightbox}
          />
        ) : null}

        {!isFlipped ? <Gallery photos={images} onClick={openLightbox} /> : null}

        {isLightbox ? (
          <Lightbox
            imgPath={currentImage.src}
            txt={currentImage.txt}
            onClose={closeLightbox}
            showText={showText}
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

export default Index;
