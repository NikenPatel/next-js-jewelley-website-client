import { testimonials } from "../../../data";
import SectionTitle from "./SectionTitle";
import TestimonialCard from "./TestimonialCard";

const TestimonialSection = () => {
  return (
    <section className="py-20 px-6 lg:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          eyebrow="Testimonials"
          title="Loved By Modern Collectors"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
