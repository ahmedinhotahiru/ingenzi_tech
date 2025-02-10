import React from "react";
import { Link } from "react-router-dom";
import { FooterProps } from "../../types/types";

const Footer4: React.FC<FooterProps> = ({
  siteName,
  logoUrl,
  scrollToTop,
  linkClicked,
  socialLinks,
  navLinks,
  description,
  contact,
}) => {
  return (
    <footer className="w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 gap-y-8 py-10 max-sm:mx-auto max-sm:max-w-sm sm:grid-cols-4 md:gap-8 lg:grid-cols-5">
          <div className="col-span-full mb-10 lg:col-span-2 lg:mb-0">
            <div className="justify-center max-lg:flex">
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
            <p className="py-8 text-center text-sm text-gray-500 lg:max-w-xs lg:text-left">
              {description}
            </p>
          </div>

          <div className="text-left lg:mx-auto">
            <h4 className="mb-7 text-lg font-medium text-gray-900">
              Quick Links
            </h4>
            <ul className="text-sm transition-all duration-500 [&_li]:mb-6">
              {navLinks?.map((link, index) => (
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
          </div>

          <div className="text-left lg:mx-auto">
            <h4 className="mb-7 text-lg font-medium text-gray-900">
              Contact Us
            </h4>

            <ul className="text-sm transition-all duration-500">
              <li className="mb-6">
                <span className="text-gray-600 hover:text-gray-900">
                  {contact?.email}
                </span>
              </li>
              <li className="mb-6">
                <span className="text-gray-600 hover:text-gray-900">
                  {contact?.phone}
                </span>
              </li>
              <li className="mb-6">
                <span className="text-gray-600 hover:text-gray-900">
                  {contact?.location}
                </span>
              </li>
            </ul>

            <button
              onClick={() => linkClicked("contacts")}
              className="mx-auto block h-9 w-fit cursor-pointer rounded-full bg-primary-var-600 px-5 py-2.5 text-xs text-white shadow-sm transition-all duration-500 hover:bg-primary-var-700 lg:mx-0"
            >
              Contact us
            </button>
          </div>

          <div className="text-left lg:mx-auto">
            <h4 className="mb-7 text-lg font-medium text-gray-900">
              Social Links
            </h4>
            <div className="mt-4 flex space-x-4 sm:justify-center lg:mt-0">
              {socialLinks.map((social) => (
                <Link
                  key={social.platform}
                  to={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-700 text-white hover:bg-primary-var-500"
                  aria-label={social.platform}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 py-7">
          <div className="flex flex-col items-center justify-center">
            <span className="text-md block text-center text-gray-500">
              ©
              <span onClick={() => scrollToTop()} className="cursor-pointer">
                {siteName}
              </span>{" "}
              {new Date().getFullYear()}, All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer4;
