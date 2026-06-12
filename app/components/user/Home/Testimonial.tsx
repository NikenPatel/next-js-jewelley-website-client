import { FaStar } from "react-icons/fa";

const TestimonialCard = ({ testimonial }: { testimonial: any }) => {
  return (
    <div className="bg-gray-50 rounded-2xl p-8 shadow-md hover:shadow-xl transition duration-300">
      <div className="flex gap-1 text-[#D4AF37] mb-5">
        {[...Array(5)].map((_, index) => (
          <FaStar key={index} />
        ))}
      </div>

      <p className="text-gray-600 leading-relaxed italic">
        "{testimonial.text}"
      </p>

      <div className="flex items-center gap-4 mt-6">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="w-14 h-14 rounded-full object-cover border-2 border-[#D4AF37]"
        />

        <div>
          <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>

          <p className="text-sm text-gray-500">Verified Customer</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
