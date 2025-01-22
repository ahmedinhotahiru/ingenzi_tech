import React, { useState } from "react";
import { ContactForm, ContactProps } from "../../types/types";
import Title from "../common/Title.tsx";
import DefaultLoader from "../loaders/defaultLoader.tsx";

const Contact1: React.FC<ContactProps> = ({ contactDetails, submitted }) => {

  const [inputs, setInputs] = useState<ContactForm>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await submitted(inputs);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full bg-background">
      <div data-aos="flip-left" className="mx-auto max-w-screen-lg">
        <Title title="Contact" description="Get In Touch" />
        <p className="text-center font-light text-gray-500">
          Feel free to contact us, submit your queries here and we will get back
          to you as soon as possible
        </p>

        <div className="items-center justify-center gap-4 py-8 max-md:space-y-5 md:flex md:py-12">
          {contactDetails.map((item) => (
            <div
              key={item.id}
              className={`flex h-32 w-full flex-col items-center justify-center rounded-lg md:h-40 ${item.bgColor} ${item.textColor} shadow`}
            >
              {item.icon}
              <span>{item.text}</span>
            </div>
          ))}
        </div>

        <form
          className="space-y-6 rounded-2xl border px-10 py-8 md:space-y-8 md:py-10"
          onSubmit={handleSubmit}
        >
          <h2 className="font-primary-var mb-6 text-center text-xl font-semibold tracking-tight text-gray-900 md:text-2xl">
            Send Us a Message
          </h2>
          <div className="w-full items-center justify-between gap-4 max-md:space-y-6 md:flex">
            <input
              type="text"
              id="name"
              className="block w-full rounded-full border p-2.5 text-sm shadow-sm outline-none focus:border-primary-var-500"
              placeholder="Name"
              value={inputs.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              id="email"
              className="block w-full rounded-full border p-2.5 text-sm shadow-sm outline-none focus:border-primary-var-500"
              placeholder="Email"
              value={inputs.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="w-full items-center justify-between gap-4 max-md:space-y-6 md:flex">
            <input
              type="phone"
              id="phone"
              className="block w-full rounded-full border p-2.5 text-sm shadow-sm outline-none focus:border-primary-var-500"
              placeholder="Phone"
              value={inputs.phone}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              id="subject"
              className="block w-full rounded-full border p-2.5 text-sm shadow-sm outline-none focus:border-primary-var-500"
              placeholder="Subject"
              value={inputs.subject}
              onChange={handleChange}
              required
            />
          </div>

          <textarea
            id="message"
            rows={6}
            className="block w-full rounded-2xl border p-2.5 text-sm shadow-sm outline-none focus:border-primary-var-500"
            placeholder="Write message..."
            value={inputs.message}
            onChange={handleChange}
          ></textarea>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-1 rounded-full bg-primary-var-500 px-5 py-3 text-center text-sm font-medium text-white hover:bg-primary-var-800 focus:outline-none focus:ring-4 focus:ring-primary-var-300 disabled:cursor-not-allowed disabled:bg-gray-400"
            disabled={isLoading}
          >
            {isLoading && <DefaultLoader height="1.25rem" />}
            {isLoading ? "please wait..." : "Send"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact1;
