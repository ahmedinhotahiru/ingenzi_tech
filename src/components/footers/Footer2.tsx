import React from "react";
import { Link } from "react-router-dom";
import { FooterProps } from "../../types/types";

const Footer2: React.FC<FooterProps> = ({
  siteName,
  logoUrl,
  scrollToTop,
  linkClicked,
  socialLinks,
  navLinks,
}) => {
  return (
    <footer className="flex justify-center bg-background px-5 py-4">
      <div className="mx-auto w-full max-w-screen-xl py-4 md:py-8">
        <div className="flex items-center justify-center">
          <div className="mt-4 flex sm:mt-0 sm:justify-center">
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
        </div>

        <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />

        <div className="w-full items-center justify-center text-[#727377] md:flex md:justify-between">
          <div className="flex justify-center max-md:flex max-md:w-full md:order-2">
            <ul className="mb-6 flex flex-wrap items-center text-sm font-medium md:mb-0">
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

          <div className="justify-center max-md:flex max-md:w-full">
            <div className="flex items-center gap-3 text-sm">
              <div onClick={() => scrollToTop()} className="cursor-pointer">
                <img src={logoUrl} className="h-4" alt={`${siteName} Logo`} />
              </div>

              <div className="max-md:text-sm">
                COPYRIGHT © {new Date().getFullYear()}
                <span
                  onClick={() => scrollToTop()}
                  className="pl-1 hover:cursor-pointer hover:underline"
                >
                  {siteName}.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer2;
