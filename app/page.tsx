"use client";
import Image from "next/image";
import Navbar from "./components/common/Header";
import ProductList from "./admin/dashboard/products/allproduct/page";
import Footer from "./components/ui/Footer";
import TestimonialSection from "./components/user/Home/TestimonialSection";
import BenefitSection from "./components/user/Home/BenefitSection";
import ArrivalSection from "./components/user/Home/ArrivalSection";
import BestSellerSection from "./components/user/Home/BestSellerSection";
import Herosection from "./components/user/Home/HeroSection";
import CategoriesSection from "./components/user/Home/CategoriesSection";
import { useState } from "react";
import ShopNavbar from "./components/user/Home/navbar";

export default function Home() {
  const [quickView, setQuickView] = useState(null);

  return (
    <>
      <ShopNavbar />

      <Herosection />

      <CategoriesSection />

      {/* <ProductList /> */}

      <BestSellerSection />

      <ArrivalSection quickView={quickView} setQuickView={setQuickView} />

      <BenefitSection />

      <TestimonialSection />

      <Footer />
    </>
  );
}
