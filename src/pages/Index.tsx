import React from "react";
import { useSiteSettings } from "../context/index.tsx";
import { ContactForm } from "../types/types";
import About1 from "../components/abouts/About.tsx";
import { Hero1, Hero2, Hero3, Hero4 } from "../components/hero/index.ts";
import { Faq1, Faq2, Faq3, Faq4 } from "../components/faqs/index.ts";
import {
  Testimonial1,
  Testimonial2,
  Testimonial3,
  Testimonial4,
} from "../components/testimonials/index.ts";
import {
  Contact1,
  Contact2,
  Contact3,
  Contact4,
} from "../components/contacts/index.ts";
import {
  Feature1,
  Feature2,
  Feature3,
  Feature4,
} from "../components/features/index.ts";

const Index: React.FC = () => {
  const { siteSettings } = useSiteSettings();

  const handleSubmit = (value: ContactForm) => {
    console.log("values: ", value);
  };
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const contactDetails = [
    {
      id: 1,
      bgColor: "bg-primary-var-50",
      textColor: "text-black",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="mb-2 h-8 w-8"
        >
          <path
            fill="currentColor"
            d="M12.004 11.73q.667 0 1.14-.475t.472-1.143t-.476-1.14t-1.143-.472t-1.14.476t-.472 1.143t.475 1.14t1.144.472M12 19.677q2.82-2.454 4.458-4.991t1.638-4.39q0-2.744-1.737-4.53Q14.62 3.981 12 3.981T7.641 5.766t-1.737 4.53q0 1.852 1.638 4.39T12 19.677m0 1.342q-3.525-3.117-5.31-5.814q-1.786-2.697-1.786-4.909q0-3.173 2.066-5.234Q9.037 3 12 3t5.03 2.062q2.066 2.061 2.066 5.234q0 2.212-1.785 4.909q-1.786 2.697-5.311 5.814m0-10.903"
          />
        </svg>
      ),
      text: siteSettings.contact?.location,
    },
    {
      id: 2,
      bgColor: "bg-primary-var-600",
      textColor: "text-white",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="mb-2 h-8 w-8"
        >
          <path
            fill="currentColor"
            d="M19.95 21q-3.125 0-6.175-1.362t-5.55-3.863t-3.862-5.55T3 4.05q0-.45.3-.75t.75-.3H8.1q.35 0 .625.238t.325.562l.65 3.5q.05.4-.025.675T9.4 8.45L6.975 10.9q.5.925 1.187 1.787t1.513 1.663q.775.775 1.625 1.438T13.1 17l2.35-2.35q.225-.225.588-.337t.712-.063l3.45.7q.35.1.575.363T21 15.9v4.05q0 .45-.3.75t-.75.3"
          />
        </svg>
      ),
      text: siteSettings.contact?.phone,
    },
    {
      id: 3,
      bgColor: "bg-primary-var-50",
      textColor: "text-black",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="mb-2 h-8 w-8"
        >
          <path
            fill="currentColor"
            d="M4.616 19q-.691 0-1.153-.462T3 17.384V6.616q0-.691.463-1.153T4.615 5h14.77q.69 0 1.152.463T21 6.616v10.769q0 .69-.463 1.153T19.385 19zM20 6.885l-7.552 4.944q-.106.055-.214.093q-.109.037-.234.037t-.234-.037t-.214-.093L4 6.884v10.5q0 .27.173.443t.443.173h14.769q.269 0 .442-.173t.173-.443zM12 11l7.692-5H4.308zM4 6.885v.211v-.811v.034V6v.32v-.052v.828zV18z"
          />
        </svg>
      ),
      text: siteSettings.contact?.email,
    },
  ];

  const Data = {
    imageUrl: siteSettings.business_info?.image,
    tagline: siteSettings.business_info?.tagline,
    subTagline: siteSettings.business_info?.subTagline,
    headline: siteSettings.business_info?.headline,
    buttonText: siteSettings.call_to_action[0]?.title,
    contactDetails,
    submitted: handleSubmit,
    handleClick,
  };

  const aboutdata = {
    siteName: siteSettings.business_info?.name,
    description: siteSettings.business_info?.value_proposition,
    buttonText: siteSettings.call_to_action[1]?.title || "Explore more",
    handleClick,
  };

  const featureData = {
    title: "Enjoy the finest features with our products",
    description:
      " We provide all the advantages that can simplify all your financial transactions without any further requirements",
    // features: [
    //   {
    //     title: "Easy Payment",
    //     description:
    //       "We provide various methods for you to carry out all transactions related to your finances.",
    //     icon: (
    //       <svg
    //         width="30"
    //         height="30"
    //         viewBox="0 0 30 30"
    //         fill="none"
    //         xmlns="http://www.w3.org/2000/svg"
    //       >
    //         <path
    //           d="M24.7222 11.6667V7.22225C24.7222 5.99495 23.7273 5 22.5 5H4.72222C3.49492 5 2.5 5.99492 2.5 7.22222V22.7778C2.5 24.0051 3.49492 25 4.72222 25H22.5C23.7273 25 24.7222 24.005 24.7222 22.7777V17.7778M20.8333 17.7778H25.2778C26.5051 17.7778 27.5 16.7829 27.5 15.5556V13.8889C27.5 12.6616 26.5051 11.6667 25.2778 11.6667H20.8333C19.606 11.6667 18.6111 12.6616 18.6111 13.8889V15.5556C18.6111 16.7829 19.606 17.7778 20.8333 17.7778Z"
    //           stroke="currentColor"
    //           strokeWidth="2"
    //         />
    //       </svg>
    //     ),
    //   },
    //   {
    //     title: "Safe Transaction",
    //     description:
    //       "We have the most up-to-date security to support the safety of all our customers in carrying out transactions.",
    //     icon: (
    //       <svg
    //         width="30"
    //         height="30"
    //         viewBox="0 0 30 30"
    //         fill="none"
    //         xmlns="http://www.w3.org/2000/svg"
    //       >
    //         <path
    //           d="M14.375 15.8571C16.1009 15.8571 17.5 14.458 17.5 12.7321C17.5 11.0062 16.1009 9.6071 14.375 9.6071C12.6491 9.6071 11.25 11.0062 11.25 12.7321C11.25 14.458 12.6491 15.8571 14.375 15.8571ZM14.375 15.8571V20.8571M3.75 13.2264V15.2343C3.75 17.6868 3.75 18.9131 4.27747 19.9685C4.80493 21.0239 5.78567 21.76 7.74715 23.2322L8.57248 23.8516C11.4626 26.0208 12.9077 27.1054 14.5753 27.1054C16.243 27.1054 17.688 26.0208 20.5782 23.8516L21.4035 23.2322C23.365 21.76 24.3457 21.0239 24.8732 19.9685C25.4006 18.9131 25.4006 17.6868 25.4006 15.2343V13.2264C25.4006 9.95932 25.4006 8.32576 24.546 7.05852C23.6913 5.79128 22.1768 5.17918 19.1477 3.95499L18.3223 3.62144C16.4724 2.87381 15.5475 2.5 14.5753 2.5C13.6032 2.5 12.6782 2.87381 10.8283 3.62144L10.003 3.95499C6.97389 5.17919 5.45934 5.79128 4.60467 7.05852C3.75 8.32576 3.75 9.95932 3.75 13.2264Z"
    //           stroke="currentColor"
    //           strokeWidth="2"
    //           strokeLinecap="round"
    //           strokeLinejoin="round"
    //         />
    //       </svg>
    //     ),
    //   },
    //   {
    //     title: "Fast Customer Service",
    //     description:
    //       "We provide 24/7 customer service to help you resolve any issues promptly.",
    //     icon: (
    //       <svg
    //         width="30"
    //         height="30"
    //         viewBox="0 0 30 30"
    //         fill="none"
    //         xmlns="http://www.w3.org/2000/svg"
    //       >
    //         <path
    //           d="M15.0067 10V15.6652C15.0067 16.0358 15.1712 16.3873 15.4556 16.6248L18.75 19.375M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z"
    //           stroke="currentColor"
    //           strokeWidth="2"
    //           strokeLinecap="round"
    //           strokeLinejoin="round"
    //         />
    //       </svg>
    //     ),
    //   },
    //   {
    //     title: "Quick Transaction",
    //     description:
    //       "We provide faster transaction speeds than competitors, ensuring money arrives and is received quickly.",
    //     icon: (
    //       <svg
    //         width="30"
    //         height="30"
    //         viewBox="0 0 30 30"
    //         fill="none"
    //         xmlns="http://www.w3.org/2000/svg"
    //       >
    //         <path
    //           d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z"
    //           stroke="currentColor"
    //           strokeWidth="2"
    //           strokeLinecap="round"
    //           strokeLinejoin="round"
    //         />
    //       </svg>
    //     ),
    //   },
    // ],
    features: siteSettings.product_services_features,
  };

  const contactType = siteSettings.properties?.contactType || 1;
  const heroType = siteSettings.properties?.heroType || 1;
  const faqType = siteSettings.properties?.faqType || 1;
  const testimonialType = siteSettings.properties?.testimonialType || 1;
  const featureType = siteSettings.properties?.featureType || 1;
  const aboutType = siteSettings.properties?.aboutType || 1;

  const contacts = [Contact1, Contact2, Contact3, Contact4];
  const heroSections = [Hero1, Hero2, Hero3, Hero4];
  const faqs = [Faq1, Faq2, Faq3, Faq4];
  const questionsAndAnswers = siteSettings?.faqs;
  const testmonials = [Testimonial1, Testimonial2, Testimonial3, Testimonial4];
  const features = [Feature1, Feature2, Feature3, Feature4];
  const aboutSections = [About1];

  const testimonials = siteSettings?.testimonials;

  return (
    <div className="w-full space-y-20 md:space-y-40">
      {/* Hero section */}
      <div data-aos="fade-up" id="home" className="flex w-full justify-center">
        {React.createElement(heroSections[heroType - 1], {
          ...Data,
        })}
      </div>
      {/* About section */}
      <div className="flex w-full justify-center px-5">
        {" "}
        <div data-aos="fade-up" id="about" className="w-full max-w-screen-xl">
          {React.createElement(aboutSections[aboutType - 1], { ...aboutdata })}
        </div>
      </div>

      {/* Features section */}
      <div className="flex w-full justify-center px-5">
        {" "}
        <div
          data-aos="fade-up"
          id="features"
          className="w-full max-w-screen-xl"
        >
          {React.createElement(features[featureType - 1], { ...featureData })}
        </div>
      </div>

      {/* Testimonials section */}
      <div className="flex w-full justify-center px-5">
        {" "}
        <div
          data-aos="fade-up"
          id="testimonials"
          className="w-full max-w-screen-xl"
        >
          {React.createElement(testmonials[testimonialType - 1], {
            testimonials,
          })}
        </div>
      </div>

      {/* FAQS section */}
      <div className="flex w-full justify-center px-5">
        <div data-aos="fade-up" id="faqs" className="w-full max-w-screen-xl">
          {React.createElement(faqs[faqType - 1], {
            questionsAndAnswers,
          })}
        </div>
      </div>

      {/* Contact Content */}
      <div className="flex w-full justify-center px-5">
        <div
          data-aos="fade-up"
          id="contacts"
          className="w-full max-w-screen-xl"
        >
          {React.createElement(contacts[contactType - 1], {
            ...Data,
          })}
        </div>
      </div>
    </div>
  );
};
export default Index;
