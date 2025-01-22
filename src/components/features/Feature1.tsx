import React from "react";
import Title from "../common/Title.tsx";
import { FeatureProps } from "../../types/types";

const Feature1: React.FC<FeatureProps> = ({ title, description, features }) => {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Title title="FEATURES" description="Our Services" />
      <div className="flex justify-center">
        <div className="mb-10 w-full max-w-screen-md text-center">
          <p className="mb-5 text-lg font-normal text-gray-500">
            {description}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-8 text-primary-var-500 md:flex-wrap lg:flex-row lg:flex-nowrap lg:justify-between lg:gap-x-4 lg:gap-y-0">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group relative w-full rounded-2xl bg-gray-100 p-4 transition-all duration-500 hover:bg-primary-var-500 max-md:mx-auto max-md:max-w-md md:w-2/5 xl:w-1/4 xl:p-7"
          >
            <div className="mb-5 flex items-center justify-center bg-white">
              <img
                src={feature.image}
                alt="Feature"
                className="max-h-[170px] w-full object-cover"
              />
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

export default Feature1;
