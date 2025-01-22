import React from "react";
import { HeroProps } from "../../types/types";

const Hero1: React.FC<HeroProps> = ({
  imageUrl,
  tagline,
  subTagline,
  handleClick,
  buttonText,
  headline,
}) => {
  return (
    <section className="w-full max-w-screen-xl px-5 pt-8 lg:pt-24">
      <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="font-manrope lea mx-auto mb-5 max-w-2xl text-center text-3xl font-bold leading-[3.25rem] text-gray-900 md:text-5xl md:leading-[4rem]">
          {tagline}
          <span className="text-primary-var-600"> {subTagline}</span>
        </h1>
        <p className="mx-auto mb-9 max-w-sm text-center text-base font-normal leading-7 text-gray-500">
          {headline}
        </p>
        <button
          onClick={handleClick}
          className="shadow-xs mb-14 inline-flex w-full items-center justify-center rounded-full bg-primary-var-600 px-7 py-3 text-center text-base font-semibold text-white transition-all duration-500 hover:bg-primary-var-700 md:w-auto"
        >
          {buttonText}
        </button>
        <div className="flex justify-center">
          <img
            src={imageUrl}
            alt="Hero section"
            className="h-auto rounded-t-3xl object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero1;
