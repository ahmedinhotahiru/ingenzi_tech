import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import Title from "../common/Title.tsx";
import "swiper/css";
import "swiper/css/pagination";
import { TestimonialProps } from "../../types/types";

const Testimonial4: React.FC<TestimonialProps> = ({ testimonials }) => {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Title title="TESTIMONIAL" description="What our happy users say!" />

      <div className="mx-auto flex max-w-sm flex-wrap items-center justify-center gap-y-8 sm:max-w-2xl md:flex-wrap lg:max-w-full lg:flex-row lg:flex-nowrap lg:justify-between lg:gap-x-8 lg:gap-y-0">
        <div className="w-full lg:w-2/5">
          <h2 className="mb-8 text-4xl font-bold leading-[3.25rem] text-gray-900">
            23k+ Customers gave their{" "}
            <span className="to-secondry-var-600 bg-gradient-to-tr from-primary-var-600 bg-clip-text text-transparent">
              Feedback
            </span>
          </h2>
          {/* Slider controls */}
          <div className="flex items-center justify-center gap-10 lg:justify-start">
            <button
              id="swiper-button-prev"
              className="group flex h-12 w-12 items-center justify-center rounded-lg border border-solid border-primary-var-600 transition-all duration-500 hover:bg-primary-var-600"
              aria-label="Previous"
            >
              <svg
                className="h-6 w-6 text-primary-var-600 group-hover:text-white"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.9999 12L4.99992 12M9.99992 6L4.70703 11.2929C4.3737 11.6262 4.20703 11.7929 4.20703 12C4.20703 12.2071 4.3737 12.3738 4.70703 12.7071L9.99992 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              id="swiper-button-next"
              className="group flex h-12 w-12 items-center justify-center rounded-lg border border-solid border-primary-var-600 transition-all duration-500 hover:bg-primary-var-600"
              aria-label="Next"
            >
              <svg
                className="h-6 w-6 text-primary-var-600 group-hover:text-white"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 12L19 12M14 18L19.2929 12.7071C19.6262 12.3738 19.7929 12.2071 19.7929 12C19.7929 11.7929 19.6262 11.6262 19.2929 11.2929L14 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="w-full lg:w-3/5">
          {/* Slider */}
          <Swiper
            modules={[Navigation, Pagination]}
            slidesPerView={2}
            spaceBetween={28}
            loop
            navigation={{
              nextEl: "#swiper-button-next",
              prevEl: "#swiper-button-prev",
            }}
            pagination={{ clickable: true }}
            breakpoints={{
              0: { slidesPerView: 1, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 28 },
              1024: { slidesPerView: 2, spaceBetween: 32 },
            }}
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="group rounded-xl border border-solid border-gray-300 bg-white p-6 transition-all duration-500 hover:border-primary-var-600 hover:shadow-sm">
                  <p className="pb-8 text-base leading-6 text-gray-600 group-hover:text-gray-800">
                    {testimonial.quote}
                  </p>
                  <div className="flex items-center gap-5 border-t border-solid border-gray-200 pt-5">
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={testimonial.photo}
                      alt={`${testimonial.name}'s avatar`}
                    />
                    <div>
                      <h5 className="mb-1 font-medium text-gray-900">
                        {testimonial.name}
                      </h5>
                      <span className="text-sm text-gray-500">
                        {testimonial.title}
                      </span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Testimonial4;
