/*
 * Simple image aspect ratio function that returns a promise.
 * Return value is width / height ratio of an image.
 */
const getImageAspectRatio = (imgPath) => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const { height, width } = img;

      const ratio = width / height;

      resolve(ratio);
    };

    img.onerror = () => {
      reject("Image could not be loaded");
    };

    img.src = imgPath;
  });
};

export default getImageAspectRatio;
