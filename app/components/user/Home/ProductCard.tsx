import { FaHeart, FaStar } from "react-icons/fa";
import WishlistButton from "../../ui/WishlistButton";

const ProductCard = ({ product }: { product: any }) => {
  const productName = product?.name ?? "Untitled Piece";
  const productImage =
    product?.image ||
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80";
  const skuText = product?.sku || product?._id || "N/A";
  const priceText =
    typeof product?.price === "number"
      ? `Rs. ${product.price}`
      : product?.price || "Price on request";
  const rating = product?.rating ?? 4.5;

  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300">
      <div className="relative">
        <img
          src={productImage}
          alt={productName}
          className="w-full h-80 object-cover group-hover:scale-105 transition duration-500"
        />

        {/* <button className="absolute top-4 right-4 bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:text-red-500">
          <FaHeart />
        </button> */}
        <WishlistButton product={product} />
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900">{productName}</h3>

        <p className="text-sm text-gray-500 mt-1">SKU: {skuText}</p>

        <div className="flex items-center gap-2 mt-3">
          <div className="flex text-yellow-500">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
          </div>

          <span className="text-sm text-gray-600">({rating})</span>
        </div>

        <p className="text-2xl font-bold text-[#D4AF37] mt-4">{priceText}</p>

        <button className="w-full mt-5 py-3 rounded-lg bg-[#111827] text-white hover:bg-[#D4AF37] hover:text-black transition font-medium">
          Add To Cart
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
