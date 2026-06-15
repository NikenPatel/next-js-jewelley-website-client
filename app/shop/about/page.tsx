"use client";

import React from "react";
import ShopNavbar from "@/app/components/user/Home/navbar";
import Footer from "@/app/components/common/Footer";
import { Award, Gem, ShieldCheck, HeartHandshake } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 font-sans selection:bg-[#cda567] selection:text-black">
      <ShopNavbar />

      {/* Hero Section */}
      <section className="relative py-32 px-6 flex items-center justify-center overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1611085583191-a3b181a88401?q=80&w=2000&auto=format&fit=crop"
            alt="Jewellery Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <h2 className="text-[#cda567] text-sm md:text-base font-semibold tracking-[0.3em] uppercase mb-4">
            Our Heritage
          </h2>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6">
            A Legacy of <br />{" "}
            <span className="text-[#cda567] italic">Elegance</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            For generations, Auric has been synonymous with unparalleled
            craftsmanship and breathtaking design. We create not just jewellery,
            but heirlooms that carry your story forward.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -inset-4 border border-[#cda567]/30 rounded-2xl transform rotate-2"></div>
            <img
              src="https://images.unsplash.com/photo-1599643478514-4a42041235b6?q=80&w=1000&auto=format&fit=crop"
              alt="Crafting Jewellery"
              className="relative z-10 rounded-xl shadow-2xl w-full h-[600px] object-cover grayscale-[20%] hover:grayscale-0 transition duration-700"
            />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
              The Auric Story
            </h2>
            <p className="text-gray-400 mb-6 leading-relaxed text-lg">
              Born from a passion for precious metals and extraordinary gems,
              Auric began as a small family atelier in the heart of the city.
              Today, we stand as a beacon of luxury and refined taste.
            </p>
            <p className="text-gray-400 mb-8 leading-relaxed text-lg">
              Every piece in our collection is a testament to the dedication of
              our master artisans, who spend countless hours shaping, setting,
              and polishing to perfection. We source only the most ethically
              mined diamonds and purest golds, ensuring that our creations are
              as responsible as they are beautiful.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-800">
              <div>
                <div className="text-4xl font-serif text-[#cda567] mb-2">
                  1995
                </div>
                <div className="text-sm text-gray-500 uppercase tracking-widest font-semibold">
                  Year Established
                </div>
              </div>
              <div>
                <div className="text-4xl font-serif text-[#cda567] mb-2">
                  10k+
                </div>
                <div className="text-sm text-gray-500 uppercase tracking-widest font-semibold">
                  Happy Clients
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 px-6 bg-[#111] border-y border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
              Our Values
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              The principles that guide our hammers and polish our diamonds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Gem,
                title: "Exquisite Quality",
                desc: "We select only the top 1% of diamonds globally, ensuring unmatched brilliance in every piece.",
              },
              {
                icon: Award,
                title: "Master Craftsmanship",
                desc: "Decades of artisanal experience go into the intricate detailing of our jewellery.",
              },
              {
                icon: ShieldCheck,
                title: "Ethical Sourcing",
                desc: "100% conflict-free gems and recycled metals for a beautiful, sustainable future.",
              },
              {
                icon: HeartHandshake,
                title: "Client Devotion",
                desc: "We treat every customer like royalty, offering bespoke services and lifetime care.",
              },
            ].map((value, idx) => (
              <div
                key={idx}
                className="bg-[#1a1a1a] p-8 rounded-2xl border border-gray-800 hover:border-[#cda567]/50 transition-colors group"
              >
                <div className="w-14 h-14 bg-[#cda567]/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <value.icon className="text-[#cda567]" size={28} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
