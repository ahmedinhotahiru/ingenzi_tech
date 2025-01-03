import React from "react";

interface TitleProps {
  title: string;
}

const Title: React.FC<TitleProps> = ({ title }) => {
  return (
    <h1 className="font-primary-var mb-4 text-center font-primary text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl">
      {title}
    </h1>
  );
};

export default Title;
