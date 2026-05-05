import React from 'react';
import Image from 'next/image';

const NewsletterSection = () => {
  return (
    // White background + spacing
    <section className="w-full bg-white ">

      {/* Inner Green Box */}
      <div className=" rounded-md overflow-hidden">

        <div className="relative flex w-full h-auto flex-col bg-[#244d3a] lg:h-[562px] lg:flex-row">
          <div className="pointer-events-none absolute inset-0 opacity-10">
            <Image
              src="/Patterns-03.webp"
              alt=""
              fill
              className="object-cover object-center"
            />
          </div>

          {/* Left Side Image */}
          <div className="relative z-10 h-[300px] w-full lg:h-full lg:w-1/2">
            <video
              src="/home/newsletterBg.webm"
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />

          
          </div>

          {/* Right Side */}
          <div className="relative z-10 flex w-full flex-col justify-center px-8 py-12 lg:w-1/2 lg:px-20">

            <h2 className="text-white text-3xl lg:text-[50px] font-semibold leading-[1.1] mb-6">
              Subscribe to Our <br /> Newsletter
            </h2>

            <p className="text-white/80 text-sm mb-8 max-w-[500px]">
              It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
            </p>

            <form className="flex flex-col sm:flex-row gap-4 max-w-[500px]">
              <input
                type="email"
                placeholder="Enter Your Email"
                className="flex-1 bg-white px-5 py-3 rounded text-sm outline-none text-gray-900 placeholder:text-gray-500"
              />
              <button className="bg-[#8dae84] text-white px-8 py-3 rounded text-sm hover:bg-[#7a9972] transition-colors">
                Subscribe
              </button>
            </form>

          </div>

        </div>

      </div>
    </section>
  );
};

export default NewsletterSection;
