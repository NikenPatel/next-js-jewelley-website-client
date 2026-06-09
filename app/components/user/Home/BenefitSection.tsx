import { benefits } from "../../../data";
import BenefitCard from "./Benefit";
import SectionTitle from "./SectionTitle";

const BenefitSection = () => {
  return (
    <section id="benefits" className="py-20 px-6 lg:px-12 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          eyebrow="Why Choose Us"
          title="Luxury Service, Considered Details"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {benefits.map((benefit, index) => (
            <BenefitCard
              key={index}
              icon={benefit.icon}
              title={benefit.title}
              text={benefit.text}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitSection;
