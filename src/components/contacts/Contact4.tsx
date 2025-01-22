import React from "react";
import { ContactProps } from "../../types/types";
import Title from "../common/Title.tsx";
const Contact4: React.FC<ContactProps> = ({ contactDetails }) => {

  return (
    <section className="w-full bg-background">
      <div data-aos="flip-left" className="mx-auto max-w-screen-lg">
        <Title title="Contact" description="Get In Touch" />
        <p className="text-center font-light text-gray-500">
          Feel free to contact us, submit your queries here and we will get back
          to you as soon as possible
        </p>

        <div className="items-center justify-center gap-4 py-8 max-md:space-y-5 md:flex md:py-12">
          {contactDetails.map((item) => (
            <div
              key={item.id}
              className={`flex h-32 w-full flex-col items-center justify-center rounded-lg md:h-40 ${item.bgColor} ${item.textColor} shadow`}
            >
              {item.icon}
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact4;
