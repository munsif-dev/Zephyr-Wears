import React, { useEffect, useState } from "react";
import bannerDesktop1 from "../assets/banner/bannerDesktop1.png";
import bannerDesktop2 from "../assets/banner/bannerDesktop2.png";
import bannerDesktop3 from "../assets/banner/bannerDesktop3.png";
import bannerDesktop4 from "../assets/banner/bannerDesktop4.png";
import bannerDesktop5 from "../assets/banner/bannerDesktop5.png";

import bannerMobile1 from "../assets/banner/bannerMobile1.png";
import bannerMobile2 from "../assets/banner/bannerMobile2.png";
import bannerMobile3 from "../assets/banner/bannerMobile3.png";
import bannerMobile4 from "../assets/banner/bannerMobile4.png";
import bannerMobile5 from "../assets/banner/bannerMobile5.png";

import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";

const BannerProduct = () => {
  const [currentImage, setCurrentImage] = useState(0);

  const desktopImages = [
    bannerDesktop1,
    bannerDesktop2,
    bannerDesktop3,
    bannerDesktop4,
    bannerDesktop5,
  ];

  const mobileImages = [
    bannerMobile1,
    bannerMobile2,
    bannerMobile3,
    bannerMobile4,
    bannerMobile5,
  ];

  const nextImage = () => {
    if (desktopImages.length - 1 > currentImage) {
      setCurrentImage((preve) => preve + 1);
    }
  };

  const preveImage = () => {
    if (currentImage != 0) {
      setCurrentImage((preve) => preve - 1);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (desktopImages.length - 1 > currentImage) {
        nextImage();
      } else {
        setCurrentImage(0);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentImage]);

  return (
    <div className="container mx-auto px-4 rounded flex justify-center">
      <div className="h-65 md:h-100 w-auto bg-slate-200 relative rounded-lg">
        <div className="absolute z-10 h-full w-full md:flex items-center hidden ">
          <div className=" flex justify-between w-full text-2xl">
            <button
              onClick={preveImage}
              className="bg-white shadow-md rounded-full p-1 ml-2"
            >
              <FaAngleLeft />
            </button>
            <button
              onClick={nextImage}
              className="bg-white shadow-md rounded-full p-1 mr-2"
            >
              <FaAngleRight />
            </button>
          </div>
        </div>

        {/**desktop and tablet version */}
        <div className="hidden md:flex h-full w-full overflow-hidden">
          {desktopImages.map((imageURl, index) => {
            return (
              <div
                className="w-full h-full min-w-full min-h-full transition-all"
                key={imageURl}
                style={{ transform: `translateX(-${currentImage * 100}%)` }}
              >
                <img src={imageURl} className="w-full h-full" />
              </div>
            );
          })}
        </div>

        {/**mobile version */}
        <div className="flex h-full w-full overflow-hidden md:hidden">
          {mobileImages.map((imageURl, index) => {
            return (
              <div
                className="w-full h-full min-w-full min-h-full transition-all"
                key={imageURl}
                style={{ transform: `translateX(-${currentImage * 100}%)` }}
              >
                <img src={imageURl} className="w-full h-full object-cover" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BannerProduct;
