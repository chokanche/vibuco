const getImageAspectRatio = (imgPath) => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      console.log("hi");
      const { height, width } = img;

      const ratio = width / height;

      resolve(ratio);
    };

    img.src = imgPath;
  });
};

export default getImageAspectRatio;
