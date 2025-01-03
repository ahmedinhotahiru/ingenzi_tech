import React, { useState, useEffect } from "react";
import { HeroProps } from "../../types/types";

const Hero1: React.FC<HeroProps> = ({ props }) => {
  const { imageUrl, title, subTitle, handleClick, buttonText, text } = props;

  return (
    <section className="mt-4 overflow-hidden rounded-2xl bg-transparent md:mt-9">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:gap32 grid grid-cols-1 items-center gap-14 lg:grid-cols-12">
          <div className="w-full lg:col-span-6 xl:col-span-5 xl:-mx-0 2xl:-mx-5">
            <h1 className="py-8 text-center font-primary text-4xl font-bold leading-[50px] text-gray-900 sm:text-5xl sm:leading-[65px] lg:text-left">
              {title} <span className="text-primary-var-600">{subTitle}</span>
            </h1>
            <p className="text-center text-lg text-gray-500 lg:text-left">
              {text}
            </p>
            <div className="my-10 flex w-full justify-center lg:justify-start">
              <button
                onClick={() => handleClick()}
                className="nax-w-fit w-full cursor-pointer rounded-full bg-primary-var-600 px-7 py-3 text-base font-semibold text-white transition-all duration-500 hover:bg-primary-var-700 md:w-fit"
              >
                {buttonText}
              </button>
            </div>
          </div>
          <div className="block w-full lg:col-span-6 xl:col-span-7">
            <div className="w-full sm:w-auto lg:w-[60.8125rem] xl:ml-16">
              <img
                src={imageUrl}
                alt="Hero section"
                className="w-full rounded-l-3xl object-cover lg:h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero1;
