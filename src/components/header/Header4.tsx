import React from "react";
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

const Header4: React.FC<HeaderProps> = ({ headerData }) => {
  const { siteName, logoUrl, buttonText, scrollToTop, buttonAction, navLinks } =
    headerData;

  // Function to handle scrolling to a specific section
  const handleLinkClick = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="bg-white :bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 :border-gray-600 py-2">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Company logo and name with scroll to top */}
        <div
          onClick={() => scrollToTop()}
          className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer"
        >
          {logoUrl ? (
            <img src={logoUrl} className="h-8" alt={`${siteName} Logo`} />
          ) : (
            <span className="self-center text-2xl font-semibold whitespace-nowrap :text-white">
              {siteName}
            </span>
          )}
        </div>

        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
            onClick={() => {
              scrollToTop();
              buttonAction();
            }}
          >
            {buttonText}
          </button>
          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="navbar-sticky"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>

        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-sticky"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
            {navLinks.map((link, index) => (
              <li key={index}>
                <button
                  onClick={() => handleLinkClick(link.toLowerCase())} // Handle section scroll
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md::hover:text-blue-500 :text-white :hover:bg-gray-700 :hover:text-white md::hover:bg-transparent :border-gray-700 capitalize"
                >
                  {link}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header4;
