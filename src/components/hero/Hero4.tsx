import React from "react";
import { HeroProps } from "../../types/types";

const Hero4: React.FC<HeroProps> = ({
  imageUrl,
  tagline,
  subTagline,
  handleClick,
  buttonText,
  headline,
}) => {
  return (
    <section className="mt-4 flex justify-center overflow-hidden rounded-2xl bg-transparent px-5 md:mt-14">
      <div className="w-full max-w-screen-xl">
        <div className="grid w-full grid-cols-1 items-center gap-5 md:gap-32 lg:grid-cols-2">
          <div
            data-aos="zoom-in-right"
            className="w-full md:order-2 xl:-mx-0 2xl:-mx-5"
          >
            <h1 className="py-8 text-center font-primary text-3xl font-extrabold leading-[50px] text-gray-900 sm:text-[2.7rem] sm:leading-[60px] lg:text-left">
              {tagline}{" "}
              <span className="text-primary-var-600">{subTagline}</span>
            </h1>
            <p className="text-center text-lg text-gray-500 lg:text-left">
              {headline}
            </p>
            <div className="my-10 flex w-full justify-center lg:justify-start">
              <button
                onClick={() => handleClick()}
                className="w-full max-w-fit cursor-pointer rounded-full bg-primary-var-600 px-7 py-3 text-base font-semibold text-white transition-all duration-500 hover:bg-primary-var-700 md:w-fit"
              >
                {buttonText}
              </button>
            </div>
          </div>
          <div className="w-fit sm:w-auto">
            <img
              src={imageUrl}
              alt="Hero section"
              className="h-full w-full rounded-xl object-cover object-center md:min-h-[70vh] md:rounded-3xl lg:h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero4;
