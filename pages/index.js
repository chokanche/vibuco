import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { background } from "../backgrounds";
import Gallery from "react-photo-gallery";
import Lightbox from "../components/Lightbox";
import { useAuth } from "../auth";
import getDataFromDDBTable from "../actions/getDataFromDDBTable";
import s3UrlToHttps from "../helpers/s3UrlToHttps";
import presignImageSources from "../helpers/presignImageSources";
import getImageObjects from "../helpers/getImageObjects";
import { PUBLIC_BUCKET_NAME, COMMON_BUCKET_NAME } from "../config";
import getImageAspectRatio from "../helpers/getImageAspectRatio";
import Loading from "../components/Loading";
import Container from "../components/grid/Container";
import _ from "lodash";
import NumberedGalleryImage from "../components/NumberedGalleryImage";

const Index = ({ initialAuth }) => {
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

  const hasHeightWidth = (img) => img.height && img.width;

  // get image widths for all the images in the imgData array that is passed in. Will return same array with added width and height attributes if not added in DB
  const getImageWidths = async (imgData) => {
    const promises = imgData.map(async (img) => {
      const width = hasHeightWidth(img)
        ? img.width
        : await getImageAspectRatio(img.src).catch((err) => {
            return 1;
          });

      return {
        ...img,
        height: hasHeightWidth(img) ? img.height : 1,
        width,
      };
    });

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

  // encode file.Body response into a base64 string
  const encode = (data) => {
    const str = data.reduce((a, b) => {
      return a + String.fromCharCode(b);
    }, "");
    return btoa(str).replace(/.{76}(?=.)/g, "$&\n");
  };

  const fetchCommonImagesData = async () => {
    const imageData = await getDataFromDDBTable("vibuco-photos", auth.idToken);

    // presign our image urls for authenticated access
    const imageObjects = await getImageObjects(
      imageData,
      COMMON_BUCKET_NAME,
      auth
    );

    const completeImageDataWithObjects = imageData.map(async (img, i) => {
      const obj = imageObjects[i];
      img.src = `data:${obj.ContentType};base64,` + encode(obj.Body);

      if (!hasHeightWidth(img)) {
        img.height = 1;
        img.width = await getImageAspectRatio(img.src);
      }

      return img;
    });

    const data = await Promise.all(completeImageDataWithObjects);

    setImages(_.shuffle(data));
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

  // open the light box (handler comes from React-gallery) setting the current image and opening the light box
  const openLightbox = (_, { index }) => {
    setCurrentImageIndex(index);
    setLightbox(true);
  };

  const closeLightbox = () => setLightbox(false);

  // helper var to get the current image based on the index in the images array
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
