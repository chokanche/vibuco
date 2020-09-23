/**
 * getImageAspectRatio takes in an image path and will try to fetch that image, after which it will calculate a ratio based on the data it received
 * @param imgPath {string}
 * @return {Promise<number>} - Returns a promise that will resolve in a number which is the result of width / height of the loaded image
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
