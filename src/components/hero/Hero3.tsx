import React from "react";
import { HeroProps } from "../../types/types";

const Hero3: React.FC<HeroProps> = ({
  imageUrl,
  tagline,
  subTagline,
  handleClick,
  buttonText,
  headline,
}) => {
  return (
    <section
      className="min-h-[85vh] w-full bg-gray-700 bg-cover bg-center pt-32 bg-blend-overlay"
      style={{
        backgroundImage: `url(${imageUrl})`,
      }}
    >
      <div className="relative px-4 text-center">
        <h1 className="font-manrope lea mx-auto mb-5 max-w-2xl text-center text-3xl font-bold leading-[3.25rem] text-white md:text-5xl md:leading-[4rem]">
          {tagline}
          <span className="text-primary-var-600"> {subTagline}</span>
        </h1>
        <p className="mx-auto mb-9 max-w-sm text-center text-base font-normal leading-7 text-white">
          {headline}
        </p>
        <button
          onClick={handleClick}
          className="shadow-xs mb-14 inline-flex w-full items-center justify-center rounded-full bg-primary-var-600 px-7 py-3 text-center text-base font-semibold text-white transition-all duration-500 hover:bg-primary-var-700 md:w-auto"
        >
          {buttonText}
        </button>
      </div>
    </section>
  );
};

export default Hero3;
