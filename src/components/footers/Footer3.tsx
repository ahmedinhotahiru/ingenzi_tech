import React from "react";
import { Link } from "react-router-dom";
import { FooterProps } from "../../types/types";

const Footer3: React.FC<FooterProps> = ({
  siteName,
  logoUrl,
  scrollToTop,
  linkClicked,
  socialLinks,
  navLinks,
}) => {
  return (
    <footer className="w-full py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="flex w-full justify-center text-center">
            <div onClick={() => scrollToTop()} className="cursor-pointer">
              {logoUrl ? (
                <img src={logoUrl} className="h-6" alt={`${siteName} Logo`} />
              ) : (
                <span className="self-center whitespace-nowrap font-primary text-2xl font-semibold text-primary">
                  {siteName}
                </span>
              )}
            </div>
          </div>

          <ul className="text-md mb-10 flex flex-col items-center justify-center gap-7 border-b border-gray-200 py-16 transition-all duration-500 md:flex-row md:gap-12">
            {navLinks.map((link, index) => (
              <li key={index}>
                <button
                  onClick={() => linkClicked(link.toLowerCase())}
                  className="me-4 hover:text-primary-var-500 hover:underline max-md:py-1 md:me-6"
                >
                  {link}
                </button>
              </li>
            ))}
          </ul>
          <div className="mb-14 flex items-center justify-center space-x-10">
            {socialLinks.map((social) => (
              <Link
                key={social.platform}
                to={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ms-5 text-gray-500 hover:text-primary-var-500"
                aria-label={social.platform}
              >
                {social.icon}
              </Link>
            ))}
          </div>
          <span className="text-md block text-center text-gray-500">
            ©
            <span onClick={() => scrollToTop()} className="cursor-pointer">
              {siteName}
            </span>{" "}
            {new Date().getFullYear()}, All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer3;
