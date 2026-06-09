const SectionTitle = ({ eyebrow, title }) => {
  return (
    <div className="text-center mb-8">
      <p className="uppercase tracking-[4px] text-sm font-medium text-[#D4AF37]">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-4xl md:text-5xl font-bold text-gray-900">
        {title}
      </h2>
    </div>
  );
};

export default SectionTitle;
