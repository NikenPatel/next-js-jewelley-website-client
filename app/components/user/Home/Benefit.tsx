import { FaTruck, FaShieldAlt, FaGem, FaUndoAlt } from "react-icons/fa";

const BenefitCard = ({ icon, title, text }: { icon: string; title: string; text: string }) => {
  const icons = {
    shipping: <FaTruck size={34} />,
    shield: <FaShieldAlt size={34} />,
    diamond: <FaGem size={34} />,
    return: <FaUndoAlt size={34} />,
  };

  return (
    <article className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition duration-300 text-center group">
      <div className="w-16 h-16 mx-auto rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition">
        {(icons as any)[icon]}
      </div>

      <h3 className="mt-6 text-xl font-semibold text-gray-900">{title}</h3>

      <p className="mt-3 text-gray-600 leading-relaxed">{text}</p>
    </article>
  );
};

export default BenefitCard;
