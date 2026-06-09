import React from "react";
import heroImage1 from "@/public/images/hero1.png";
import heroImage2 from "@/public/images/hero2.png";

function Herosection() {
  const images = {
    hero1: heroImage1,
    hero2: heroImage2,

    campaign:
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=1800&q=85",
    customerA:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80",
    customerB:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80",
    customerC:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=240&q=80",
  };
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0 flex">
        <img
          src={images.hero1}
          alt="Jewelry Collection"
          className="w-1/2 h-full object-cover"
        />
        <img
          src={images.hero2}
          alt="Luxury Jewelry"
          className="w-1/2 h-full object-cover"
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <span className="text-dark tracking-[4px] uppercase text-sm md:text-base mb-4 ">
          Premium Jewelry Collection
        </span>

        <h1 className="text-white text-5xl md:text-7xl font-bold max-w-4xl leading-tight">
          Timeless Elegance
          <br />
          Crafted for Every Moment
        </h1>

        {/* <p className="text-gray-800 text-lg md:text-xl max-w-2xl mt-6">
          Discover handcrafted necklaces, earrings, rings, and bracelets
          designed to celebrate beauty, confidence, and sophistication.
        </p> */}

        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <button
            className="px-8 py-4 bg-sorrell text-black font-semibold rounded-full hover:scale-105 transition "
            href="#shop"
          >
            Shop Collection
          </button>

          <button className="px-8 py-4 border border-white text-white rounded-full hover:bg-white hover:text-black transition">
            Explore New Arrivals
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white animate-bounce">
        ↓
      </div>
    </section>
  );
}

export default Herosection;
