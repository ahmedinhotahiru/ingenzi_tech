import React, { ReactNode, useEffect, useState } from "react";
import { useSiteSettings } from "../context/index.tsx";
import {
  Header1,
  Header2,
  Header3,
  Header4,
} from "../components/headers/index.ts";
import {
  Footer1,
  Footer2,
  Footer3,
  Footer4,
} from "../components/footers/index.ts";
import LoadingScreen from "../components/loaders/LoadingScreen.tsx";

interface SocialLink {
  platform: string;
  url: string;
  icon: React.ReactNode;
}

interface DefaultLayoutProps {
  children: ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  const { siteSettings, loading } = useSiteSettings();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Function to toggle the menu state
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Effect to listen for scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Loader to display while fetching site settings
  if (loading || !siteSettings) {
    return <LoadingScreen />;
  }

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLinkClick = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      const yOffset = -200;
      const yPosition =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: yPosition,
        behavior: "smooth",
      });
    }
  };

  const handleButtonClick = () => {
    console.log("Button clicked!");
  };

  const socialLinks: SocialLink[] = [
    {
      platform: "Instagram",
      url: "https://instagram.com",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          className="h-5"
        >
          <path
            fill="currentColor"
            d="M8 5.67C6.71 5.67 5.67 6.72 5.67 8S6.72 10.33 8 10.33S10.33 9.28 10.33 8S9.28 5.67 8 5.67M15 8c0-.97 0-1.92-.05-2.89c-.05-1.12-.31-2.12-1.13-2.93c-.82-.82-1.81-1.08-2.93-1.13C9.92 1 8.97 1 8 1s-1.92 0-2.89.05c-1.12.05-2.12.31-2.93 1.13C1.36 3 1.1 3.99 1.05 5.11C1 6.08 1 7.03 1 8s0 1.92.05 2.89c.05 1.12.31 2.12 1.13 2.93c.82.82 1.81 1.08 2.93 1.13C6.08 15 7.03 15 8 15s1.92 0 2.89-.05c1.12-.05 2.12-.31 2.93-1.13c.82-.82 1.08-1.81 1.13-2.93c.06-.96.05-1.92.05-2.89m-7 3.59c-1.99 0-3.59-1.6-3.59-3.59S6.01 4.41 8 4.41s3.59 1.6 3.59 3.59s-1.6 3.59-3.59 3.59m3.74-6.49c-.46 0-.84-.37-.84-.84s.37-.84.84-.84s.84.37.84.84a.8.8 0 0 1-.24.59a.8.8 0 0 1-.59.24Z"
          />
        </svg>
      ),
    },
    {
      platform: "TikTok",
      url: "https://tiktok.com",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-5"
        >
          <path
            fill="currentColor"
            d="M19.321 5.562a5 5 0 0 1-.443-.258a6.2 6.2 0 0 1-1.137-.966c-.849-.971-1.166-1.956-1.282-2.645h.004c-.097-.573-.057-.943-.05-.943h-3.865v14.943q.002.3-.008.595l-.004.073q0 .016-.003.033v.009a3.28 3.28 0 0 1-1.65 2.604a3.2 3.2 0 0 1-1.6.422c-1.8 0-3.26-1.468-3.26-3.281s1.46-3.282 3.26-3.282c.341 0 .68.054 1.004.16l.005-3.936a7.18 7.18 0 0 0-5.532 1.62a7.6 7.6 0 0 0-1.655 2.04c-.163.281-.779 1.412-.853 3.246c-.047 1.04.266 2.12.415 2.565v.01c.093.262.457 1.158 1.049 1.913a7.9 7.9 0 0 0 1.674 1.58v-.01l.009.01c1.87 1.27 3.945 1.187 3.945 1.187c.359-.015 1.562 0 2.928-.647c1.515-.718 2.377-1.787 2.377-1.787a7.4 7.4 0 0 0 1.296-2.153c.35-.92.466-2.022.466-2.462V8.273c.047.028.672.441.672.441s.9.577 2.303.952c1.006.267 2.363.324 2.363.324V6.153c-.475.052-1.44-.098-2.429-.59"
          />
        </svg>
      ),
    },
    {
      platform: "Facebook",
      url: "https://facebook.com",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-5"
        >
          <path
            fill="currentColor"
            d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95"
          />
        </svg>
      ),
    },
    {
      platform: "Twitter",
      url: "https://twitter.com",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="h-5"
        >
          <path
            fill="currentColor"
            d="M389.2 48h70.6L305.6 224.2L487 464H345L233.7 318.6L106.5 464H35.8l164.9-188.5L26.8 48h145.6l100.5 132.9zm-24.8 373.8h39.1L151.1 88h-42z"
          />
        </svg>
      ),
    },
    {
      platform: "LinkedIn",
      url: "https://linkedin.com",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-5"
        >
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M9.429 8.969h3.714v1.85c.535-1.064 1.907-2.02 3.968-2.02c3.951 0 4.889 2.118 4.889 6.004V22h-4v-6.312c0-2.213-.535-3.461-1.897-3.461c-1.889 0-2.674 1.345-2.674 3.46V22h-4zM2.57 21.83h4V8.799h-4zM7.143 4.55a2.53 2.53 0 0 1-.753 1.802a2.57 2.57 0 0 1-1.82.748a2.6 2.6 0 0 1-1.8-1.77a2.57 2.57 0 0 1 .755-1.8a2.56 2.56 0 0 1 1.801-.75a2.57 2.57 0 0 1 1.774 1.77"
          />
        </svg>
      ),
    },
    {
      platform: "YouTube",
      url: "https://youtube.com",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6"
          viewBox="0 0 24 24"
        >
          <mask id="lineMdYoutubeFilled0">
            <g
              fill="none"
              fill-opacity="0"
              stroke="#fff"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            >
              <path
                fill="#fff"
                stroke-dasharray="64"
                stroke-dashoffset="64"
                d="M12 5c9 0 9 0 9 7c0 7 0 7 -9 7c-9 0 -9 0 -9 -7c0 -7 0 -7 9 -7Z"
              >
                <animate
                  fill="freeze"
                  attributeName="fill-opacity"
                  begin="0.6s"
                  dur="0.5s"
                  values="0;1"
                />
                <animate
                  fill="freeze"
                  attributeName="stroke-dashoffset"
                  dur="0.6s"
                  values="64;0"
                />
              </path>
              <path fill="#000" stroke="none" d="M12 11L12 12L12 13z">
                <animate
                  fill="freeze"
                  attributeName="d"
                  begin="1.1s"
                  dur="0.2s"
                  values="M12 11L12 12L12 13z;M10 8.5L16 12L10 15.5z"
                />
                <set
                  fill="freeze"
                  attributeName="fill-opacity"
                  begin="1.1s"
                  to="1"
                />
              </path>
            </g>
          </mask>
          <rect
            width="24"
            height="24"
            fill="currentColor"
            mask="url(#lineMdYoutubeFilled0)"
          />
        </svg>
      ),
    },
  ];

  const updatedSocialLinks = socialLinks
    .filter((link) => siteSettings.contact[link.platform.toLowerCase()])
    .map((link) => ({
      ...link,
      url: siteSettings.contact[link.platform.toLowerCase()],
    }));

  const Data = {
    siteName: siteSettings.business_info?.name || "",
    logoUrl: siteSettings.properties?.logo,
    buttonText: siteSettings.call_to_action[0]?.button_text,
    scrollToTop: handleScrollToTop,
    buttonAction: handleButtonClick,
    linkClicked: handleLinkClick,
    navLinks: siteSettings.properties?.navLinks!,
    socialLinks: updatedSocialLinks,
    isMenuOpen,
    hasScrolled,
    toggleMenu,
    description: siteSettings.business_info?.value_proposition,
    contact: {
      location: siteSettings.contact?.location,
      phone: siteSettings.contact?.phone,
      email: siteSettings.contact?.email,
    },
  };

  const headers = [Header1, Header2, Header3, Header4];
  const footers = [Footer1, Footer2, Footer3, Footer4];

  const headerType = siteSettings.properties?.headerType || 1;
  const footerType = siteSettings.properties?.footerType || 1;

  return (
    <main className="w-full transition-all duration-700 ease-in-out">
      {React.createElement(headers[headerType - 1], { ...Data })}
      <section className="pt-16">{children}</section>
      <div className="pt-16 md:pt-24">
        {React.createElement(footers[footerType - 1], { ...Data })}
      </div>
    </main>
  );
};

export default DefaultLayout;
