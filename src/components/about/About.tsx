import React from "react";

const About1: React.FC = () => {
  return (
    <section className="relative py-24">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-5 lg:px-5">
        <div className="grid w-full grid-cols-1 items-center justify-start gap-12 lg:grid-cols-2">
          {/* Images Section */}
          <div className="order-last grid w-full grid-cols-1 items-start justify-center gap-6 sm:grid-cols-2 lg:order-first">
            <div className="flex items-start justify-start gap-2.5 pt-24 sm:justify-end lg:justify-center">
              <img
                className="rounded-xl object-cover"
                src="https://pagedone.io/asset/uploads/1717741205.png"
                alt="About Us"
              />
            </div>
            <img
              className="ml-auto rounded-xl object-cover sm:ml-0"
              src="https://pagedone.io/asset/uploads/1717741215.png"
              alt="About Us"
            />
          </div>

          {/* Content Section */}
          <div className="inline-flex w-full flex-col items-center justify-center gap-10 lg:items-start">
            <div className="flex w-full flex-col items-start justify-center gap-8">
              {/* Heading and Description */}
              <div className="flex w-full flex-col items-center justify-start gap-3 lg:items-start">
                <h2 className="text-center font-primary text-4xl font-bold leading-normal text-gray-900 lg:text-start">
                  Empowering Each Other to Succeed
                </h2>
                <p className="text-center text-base font-normal leading-relaxed text-gray-500 lg:text-start">
                  Every project we've undertaken has been a collaborative
                  effort, where every person involved has left their mark.
                  Together, we've not only constructed buildings but also built
                  enduring connections that define our success story.
                </p>
              </div>

              {/* Statistics */}
              <div className="inline-flex w-full items-center justify-center gap-5 sm:gap-10 lg:justify-start">
                <div className="inline-flex flex-col items-start justify-start">
                  <h3 className="font-manrope text-4xl font-bold leading-normal text-gray-900">
                    33+
                  </h3>
                  <h6 className="text-base font-normal leading-relaxed text-gray-500">
                    Years of Experience
                  </h6>
                </div>
                <div className="inline-flex flex-col items-start justify-start">
                  <h4 className="font-manrope text-4xl font-bold leading-normal text-gray-900">
                    125+
                  </h4>
                  <h6 className="text-base font-normal leading-relaxed text-gray-500">
                    Successful Projects
                  </h6>
                </div>
                <div className="inline-flex flex-col items-start justify-start">
                  <h4 className="font-manrope text-4xl font-bold leading-normal text-gray-900">
                    52+
                  </h4>
                  <h6 className="text-base font-normal leading-relaxed text-gray-500">
                    Happy Clients
                  </h6>
                </div>
              </div>
            </div>

            {/* Button */}
            <button className="flex w-full items-center justify-center rounded-lg bg-primary-var-600 px-3.5 py-2 shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] transition-all duration-700 ease-in-out hover:bg-primary-var-800 sm:w-fit">
              <span className="px-1.5 text-sm font-medium leading-6 text-white">
                Read More
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About1;
