import React, { useEffect, useState } from "react";
import tw from "twin.macro";

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
import Viheader from "../components/headers/viheader"
import HeaderBase, { NavLinks, NavLink, NavButton, PrimaryButton, PrimaryLink } from  '../components/headers/light'
import "../styles/customStyles.css";

const Cards = ({ initialAuth }) => {
  // authentication object which represents logged in user
  const auth = useAuth(initialAuth);
  // current image index for lightbox
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [isLoading, setLoading] = useState(true);

  const [showText, setShowText] = useState(true);

  const [images, setImages] = useState([]);
  const [imageBackgrounds, setImageBackgrounds] = useState(background);

  const [isFlipped, setFlipped] = useState(false);
  const [isLightbox, setLightbox] = useState(false);

  const [isEnglish, setEnglish] = useState(true);

  // get image widths for all the images in the imgData array that is passed in. Will return same array with added width and height attributes
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

  // convert s3 urls to https urls
  const convertSourcesToHttps = (data, bucketName) => {
    return data.map((img) => ({
      ...img,
      src: s3UrlToHttps(img.src, bucketName),
    }));
  };

  const fetchPublicImagesData = async () => {
    const imageData = await getDataFromDDBTable("vibuco-photos-public");

    // convert all s3 urls to https urls
    const imageDataWithSources = convertSourcesToHttps(
      imageData,
      PUBLIC_BUCKET_NAME
    );

    const imagesWithWidth = await getImageWidths(imageDataWithSources);
    // shuffle images
    setImages(_.shuffle(imagesWithWidth));
    setLoading(false);
  };

  const fetchCommonImagesData = async () => {
    const imageData = await getDataFromDDBTable("vibuco-photos", auth.idToken);

    // presign our image urls for authenticated access
    const imageWithPresignedUrls = await presignImageSources(
      imageData,
      COMMON_BUCKET_NAME,
      auth
    );

    const imagesWithWidth = await getImageWidths(imageWithPresignedUrls);

    // shuffle images
    setImages(_.shuffle(imagesWithWidth));
    setLoading(false);
  };

  // Fetch the right data based on authentication (will happen on page load)
  useEffect(() => {
    if (isLoading) {
      if (!auth) {
        fetchPublicImagesData();
      } else {
        fetchCommonImagesData();
      }
    }
  }, [auth]);

  // shuffle images whenever we flip from backgrounds back to normal images
  useEffect(() => {
    if (!isFlipped) {
      setImages((prevImgs) => _.shuffle(prevImgs));
    }
  }, [isFlipped]);

  const toggleTextSwitch = () => {
    setShowText((prevShowText) => !prevShowText);
  };

  const flip = () => setFlipped((prevState) => !prevState);

  const changeLanguage = () => setEnglish((prevState) => !prevState);

  // open the light box (handler comes from React-gallery) setting the current image and opening the light box
  const openLightbox = (_, { index }) => {
    setCurrentImageIndex(index);
    setLightbox(true);
  };

  const closeLightbox = () => setLightbox(false);

  // helper var to get the current image based on the index in the images array
  const currentImage = images[currentImageIndex];
  const Header = tw.header`
    flex items-center
    max-w-screen-xl mx-auto justify-center m-4
  `;

  return (
    <>
        <Viheader />
        {!isLoading ? (
            <Header className="customFont">
              {auth ? (
                <>
                  <button
                    id="switchToEnglish"
                    className={`border border-vibuco-100 rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-gray-300 focus:outline-none focus:shadow-outline mr-2 ${
                      isEnglish ? "bg-gray-600 text-gray-200" : "bg-gray-200 text-gray-700"
                    }`}
                    onClick={changeLanguage}
                  >
                    English
                  </button>

                  <button
                    id="flipCards"
                    className={`border border-vibuco-100 rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-gray-300 focus:outline-none focus:shadow-outline mr-2 ${
                      isFlipped ? "bg-gray-600 text-gray-200" : "bg-gray-200 text-gray-700"
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
                      onChange={e => {}}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="customSwitch1"
                    >
                      Show questions
                    </label>
                  </div>
                </>
              ) : null}
            </Header>
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

export default Cards;
