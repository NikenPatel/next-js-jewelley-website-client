"use client";

import React, { useState } from "react";
import ShopNavbar from "@/app/components/user/Home/navbar";
import Footer from "@/app/components/ui/Footer";
import { MapPin, Phone, Mail, Clock, Send, Loader2 } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.success("Message sent successfully! We will get back to you soon.", {
      style: { background: "#333", color: "#fff" }
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 font-sans selection:bg-[#cda567] selection:text-black">
      <Toaster position="top-center" />
      <ShopNavbar />

      {/* Hero Section */}
      <section className="relative py-24 px-6 flex items-center justify-center overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1573408301145-b98c46544ea0?q=80&w=2000&auto=format&fit=crop"
            alt="Contact Us Background"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
        </div>
        
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <h2 className="text-[#cda567] text-sm md:text-base font-semibold tracking-[0.3em] uppercase mb-4">
            Get in Touch
          </h2>
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-6">
            Contact <span className="text-[#cda567] italic">Auric</span>
          </h1>
          <p className="text-lg text-gray-400">
            Whether you are looking for a bespoke creation or need assistance with an existing order, our dedicated team is here to assist you with the utmost care.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Contact Information */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <h2 className="text-3xl font-serif text-white mb-8 border-b border-gray-800 pb-4">Our Boutiques</h2>
              <div className="space-y-8">
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#1a1a1a] rounded-full flex items-center justify-center shrink-0 border border-gray-800 text-[#cda567]">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-medium mb-2">Flagship Store</h3>
                    <p className="text-gray-400 leading-relaxed">
                      123 Heritage Avenue, Suite 45<br/>
                      Luxury District, Mumbai 400001<br/>
                      India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#1a1a1a] rounded-full flex items-center justify-center shrink-0 border border-gray-800 text-[#cda567]">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-medium mb-2">Phone Inquiries</h3>
                    <p className="text-gray-400 leading-relaxed">
                      +91 98765 43210<br/>
                      <span className="text-sm text-gray-500">Mon-Sat, 10:00 AM - 8:00 PM</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#1a1a1a] rounded-full flex items-center justify-center shrink-0 border border-gray-800 text-[#cda567]">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-medium mb-2">Email Us</h3>
                    <p className="text-gray-400 leading-relaxed">
                      concierge@auricjewels.com<br/>
                      support@auricjewels.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#1a1a1a] rounded-full flex items-center justify-center shrink-0 border border-gray-800 text-[#cda567]">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-medium mb-2">Boutique Hours</h3>
                    <p className="text-gray-400 leading-relaxed">
                      Monday - Saturday: 10:30 AM - 8:00 PM<br/>
                      Sunday: By Private Appointment Only
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#141414] p-8 md:p-12 rounded-2xl border border-gray-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#cda567]/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#cda567]/5 rounded-full blur-3xl" />
              
              <h2 className="text-2xl font-serif text-white mb-2 relative z-10">Send us a Message</h2>
              <p className="text-gray-400 mb-8 relative z-10">Our concierge will reply to your inquiry within 24 hours.</p>

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-[#1a1a1a] border border-gray-800 focus:border-[#cda567] rounded-lg px-4 py-3 text-white outline-none transition"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-[#1a1a1a] border border-gray-800 focus:border-[#cda567] rounded-lg px-4 py-3 text-white outline-none transition"
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full bg-[#1a1a1a] border border-gray-800 focus:border-[#cda567] rounded-lg px-4 py-3 text-white outline-none transition"
                    placeholder="Bespoke Design Inquiry"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-[#1a1a1a] border border-gray-800 focus:border-[#cda567] rounded-lg px-4 py-3 text-white outline-none transition resize-none"
                    placeholder="How can we assist you today?"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#cda567] text-black font-semibold py-4 rounded-lg hover:bg-[#b58f53] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
                >
                  {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
