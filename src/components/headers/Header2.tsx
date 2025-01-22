import React from "react";
import { HeaderProps } from "../../types/types";

const Header2: React.FC<HeaderProps> = ({
  siteName,
  logoUrl,
  buttonText,
  scrollToTop,
  buttonAction,
  linkClicked,
  navLinks,
  hasScrolled,
  isMenuOpen,
  toggleMenu,
}) => {
  return (
    <header
      className={`fixed start-0 top-0 z-[105] w-full bg-background bg-opacity-80 px-5 ${
        hasScrolled ? "border-b border-gray-200" : ""
      } md:py-2`}
    >
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
        {/* Company logo and name */}
        <div
          onClick={() => scrollToTop()}
          className="flex cursor-pointer items-center space-x-3 rtl:space-x-reverse"
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              className="h-5 md:h-6"
              alt={`${siteName} Logo`}
            />
          ) : (
            <span className="self-center whitespace-nowrap font-primary text-lg font-bold text-primary md:text-2xl">
              {siteName}
            </span>
          )}
        </div>

        {/* Hamburger menu */}
        <button
          onClick={toggleMenu}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 transition-all duration-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 md:hidden"
        >
          <span className="sr-only">Toggle menu</span>

          {/* Hamburger icon */}
          {!isMenuOpen ? (
            <svg
              className="h-5 w-5 transition-transform duration-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
              stroke="currentColor"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          ) : (
            // Close icon (X)
            <svg
              className="h-5 w-5 transition-all duration-700"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
                d="M20 20L4 4m16 0L4 20"
              />
            </svg>
          )}
        </button>

        <input type="checkbox" id="menu-toggle" className="peer hidden" />
        <div
          className={`max-h-0 overflow-hidden transition-all duration-700 ease-in-out ${
            isMenuOpen ? "max-h-96 opacity-100" : "opacity-0"
          } w-full items-center justify-between md:order-1 md:flex md:max-h-none md:w-auto md:opacity-100`}
        >
          <ul className="mt-4 flex w-full flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium max-md:mt-5 md:mt-0 md:flex-row md:items-center md:space-x-4 md:border-0 md:bg-white md:p-0 lg:space-x-8 rtl:space-x-reverse">
            {navLinks.map((link, index) => (
              <li key={index}>
                <button
                  onClick={() => linkClicked(link.toLowerCase())}
                  className="md::hover:bg-transparent block w-full rounded px-3 py-2 text-start capitalize text-gray-900 hover:bg-gray-100 md:p-0 md:hover:bg-transparent md:hover:text-primary-var-700"
                >
                  {link}
                </button>
              </li>
            ))}
            {/* Action Button */}
            <li className="mt-4 md:mt-0">
              <button
                type="button"
                className="w-full rounded-md bg-primary-var-600 px-7 py-2 text-center text-sm font-semibold text-white hover:bg-primary-var-700 focus:outline-none focus:ring-4 focus:ring-primary-var-300 md:w-auto"
                onClick={() => {
                  toggleMenu();
                  scrollToTop();
                  buttonAction();
                }}
              >
                {buttonText}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header2;
