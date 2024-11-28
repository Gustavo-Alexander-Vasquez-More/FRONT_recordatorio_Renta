import React, { useState } from "react";

const Lightbox = ({ isOpen, closeLightbox, currentImage }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-[#000000e5]  w-full h-screen flex flex-col justify-center items-center z-50"
      onClick={closeLightbox}
    >
    <div className="w-full bg-[black] h-[7vh] flex items-center justify-between text-white px-[2rem]">
        <p>Preview-Fullscreen</p>
        <button
          className=" text-white text-[2rem] "
          onClick={closeLightbox}
        >
          ×
        </button>
    </div>
      <div className="relative w-full h-[93vh] flex justify-center items-center">
        <img
          className="w-[70%] object-contain mx-auto"
          src={currentImage}
          alt="Imagen en detalle"
        />
       
      </div>
    </div>
  );
};

export default Lightbox;
