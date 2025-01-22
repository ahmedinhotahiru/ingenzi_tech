import React, { useState } from "react";
import Title from "../common/Title.tsx";
import { FAQProps } from "../../types/types";

const Faq2: React.FC<FAQProps> = ({ questionsAndAnswers }) => {
  const [activeId, setActiveId] = useState<number | string | null>(null);

  const toggleQuestion = (id: number | string) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <section className="mx-auto max-w-screen-lg px-4 sm:px-6 lg:px-8">
      <Title title="FAQs" description="Frequently asked questions" />

      <div className="accordion-group">
        {questionsAndAnswers.map((faq, index) => (
          <div
            key={index}
            className={`accordion mb-8 rounded-xl border border-solid border-gray-300 p-4 transition duration-500 lg:p-4 ${
              activeId === index
                ? "border-primary-var-600 bg-primary-var-50"
                : "bg-white"
            }`}
          >
            <button
              className={`accordion-toggle group inline-flex w-full items-center justify-between text-left text-lg font-normal leading-8 text-gray-900 transition duration-500 hover:text-primary-var-600 ${
                activeId === index ? "font-medium text-primary-var-600" : ""
              }`}
              onClick={() => toggleQuestion(index)}
            >
              <h5>{faq.question}</h5>
              <svg
                className={`h-6 w-6 transition duration-500 ${
                  activeId === index ? "hidden" : "block"
                }`}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 12H18M12 18V6"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <svg
                className={`h-6 w-6 transition duration-500 ${
                  activeId === index ? "block" : "hidden"
                }`}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 12H18"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div
              className="accordion-content w-full overflow-hidden pr-4 transition-all"
              style={{
                maxHeight: activeId === index ? "250px" : "0",
              }}
            >
              <p className="text-base font-normal leading-6 text-gray-900">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Faq2;
