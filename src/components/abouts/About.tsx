import React from "react";
import Title from "../common/Title.tsx";
import { AboutProps } from "../../types/types";

const About1: React.FC<AboutProps> = ({
  siteName,
  description,
  buttonText,
  handleClick,
}) => {
  return (
    <section>
      <Title title="ABOUT" description="About Us" />
      <div className="flex justify-center text-center">
        <div className="max-auto w-full max-w-screen-md">
          <h2 className="mb-5 font-primary text-2xl font-bold leading-normal text-gray-900 lg:text-4xl">
            <p>
              About <span className="text-primary-var-500">{siteName}</span>
            </p>
          </h2>
          <p className="text-base font-normal leading-relaxed text-gray-500">
            {description}
          </p>
          <button
            onClick={() => handleClick()}
            className="mt-8 w-full max-w-fit cursor-pointer rounded-full bg-primary-var-600 px-7 py-3 text-base font-semibold text-white transition-all duration-500 hover:bg-primary-var-700 md:w-fit"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </section>
  );
};

export default About1;
