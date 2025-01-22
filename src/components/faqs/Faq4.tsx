import React from "react";
import Title from "../common/Title.tsx";
import { FAQProps } from "../../types/types";

const Faq4: React.FC<FAQProps> = ({ questionsAndAnswers }) => {
  return (
    <section className="mx-auto max-w-screen-lg px-4 sm:px-6 lg:px-8">
      <Title title="FAQs" description="Frequently asked questions" />

      <div className="grid gap-8 text-left md:grid-cols-2">
        {questionsAndAnswers.map((item) => (
          <div className="flex gap-3 md:gap-5">
            <div className="-mt-2 flex h-10 min-h-10 w-10 min-w-10 items-center justify-center rounded-full bg-primary-var-500 p-1 text-white md:-mt-4 md:h-14 md:min-h-14 md:w-14 md:min-w-14">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M12.028 17.23q.332 0 .56-.228t.228-.56t-.23-.56q-.228-.228-.56-.228t-.56.229t-.227.56q0 .332.228.56q.23.228.561.228m-.517-3.312h.966q.038-.652.245-1.06q.207-.407.851-1.04q.67-.669.996-1.199t.327-1.226q0-1.182-.83-1.884q-.831-.702-1.966-.702q-1.079 0-1.832.586q-.753.587-1.103 1.348l.92.381q.24-.546.687-.965q.447-.42 1.29-.42q.972 0 1.42.534q.449.534.449 1.174q0 .52-.281.928q-.28.409-.73.822q-.87.802-1.14 1.36t-.269 1.363M12.003 21q-1.866 0-3.51-.708q-1.643-.709-2.859-1.924t-1.925-2.856T3 12.003t.709-3.51Q4.417 6.85 5.63 5.634t2.857-1.925T11.997 3t3.51.709q1.643.708 2.859 1.922t1.925 2.857t.709 3.509t-.708 3.51t-1.924 2.859t-2.856 1.925t-3.509.709M12 20q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"
                />
              </svg>
            </div>
            <div>
              <h3 className="mb-4 flex items-center text-xl font-medium text-gray-900">
                {item.question}
              </h3>
              <p className="text-gray-500">{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Faq4;
