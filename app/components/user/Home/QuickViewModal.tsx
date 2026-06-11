const QuickViewModal = ({ product, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl overflow-hidden max-w-4xl w-full grid md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={product.variants[0].images[0]}
          alt={product.name}
          className="w-full h-full object-cover"
        />

        <div className="p-8 flex flex-col justify-center">
          <p className="uppercase tracking-widest text-sm text-[#D4AF37]">
            Quick View
          </p>

          <h2 className="text-3xl font-bold mt-2">{product.name}</h2>

          <p className="text-2xl font-semibold text-[#D4AF37] mt-4">
            {product.price}
          </p>

          <p className="text-gray-600 mt-5">
            A refined handcrafted jewellery piece designed for timeless elegance
            and everyday luxury.
          </p>

          <button className="mt-8 py-3 bg-[#111827] text-white rounded-lg hover:bg-[#D4AF37] hover:text-black transition">
            Add To Cart
          </button>

          <button
            onClick={onClose}
            className="mt-4 text-gray-500 hover:text-black"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
