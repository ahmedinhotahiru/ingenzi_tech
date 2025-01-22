import React, { useState } from "react";
import { ContactForm, ContactProps } from "../../types/types";
import Title from "../common/Title.tsx";
import DefaultLoader from "../loaders/defaultLoader.tsx";

const Contact2: React.FC<ContactProps> = ({ contactDetails, submitted }) => {
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
      <Title title="Contact" description="Get In Touch" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Section */}
          <div className="mb-10 lg:mb-0">
            <div className="group h-full w-full">
              <div className="relative h-full">
                <img
                  src="https://pagedone.io/asset/uploads/1696488602.png"
                  alt="Contact Us"
                  className="h-full w-full rounded-2xl bg-primary-var-700 object-cover bg-blend-multiply lg:rounded-l-2xl"
                />
                <h1 className="font-manrope absolute left-11 top-11 text-4xl font-bold leading-10 text-white">
                  Contact us
                </h1>
                <div className="absolute bottom-0 w-full p-5 lg:p-11">
                  <div className="block rounded-lg bg-white p-6">
                    <div className="mb-6 flex items-center">
                      <svg
                        width="30"
                        height="30"
                        viewBox="0 0 30 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-primary-var-500"
                      >
                        <path
                          d="M22.3092 18.3098C22.0157 18.198 21.8689 18.1421 21.7145 18.1287C21.56 18.1154 21.4058 18.1453 21.0975 18.205L17.8126 18.8416C17.4392 18.9139 17.2525 18.9501 17.0616 18.9206C16.8707 18.891 16.7141 18.8058 16.4008 18.6353C13.8644 17.2551 12.1853 15.6617 11.1192 13.3695C10.9964 13.1055 10.935 12.9735 10.9133 12.8017C10.8917 12.6298 10.9218 12.4684 10.982 12.1456L11.6196 8.72559C11.6759 8.42342 11.7041 8.27233 11.6908 8.12115C11.6775 7.96998 11.6234 7.82612 11.5153 7.5384L10.6314 5.18758C10.37 4.49217 10.2392 4.14447 9.95437 3.94723C9.6695 3.75 9.29804 3.75 8.5551 3.75H5.85778C4.58478 3.75 3.58264 4.8018 3.77336 6.06012C4.24735 9.20085 5.64674 14.8966 9.73544 18.9853C14.0295 23.2794 20.2151 25.1426 23.6187 25.884C24.9335 26.1696 26.0993 25.1448 26.0993 23.7985V21.2824C26.0993 20.5428 26.0993 20.173 25.9034 19.8888C25.7076 19.6046 25.362 19.4729 24.6708 19.2096L22.3092 18.3098Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <h5 className="ml-5 text-base font-normal leading-6 text-black">
                        {contactDetails[1]?.text}
                      </h5>
                    </div>
                    <div className="mb-6 flex items-center">
                      <svg
                        width="30"
                        height="30"
                        viewBox="0 0 30 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-primary-var-500"
                      >
                        <path
                          d="M2.81501 8.75L10.1985 13.6191C12.8358 15.2015 14.1544 15.9927 15.6032 15.9582C17.0519 15.9237 18.3315 15.0707 20.8905 13.3647L27.185 8.75M12.5 25H17.5C22.214 25 24.5711 25 26.0355 23.5355C27.5 22.0711 27.5 19.714 27.5 15C27.5 10.286 27.5 7.92893 26.0355 6.46447C24.5711 5 22.214 5 17.5 5H12.5C7.78595 5 5.42893 5 3.96447 6.46447C2.5 7.92893 2.5 10.286 2.5 15C2.5 19.714 2.5 22.0711 3.96447 23.5355C5.42893 25 7.78595 25 12.5 25Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                      <h5 className="ml-5 text-base font-normal leading-6 text-black">
                        {contactDetails[2]?.text}
                      </h5>
                    </div>
                    <div className="flex items-center">
                      <svg
                        width="30"
                        height="30"
                        viewBox="0 0 30 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-primary-var-500"
                      >
                        <path
                          d="M25 12.9169C25 17.716 21.1939 21.5832 18.2779 24.9828C16.8385 26.6609 16.1188 27.5 15 27.5C13.8812 27.5 13.1615 26.6609 11.7221 24.9828C8.80612 21.5832 5 17.716 5 12.9169C5 10.1542 6.05357 7.5046 7.92893 5.55105C9.8043 3.59749 12.3478 2.5 15 2.5C17.6522 2.5 20.1957 3.59749 22.0711 5.55105C23.9464 7.5046 25 10.1542 25 12.9169Z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M17.5 11.6148C17.5 13.0531 16.3807 14.219 15 14.219C13.6193 14.219 12.5 13.0531 12.5 11.6148C12.5 10.1765 13.6193 9.01058 15 9.01058C16.3807 9.01058 17.5 10.1765 17.5 11.6148Z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                      <h5 className="ml-5 text-base font-normal leading-6 text-black">
                        {contactDetails[0]?.text}
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-gray-50 p-5 lg:rounded-r-2xl lg:p-11"
          >
            <h2 className="font-manrope mb-11 text-4xl font-semibold leading-10 text-primary-var-600">
              Send Us A Message
            </h2>
            <input
              id="name"
              value={inputs.name}
              onChange={handleChange}
              type="text"
              className="mb-10 h-12 w-full rounded-full border border-gray-200 bg-transparent pl-4 text-lg font-normal leading-7 text-gray-600 placeholder-gray-400 shadow-sm focus:outline-none"
              placeholder="Name"
              required
            />
            <input
              id="email"
              value={inputs.email}
              onChange={handleChange}
              type="text"
              className="mb-10 h-12 w-full rounded-full border border-gray-200 bg-transparent pl-4 text-lg font-normal leading-7 text-gray-600 placeholder-gray-400 shadow-sm focus:outline-none"
              placeholder="Email"
              required
            />
            <input
              id="phone"
              value={inputs.phone}
              onChange={handleChange}
              type="text"
              className="mb-10 h-12 w-full rounded-full border border-gray-200 bg-transparent pl-4 text-lg font-normal leading-7 text-gray-600 placeholder-gray-400 shadow-sm focus:outline-none"
              placeholder="Phone"
              required
            />
            <input
              id="subject"
              value={inputs.subject}
              onChange={handleChange}
              type="text"
              className="mb-10 h-12 w-full rounded-full border border-gray-200 bg-transparent pl-4 text-lg font-normal leading-7 text-gray-600 placeholder-gray-400 shadow-sm focus:outline-none"
              placeholder="Subject"
              required
            />

            <textarea
              id="message"
              value={inputs.message}
              onChange={handleChange}
              rows={3}
              className="mb-10 w-full rounded-lg border border-gray-200 bg-transparent p-4 text-lg font-normal leading-7 text-gray-600 placeholder-gray-400 shadow-sm focus:outline-none"
              placeholder="Message"
              required
            />
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
      </div>
    </section>
  );
};

export default Contact2;
