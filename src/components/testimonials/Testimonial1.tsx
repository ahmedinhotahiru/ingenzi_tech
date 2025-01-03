import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Title from "../common/Title.tsx";
import "swiper/css";
import "swiper/css/pagination";
import { TestimonialProps } from "../../types/types";

const Testimonial1: React.FC<TestimonialProps> = ({ testimonials }) => {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <span className="mb-2 block text-sm font-medium text-primary-var-500">
            TESTIMONIAL
          </span>
          <Title title="What our happy users say!" />
        </div>
        <Swiper
          modules={[Autoplay, Pagination]}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          spaceBetween={32}
          loop={true}
          centeredSlides={true}
          slidesPerView={3}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 32,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 32,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 32,
            },
          }}
          className="mySwiper"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="group rounded-xl border border-solid border-gray-300 bg-white p-6 transition-all duration-500 hover:border-indigo-600 hover:shadow-sm">
                <p className="pb-8 text-base leading-6 text-gray-600 group-hover:text-gray-800">
                  {testimonial.text}
                </p>
                <div className="flex items-center gap-5 border-t border-solid border-gray-200 pt-5">
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={testimonial.image}
                    alt={`${testimonial.name}'s avatar`}
                  />
                  <div>
                    <h5 className="mb-1 font-medium text-gray-900">
                      {testimonial.name}
                    </h5>
                    <span className="text-sm text-gray-500">
                      {testimonial.role}
                    </span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonial1;
