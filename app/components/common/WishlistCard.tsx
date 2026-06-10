// "use client";

// import WishlistButton from "../ui/WishlistButton";

// interface Props {
//   item: any;
//   onRemove: (id: string) => void;
// }

// export default function WishlistCard({ item, onRemove }: Props) {
//   const product = item.product;

//   return (
//     <div className="border rounded-lg p-4">
//       <WishlistButton product={product} />

//       <img
//         src={product?.variants?.[0]?.images?.[0]}
//         alt={product.name}
//         className="w-full h-56 object-cover"
//       />

//       <h2 className="font-semibold mt-3">{product.name}</h2>

//       <p className="text-sm text-gray-500">{product.category}</p>

//       <button
//         onClick={() => onRemove(product._id)}
//         className="bg-red-500 text-white px-4 py-2 mt-3 rounded"
//       >
//         Remove
//       </button>
//     </div>
//   );
// }

"use client";

import Image from "next/image";

import WishlistButton from "../ui/WishlistButton";

interface Props {
  item: any;
  onRemove: (id: string) => void;
}

export default function WishlistCard({ item, onRemove }: Props) {
  const product = item?.product;

  // Prevent crash if product missing
  if (!product) return null;

  const image = product?.variants?.[0]?.images?.[0];

  const imageUrl =
    image && (image.startsWith("http") || image.startsWith("/uploads"))
      ? image.startsWith("http")
        ? image
        : `${process.env.NEXT_PUBLIC_SERVER_URL}${image}`
      : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80";

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg">
      {/* IMAGE */}
      <div className="relative h-64 w-full">
        <Image
          src={imageUrl}
          alt={product?.name || "Wishlist Product"}
          fill
          className="object-cover"
        />

        {/* Wishlist Icon */}
        <div className="absolute right-3 top-3 z-10">
          <WishlistButton product={product} />
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <h2 className="line-clamp-1 text-lg font-semibold text-slate-900">
          {product?.name}
        </h2>

        <p className="mt-1 text-sm text-slate-500">{product?.category}</p>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-lg font-bold text-slate-900">
            ₹
            {product?.variants?.[0]?.discountPrice ||
              product?.variants?.[0]?.price}
          </div>

          <button
            onClick={() => onRemove(product._id)}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
