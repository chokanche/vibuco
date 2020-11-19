import React, { useEffect, useState } from "react";
import Select from 'react-select'
import Switch from "react-switch";
import Gallery from "react-photo-gallery";
import Lightbox from "../components/Lightbox";
import { useAuth } from "../auth";
import getDataFromDDBTable from "../actions/getDataFromDDBTable";
import s3UrlToHttps from "../helpers/s3UrlToHttps";
import getImageObjects from "../helpers/getImageObjects";
import { PUBLIC_BUCKET_NAME, COMMON_BUCKET_NAME } from "../config";
import getImageAspectRatio from "../helpers/getImageAspectRatio";
import Loading from "../components/Loading";
import _, { set } from "lodash";
import NumberedGalleryImage from "../components/NumberedGalleryImage";
import Viheader from "../components/headers/viheader";
import { NextSeo } from "next-seo";

import "../styles/customStyles.css";

const Cards = ({ initialAuth }) => {
  // authentication object which represents logged in user
  const auth = useAuth(initialAuth);
  // current image index for lightbox
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // display loader while component is still loading
  const [isLoading, setLoading] = useState(true);

  const [images, setImages] = useState([]);
  const [isFlipped, setFlipped] = useState(false);
  const [isLightbox, setLightbox] = useState(false);

  // set checker if the text on the photo should be displayed on the photo
  const [checked, setChecked] = useState(true);

  /**
   * Set the selecte language from the dropdown.
   */
  const [isEnglish, setEnglish] = useState(true);
  const [isSerbian, setSerbian] = useState(false);
  const [isHungarian, setHungarian] = useState(false);

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
    //const imageData = await getDataFromDDBTable("vibuco-photos", auth.idToken);
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

  const flip = () => setFlipped((prevState) => !prevState);

  // open the light box (handler comes from React-gallery) setting the current image and opening the light box
  const openLightbox = (_, { index }) => {
    setCurrentImageIndex(index);
    setLightbox(true);
  };

  const closeLightbox = () => setLightbox(false);

  // helper var to get the current image based on the index in the images array
  const currentImage = images[currentImageIndex];

  useEffect(() => {
    images.map(photo => {
      photo.loading = "lazy";
      return photo;
    });
  }, [images]);

  const SEO = {
    title: "Virtual Business Coaching - Cards",
    description: "Digital coaching tool, with carefully selected examples of coaching exercises. This page contains the cards carefully selected to be used as conversation starters. Unpacking your thoughts made easy with vibuco.",
  }
    
  /**
   * Available languages for the texts
   */
  const options = [
    { value: 'English', label: 'English' },
    { value: 'Srpski', label: 'Srpski' },
    { value: 'Magyar', label: 'Magyar' }
  ]

  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    if (selectedOption != null) {
      switch(selectedOption.value) {
        case "Srpski":
          setEnglish(false)
          setSerbian(true);
          break;
        case 'Magyar':
          setEnglish(false)
          setSerbian(true);
          break;
        default:
          setSerbian(false);
          setEnglish(true)
          break;
      }
    }
  }, [selectedOption]);

  const handleChange = (checked) => {
    setChecked(checked);
  };

  return (
    <>
        <NextSeo {...SEO} />
        <Viheader />
        {!isLoading ? (
            <div className="flex-container-parent">
              <div className="flex-container-left">
                <div className = "select-child">
                  <Select 
                    defaultValue={selectedOption}
                    onChange={setSelectedOption}
                    options={options}
                    placeholder = "Select preferred language"
                  />
                  </div>
              </div>

                {auth ? (
                  <div className="flex-container-right">
                      <div className = "flex-item">
                      <button
                        id="flipCards"
                        className={`border border-vibuco-100 rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-gray-300 focus:outline-none focus:shadow-outline mr-2 ${
                          isFlipped ? "bg-gray-600 text-gray-200" : "bg-gray-200 text-gray-700"
                        }`}
                        onClick={flip}
                      >
                        Flip cards
                      </button>
                      </div>
                        <div className = "flex-item flex-last-item">
                        <label>
                          <span>Show question</span>
                          <Switch
                            onChange={handleChange}
                            checked={checked}
                            className="react-switch"
                            onColor = "#97d8c4"
                          />
                        </label>
                        </div>
                  </div>
                ) : null}
              </div>
        ) : null}

        {isLoading ? <Loading /> : null}

        {isFlipped ? (
          <div className = "maingallerycontainer">
            <Gallery
              photos={images.map(img => {
                const ratio = img.width / img.height;
                if (ratio >= 1) {
                  return { ...img, src: '../static/green2.jpg' }
                } 
                return { ...img, src: '../static/green1.jpg' }
              })}
              renderImage={NumberedGalleryImage}
              onClick={openLightbox}
            />
          </div>
        ) : null}

        {!isFlipped ? <div className = "maingallerycontainer" onContextMenu={(e)=> e.preventDefault()} > <Gallery photos={images} onClick={openLightbox} /> </div>: null}
        
        {/* For the unauthenticated TODO is to change the DDB config
            after that there's no need to check for auth*/}
        {
        isLightbox ? (
          auth ? (
            isEnglish ? (         
              <Lightbox
              imgPath={currentImage.src}
              txt={currentImage.txt.en}
              onClose={closeLightbox}
              showText={checked}
              />
          ) 
          :  isSerbian ? (
              <Lightbox
              imgPath={currentImage.src}
              txt={currentImage.txt.srb}
              onClose={closeLightbox}
              showText={checked}
              /> 
            ) : 
              <Lightbox
              imgPath={currentImage.src}
              txt={currentImage.txt.en}
              onClose={closeLightbox}
              showText={checked}
              /> 
          ) : 
            <Lightbox
            imgPath={currentImage.src}
            txt={currentImage.txt}
            onClose={closeLightbox}
            showText={checked}
            /> 
          ) :
         null 
         }
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
