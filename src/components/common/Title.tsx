import React from "react";

interface TitleProps {
  title: string;
  description: string;
}

const Title: React.FC<TitleProps> = ({ title, description }) => {
  return (
    <div className="mb-14 text-center md:mb-16">
      <h6 className="text-md mb-2 text-center font-medium text-primary-var-600">
        {title}
      </h6>
      <h1 className="mb-4 text-center text-3xl font-bold leading-[3.25rem] text-gray-900 md:text-4xl">
        {description}
      </h1>
    </div>
  );
};

export default Title;
