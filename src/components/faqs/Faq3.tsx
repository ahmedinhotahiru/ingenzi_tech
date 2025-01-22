import React, { useState } from "react";
import Title from "../common/Title.tsx";
import { FAQProps } from "../../types/types";

const Faq3: React.FC<FAQProps> = ({ questionsAndAnswers }) => {
  const [activeId, setActiveId] = useState<number | string | null>(null);

  const toggleQuestion = (id: number | string) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <section className="mx-auto max-w-screen-lg px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-full flex-col items-center justify-center gap-x-16 gap-y-5 max-lg:max-w-2xl lg:flex-row lg:justify-between xl:gap-28">
        <div className="w-full lg:w-1/2">
          <img
            src="https://pagedone.io/asset/uploads/1696230182.png"
            alt="FAQ tailwind section"
            className="w-full rounded-xl object-cover"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <div className="lg:max-w-xl">
            <div className="mb-6 lg:mb-8">
              <h6 className="mb-2 text-center text-lg font-medium text-primary-var-600 lg:text-left">
                FAQs
              </h6>
              <h2 className="mb-5 text-center text-3xl font-bold leading-[3.25rem] text-gray-900 md:text-4xl lg:text-left">
                Frequently asked questions
              </h2>
            </div>
            <div className="accordion-group">
              {questionsAndAnswers.map((item, index) => (
                <div
                  key={index}
                  className={`accordion border-b border-solid border-gray-200 py-8 ${
                    activeId === index ? "active" : ""
                  }`}
                >
                  <button
                    className="accordion-toggle accordion-active:text-primary-var-600 group inline-flex w-full items-center justify-between text-xl font-normal leading-8 text-gray-600 transition duration-500 hover:text-primary-var-600"
                    onClick={() => toggleQuestion(index)}
                    aria-expanded={activeId === index}
                  >
                    <h5>{item.question}</h5>
                    <svg
                      className={`text-gray-900 transition duration-500 group-hover:text-primary-var-600 ${
                        activeId === index ? "rotate-180" : ""
                      }`}
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.5 8.25L12.4142 12.3358C11.7475 13.0025 11.4142 13.3358 11 13.3358C10.5858 13.3358 10.2525 13.0025 9.58579 12.3358L5.5 8.25"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <div
                    className={`accordion-content transition-max-height w-full overflow-hidden px-0 pr-4 duration-500 ease-in-out ${
                      activeId === index ? "max-h-[200px]" : "max-h-0"
                    }`}
                  >
                    <p className="text-base font-normal text-gray-600">
                      {item.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq3;
