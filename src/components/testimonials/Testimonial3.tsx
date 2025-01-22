import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Title from "../common/Title.tsx";
import "swiper/css";
import "swiper/css/pagination";
import { TestimonialProps } from "../../types/types";

const Testimonial3: React.FC<TestimonialProps> = ({ testimonials }) => {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Title title="TESTIMONIAL" description="What our happy users say!" />
      <div className="mb-14 items-center justify-center max-sm:gap-8 sm:flex sm:items-center sm:justify-between">
        <h2 className="text-center text-4xl font-bold text-gray-900 max-sm:hidden lg:text-left">
          Testimonials
        </h2>
        {/* Slider controls */}
        <div className="justify-center max-md:flex">
          <div className="flex items-center gap-5 md:gap-8">
            <button
              id="slider-button-left"
              className="group flex h-12 w-12 items-center justify-center rounded-full border border-solid border-primary-var-600 transition-all duration-500 hover:bg-primary-var-600"
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
              id="slider-button-right"
              className="group flex h-12 w-12 items-center justify-center rounded-full border border-solid border-primary-var-600 transition-all duration-500 hover:bg-primary-var-600"
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
      </div>
      {/* Slider wrapper */}
      <Swiper
        modules={[Pagination, Navigation]}
        navigation={{
          prevEl: "#slider-button-left",
          nextEl: "#slider-button-right",
        }}
        pagination={{ clickable: true }}
        loop={true}
        centeredSlides={true}
        breakpoints={{
          1024: {
            slidesPerView: 3,
            spaceBetween: 32,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 32,
          },
          640: {
            slidesPerView: 1,
            spaceBetween: 32,
          },
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
    </section>
  );
};

export default Testimonial3;
