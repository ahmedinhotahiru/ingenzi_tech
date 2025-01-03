import { JSX } from "react";

// Testimonials section
export interface Testimonial {
  text: string;
  name: string;
  role: string;
  image: string;
}

export interface TestimonialProps {
  testimonials: Testimonial[];
}

// Hero section
export interface HeroProps {
  props: {
    imageUrl: string;
    title: string;
    subTitle: string;
    text: string;
    buttonText: string;
    handleClick: () => void;
  };
}

// FAQs section
export interface QuestionAnswer {
  id: number | string;
  question: string;
  answer: string;
}

export interface FAQProps {
  questionsAndAnswers: QuestionAnswer[];
}

// contact component
export interface contactDetail {
  id: number;
  bgColor: string;
  textColor: string;
  icon: JSX.Element;
  text: string;
}
export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface ContactProps {
  props: {
    contactDetails: contactDetail[];
    submitted: (values: ContactForm) => void;
  };
}
