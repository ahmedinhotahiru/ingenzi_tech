import React, { useState } from "react";
import Title from "../common/Title.tsx";
import { FAQProps } from "../../types/types";

const Faq1: React.FC<FAQProps> = ({ questionsAndAnswers }) => {
  const [activeId, setActiveId] = useState<number | string | null>(null);

  const toggleQuestion = (id: number | string) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <section className="py-24">
      <div className="mx-auto max-w-screen-lg px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h6 className="mb-2 text-center text-lg font-medium text-primary-var-600">
            FAQs
          </h6>
          <Title title="Frequently asked questions" />
        </div>

        <div className="accordion-group">
          {questionsAndAnswers.map(({ id, question, answer }) => (
            <button
              key={id}
              onClick={() => toggleQuestion(id)}
              className={`accordion w-full rounded-2xl border-b border-solid border-gray-200 px-6 py-8 text-left transition-all duration-500 ${
                activeId === id
                  ? "bg-primary-var-50"
                  : "hover:bg-primary-var-50"
              }`}
              aria-expanded={activeId === id}
            >
              <div className="accordion-toggle flex items-center justify-between">
                <h5 className="text-gray-900 group-hover:text-primary-var-600">
                  {question}
                </h5>
                <svg
                  className={`text-gray-500 transition-transform duration-500 ${
                    activeId === id ? "rotate-180 text-primary-var-600" : ""
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
                  ></path>
                </svg>
              </div>
              <div
                className={`accordion-content overflow-hidden duration-500 ease-in-out ${
                  activeId === id ? "max-h-40" : "max-h-0"
                }`}
              >
                <p className="mt-4 text-base leading-6 text-gray-900">
                  {answer}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq1;
