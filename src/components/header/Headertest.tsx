import React, { useState } from "react";

interface HeaderProps {
  headerData: {
    siteName: string;
    logoUrl: string;
    buttonText: string;
    scrollToTop: () => void;
    buttonAction: () => void;
    navLinks: string[];
  };
}

const Header1: React.FC<HeaderProps> = ({ headerData }) => {
  const { siteName, logoUrl, buttonText, scrollToTop, buttonAction, navLinks } =
    headerData;

  // State to track whether the menu is open or not
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to handle link click (smooth scroll)
  const handleLinkClick = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Toggle menu state
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <>
      <header className="bg-background fixed w-full z-20 top-0 start-0 border-b border-gray-200 md:py-2 md:bg-opacity-25">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          {/* Company logo and name */}
          <div
            onClick={() => scrollToTop()}
            className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer"
          >
            {logoUrl ? (
              <img src={logoUrl} className="h-8" alt={`${siteName} Logo`} />
            ) : (
              <span className="self-center text-lg font-primary font-bold text-primary whitespace-nowrap :text-white">
                {siteName}
              </span>
            )}
          </div>

          {/* Action button for larger screens */}
          <div className="hidden md:flex md:order-2 space-x-3">
            <button
              type="button"
              className="text-white bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded shadow-lg text-sm px-4 py-2 text-center"
              onClick={() => {
                scrollToTop();
                buttonAction();
              }}
            >
              {buttonText}
            </button>
          </div>

          {/* Hamburger menu */}
          <button
            onClick={toggleMenu}
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-300"
          >
            <span className="sr-only">Toggle menu</span>

            {/* Hamburger icon */}
            {!isMenuOpen ? (
              <svg
                className="w-5 h-5 transition-transform duration-700"
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
                className="w-5 h-5 transition-all duration-700"
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

          <div
            className={`transition-all duration-700 ease-in-out max-h-0 overflow-hidden ${
              isMenuOpen ? "max-h-96 opacity-100" : "opacity-0"
            } md:opacity-100 md:max-h-none md:flex items-center justify-between w-full md:w-auto md:order-1`}
          >
            <ul className="w-full flex flex-col md:items-center p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg max-md:mt-5 bg-gray-50 md:space-x-4 lg:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleLinkClick(link.toLowerCase())}
                    className="block py-2 px-3 text-gray-900 text-start w-full rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md::hover:text-blue-500 :text-white :hover:bg-gray-700 :hover:text-white md::hover:bg-transparent :border-gray-700 capitalize"
                  >
                    {link}
                  </button>
                </li>
              ))}
              {/* Action Button for smaller screens */}
              <li className="mt-4 md:hidden">
                <button
                  type="button"
                  className="w-full text-white bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
                  onClick={() => {
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
    </>
  );
};

export default Header1;
