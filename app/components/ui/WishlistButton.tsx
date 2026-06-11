"use client";

import { FaHeart, FaRegHeart } from "react-icons/fa";

import { useAppDispatch, useAppSelector } from "@/app/store/hooks";

import {
  addToWishlist,
  removeFromWishlist,
} from "@/app/store/slices/wishlistSlice";

interface Props {
  product: any;
}

export default function WishlistButton({ product }: Props) {
  const dispatch = useAppDispatch();

  const { items } = useAppSelector((state) => state.wishlist);

  const isWishlisted = items.some(
    (item: any) => item?.product?._id === product?._id,
  );

  console.log("isWishlisted", isWishlisted);
  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(
        addToWishlist({
          productId: product._id,
        }),
      );
    }
  };

  return (
    <button
      onClick={handleWishlist}
      className="absolute top-4 right-4 bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:text-red-500"
    >
      {isWishlisted ? (
        <FaHeart size={22} className="text-red-500" />
      ) : (
        <FaRegHeart size={22} />
      )}
    </button>
  );
}
