import { JSX } from "react";

// Header section
export interface HeaderProps {
  siteName: string;
  logoUrl: string;
  buttonText: string;
  hasScrolled: boolean;
  isMenuOpen: boolean;
  toggleMenu: () => void;
  scrollToTop: () => void;
  buttonAction: () => void;
  linkClicked: (id: string) => void;
  navLinks: string[];
}

// Hero section
export interface HeroProps {
  imageUrl: string;
  tagline: string;
  subTagline: string;
  headline: string;
  buttonText: string;
  handleClick: () => void;
}

export interface AboutProps {
  siteName: string;
  description: string;
  buttonText: string;
  handleClick: () => void;
}

// Features section
export interface Feature {
  id?: number;
  link?: string | null;
  image?: string;
  title: string;
  content?: string;
  site_id?: number;
  icon_name?: string;
  created_at?: string;
  image_term?: string;
  updated_at?: string;
  description?: string;
  title_label?: string;
  icon?: JSX.Element;
}

export interface FeatureProps {
  title: string;
  description: string;
  features: Feature[];
}

// Testimonials section
interface Testimonial {
  created_at: string;
  icon_name: string;
  id: number;
  image_term: string;
  name: string;
  photo: string;
  quote: string;
  rating: string;
  site_id: number;
  title: string;
  updated_at: string;
}

export interface TestimonialProps {
  testimonials: Testimonial[];
}

// FAQs section
export interface QuestionAnswer {
  answer: string;
  created_at: string;
  icon: string | null;
  icon_name: string;
  id: number;
  image: string;
  image_term: string;
  question: string;
  site_id: number;
  updated_at: string;
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
  contactDetails: contactDetail[];
  submitted: (values: ContactForm) => void;
}

// Footer section
export interface FooterProps extends HeaderProps {
  socialLinks: {
    platform: string;
    url: string;
    icon: React.ReactNode;
  }[];
  description: string;
  contact: {
    email: string;
    location: string;
    phone: string;
  };
}
