import React from "react";
import Link from "next/link";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

const getProduct = async (id: string) => {
  try {
    const baseURL =
      process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";
    const url = `${baseURL}/api/products/get-product/${id}`;

    console.log("Fetching product from:", url);

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`API error: ${res.status} ${res.statusText}`);
      return null;
    }

    const data = await res.json();
    console.log("Product fetched:", data);
    return data;
  } catch (err) {
    console.error("Failed to fetch product:", err);
    return null;
  }
};

export default async function ProductPage({ params }: Params) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-xl rounded-xl border bg-white p-8 text-center shadow">
          <h2 className="text-2xl font-semibold mb-2">Product not found</h2>
          <p className="text-sm text-gray-600 mb-4">
            We couldn't find this product. Please check the URL or go back to
            the shop.
          </p>
          <Link
            href="/shop/products"
            className="text-sm font-medium text-[#D4AF37] hover:underline"
          >
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  const firstVariant = Array.isArray(product.variants)
    ? product.variants[0]
    : null;

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="mx-auto max-w-6xl bg-white rounded-2xl p-8 shadow">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Product Image */}
          <div className="rounded-lg bg-[#f8f5f2] p-4">
            {product.thumbnail ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.thumbnail}
                alt={product.name}
                className="w-full rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-80 items-center justify-center text-gray-400">
                No image available
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-[#2d2d2d]">
              {product.name}
            </h1>
            <p className="mt-2 text-sm text-gray-600">{product.collection}</p>
            <p className="mt-1 text-xs text-gray-500">SKU: {product.sku}</p>

            <div className="mt-6 space-y-4">
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>

              {/* Price Section */}
              <div className="rounded-2xl bg-[#f8f5f2] p-4">
                <p className="text-lg font-semibold text-[#99775c]">
                  ₹
                  {firstVariant?.discountPrice ||
                    firstVariant?.price ||
                    product.price ||
                    "Price on request"}
                </p>
                {firstVariant?.discountPrice &&
                  firstVariant?.discountPrice < firstVariant?.price && (
                    <p className="text-sm text-gray-400 line-through">
                      ₹{firstVariant?.price}
                    </p>
                  )}
              </div>

              {/* Variant Details */}
              {firstVariant && (
                <div className="space-y-2 rounded-lg bg-[#efe7e1] p-4">
                  <p className="text-sm text-gray-600">
                    <strong>Metal:</strong> {firstVariant.metal || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Gemstone:</strong> {firstVariant.gemstone || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Carat Weight:</strong>{" "}
                    {firstVariant.caratWeight || "N/A"}
                  </p>
                  {firstVariant.clarity && (
                    <p className="text-sm text-gray-600">
                      <strong>Clarity:</strong> {firstVariant.clarity}
                    </p>
                  )}
                  {firstVariant.color && (
                    <p className="text-sm text-gray-600">
                      <strong>Color:</strong> {firstVariant.color}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <Link
                href="/shop/products"
                className="rounded-lg border border-[#99775c] px-4 py-2 text-sm font-medium text-[#99775c] transition hover:bg-[#f3ece7]"
              >
                Back to shop
              </Link>

              <button className="rounded-lg bg-[#99775c] px-6 py-2 text-sm font-medium text-white transition hover:bg-[#7e6049]">
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
