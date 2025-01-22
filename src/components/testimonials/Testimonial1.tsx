import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Title from "../common/Title.tsx";
import "swiper/css";
import "swiper/css/pagination";
import { TestimonialProps } from "../../types/types";

const Testimonial1: React.FC<TestimonialProps> = ({ testimonials }) => {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Title title="TESTIMONIAL" description="What our happy users say!" />
      <Swiper
        modules={[Autoplay, Pagination]}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
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
            <div className="group cursor-pointer rounded-xl border border-solid border-gray-300 bg-white p-6 transition-all duration-500 hover:border-primary-var-600 hover:shadow-sm">
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

export default Testimonial1;
