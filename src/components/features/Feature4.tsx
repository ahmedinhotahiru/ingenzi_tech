import React from "react";
import Title from "../common/Title.tsx";
import { FeatureProps } from "../../types/types";

const Feature4: React.FC<FeatureProps> = ({ title, description, features }) => {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Title title="FEATURES" description="Our Services" />
      <div className="mb-10 flex flex-col items-center justify-center gap-x-0 gap-y-6 max-md:mx-auto max-md:max-w-lg lg:mb-16 lg:flex-row lg:justify-between lg:gap-y-0">
        <div className="relative w-full md:text-center lg:w-2/4 lg:text-left">
          <h2 className="mx-auto max-w-max font-primary text-2xl font-bold leading-[2rem] text-gray-900 lg:mx-0 lg:mb-6 lg:max-w-md lg:text-4xl lg:leading-[3.25rem]">
            {title}
          </h2>
        </div>
        <div className="relative w-full md:text-center lg:w-2/4 lg:text-left">
          <p className="mb-5 text-lg font-normal text-gray-500">
            {description}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-8 text-primary-var-500 md:flex-wrap lg:flex-row lg:flex-nowrap lg:justify-between lg:gap-x-8 lg:gap-y-0">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group relative w-full rounded-2xl bg-gray-100 p-4 transition-all duration-500 hover:bg-primary-var-600 max-md:mx-auto max-md:max-w-md md:h-64 md:w-2/5 xl:w-1/4 xl:p-7"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white">
              {feature.icon}
            </div>
            <h4 className="mb-3 text-xl font-semibold capitalize text-gray-900 transition-all duration-500 group-hover:text-white">
              {feature.title}
            </h4>
            <p className="text-sm font-normal leading-5 text-gray-500 transition-all duration-500 group-hover:text-white">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Feature4;
