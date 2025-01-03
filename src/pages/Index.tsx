import React from "react";
import Contact1 from "../components/contact/Contact1.tsx";
import { useSiteSettings } from "../context/index.tsx";
import { ContactForm } from "../types/types";
import Hero1 from "../components/hero/Hero1.tsx";
import Faq1 from "../components/faqs/Faq1.tsx";
import Testimonial1 from "../components/testimonials/Testimonial1.tsx";
import Feature1 from "../components/features/Feature1.tsx";
import About1 from "../components/about/About.tsx";
const Index: React.FC = () => {
  const { siteSettings } = useSiteSettings();

  const handleSubmit = (value: ContactForm) => {
    console.log("values: ", value);
  };
  const handleClick = () => {
    //
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
      text: "Douala - Cameroon",
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
      text: "+237 683 41 13 82",
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
      text: "email@gmail.com",
    },
  ];

  const questionsAndAnswers = [
    {
      id: 1,
      question: "How do I update my billing information?",
      answer:
        "To update your billing information, visit the 'Billing' section in your account settings and make the necessary changes.",
    },
    {
      id: 2,
      question: "How can I contact customer support?",
      answer:
        "To contact customer support, look for a 'Contact us' or 'Help' button or link on the website or platform.",
    },
    {
      id: 3,
      question: "How do I update my profile information?",
      answer:
        "Navigate to your profile settings to update your profile information such as name, email, and more.",
    },
    {
      id: 4,
      question: "How do I find my purchase history?",
      answer:
        "You can find your purchase history in the 'Orders' or 'Purchase History' section in your account.",
    },
  ];

  const testimonialsData = [
    {
      text: "Pagedone has made it possible for me to stay on top of my portfolio and make informed decisions quickly and easily.",
      name: "Jane D",
      role: "CEO",
      image: "https://pagedone.io/asset/uploads/1696229969.png",
    },
    {
      text: "Thanks to pagedone, I feel more informed and confident about my investment decisions than ever before.",
      name: "Harsh P.",
      role: "Product Designer",
      image: "https://pagedone.io/asset/uploads/1696229994.png",
    },
    {
      text: "Pagedone has truly been a game-changer for my business decisions and strategic planning.",
      name: "Alex K.",
      role: "Entrepreneur",
      image: "https://pagedone.io/asset/uploads/1696229994.png",
    },
    {
      text: "Pagedone has streamlined my work processes and boosted my productivity significantly.",
      name: "Jordan R.",
      role: "Developer",
      image: "https://pagedone.io/asset/uploads/1696229969.png",
    },
    {
      text: "The insights I get from pagedone are invaluable, and it helps me stay ahead in the market.",
      name: "Emily T.",
      role: "Marketing Lead",
      image: "https://pagedone.io/asset/uploads/1696229994.png",
    },
    {
      text: "Pagedone has been a key factor in my decision-making process, and I trust it completely.",
      name: "Michael W.",
      role: "Business Analyst",
      image: "https://pagedone.io/asset/uploads/1696229994.png",
    },
  ];

  const Data = {
    imageUrl:
      "https://images.unsplash.com/photo-1667984390527-850f63192709?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MDE2NzZ8MHwxfHNlYXJjaHwxfHxjbG91ZCUyMGNvbXB1dGluZ3xlbnwwfHx8fDE3MjU5NjMyODd8MA&ixlib=rb-4.0.3&q=80&w=1080",
    title: "The new standard for",
    subTitle: "Modern investor",
    text: "When you're ready to invest, quickly execute your orders with Complex and outdated.",
    buttonText: "Get Started",
    contactDetails,
    submitted: handleSubmit,
    handleClick,
    questionsAndAnswers,
  };

  const contactType = 1;
  const heroType = 1;
  const faqType = 1;
  const testimonialType = 1;
  const featureType = 1;
  const aboutType = 1;

  const contacts = [<Contact1 props={Data} />];
  const heroSections = [<Hero1 props={Data} />];
  const faqs = [<Faq1 questionsAndAnswers={questionsAndAnswers} />];
  const testimonials = [<Testimonial1 testimonials={testimonialsData} />];
  const features = [<Feature1 />];
  const aboutSections = [<About1 />];

  return (
    <div className="w-full">
      {/* Hero section */}
      {heroSections[heroType - 1]}

      {/* About section */}
      {aboutSections[aboutType - 1]}

      {/* Features section */}
      {features[featureType - 1]}

      {/* Testimonials section */}
      {testimonials[testimonialType - 1]}

      {/* FAQS section */}
      {faqs[faqType - 1]}

      {/* Contact Content */}
      {contacts[contactType - 1]}
    </div>
  );
};
export default Index;
