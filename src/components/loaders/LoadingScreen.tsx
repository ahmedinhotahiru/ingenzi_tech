import React from "react";
import DefaultLoader from "./defaultLoader.tsx";

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-primary-var-50 text-center">
      <div>
        <div className="mb-2 flex h-7 justify-center text-primary-var-500">
          <DefaultLoader height="1.75rem" />
        </div>
        <div>Loading...</div>
      </div>
    </div>
  );
};

export default LoadingScreen;
