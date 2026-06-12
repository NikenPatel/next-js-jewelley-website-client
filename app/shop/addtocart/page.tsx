"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";
import { 
  CheckCircle2, 
  ChevronRight, 
  CreditCard, 
  Lock, 
  MapPin, 
  ShoppingBag, 
  Tag, 
  Trash2, 
  ShieldCheck,
  Truck,
  Loader2
} from "lucide-react";

import {
  getCart,
  removeFromCart,
  updateCartItem,
  clearCart,
} from "@/app/store/slices/cartSlice";
import { placeOrder } from "@/app/store/slices/orderSlice";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import api from "@/app/store/lib/axios";

const loadScript = (src: string) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CartPage() {
  const dispatch = useAppDispatch();

  const { items, loading } = useAppSelector((state) => state.cart);

  // Steps: 1=Cart, 2=Billing, 3=Payment, 4=Confirmation
  const [step, setStep] = useState(1);

  const [address, setAddress] = useState({
    fullName: "",
    mobile: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState("ONLINE");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<{ razorpay_payment_id?: string; order_id?: string } | null>(null);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  // Calculations
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);

  const discountedSubtotal = Math.max(0, subtotal - discount);
  const gstAmount = discountedSubtotal * 0.03;
  const finalTotal = discountedSubtotal + gstAmount;

  // Handlers
  const handleIncrease = (itemId: string, quantity: number) => {
    dispatch(updateCartItem({ itemId, quantity: quantity + 1 }));
  };

  const handleDecrease = (itemId: string, quantity: number) => {
    if (quantity <= 1) return;
    dispatch(updateCartItem({ itemId, quantity: quantity - 1 }));
  };

  const handleRemove = (itemId: string) => {
    dispatch(removeFromCart(itemId));
    toast.success("Item removed from cart");
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    const loadingToast = toast.loading("Validating coupon...");
    try {
      const res = await api.post("/api/coupons/validate", { code: couponCode });
      if (res.data.success) {
        setAppliedCoupon(couponCode.toUpperCase());
        setDiscount(res.data.coupon.discountAmount);
        toast.success(res.data.message || "Coupon applied successfully!", { id: loadingToast });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid coupon code", { id: loadingToast });
      setAppliedCoupon("");
      setDiscount(0);
    }
  };

  const removeCoupon = () => {
    setCouponCode("");
    setAppliedCoupon("");
    setDiscount(0);
    toast.success("Coupon removed");
  };

  const validateBilling = () => {
    const newErrors: Record<string, string> = {};
    if (!address.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!address.mobile.trim() || address.mobile.length < 10) newErrors.mobile = "Valid 10-digit mobile number required";
    if (!address.addressLine1.trim()) newErrors.addressLine1 = "Address Line 1 is required";
    if (!address.city.trim()) newErrors.city = "City is required";
    if (!address.state.trim()) newErrors.state = "State is required";
    if (!address.country.trim()) newErrors.country = "Country is required";
    if (!address.pincode.trim() || address.pincode.length < 6) newErrors.pincode = "Valid pincode is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill in all required fields correctly");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (step === 2 && !validateBilling()) return;
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prevStep = () => setStep((s) => s - 1);

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    const loadingToast = toast.loading("Processing your order...");

    dispatch(
      placeOrder({
        address,
        paymentMethod,
        couponCode: appliedCoupon,
      })
    )
      .unwrap()
      .then(async (response: any) => {
        if (paymentMethod === "ONLINE" && response.razorpayOrder) {
          const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

          if (!res) {
            toast.error("Razorpay SDK failed to load. Are you online?", { id: loadingToast });
            setIsProcessing(false);
            return;
          }

          toast.dismiss(loadingToast);

          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_T0KPrOkQb8NiSP",
            amount: response.razorpayOrder.amount,
            currency: response.razorpayOrder.currency,
            name: "Jewellery Shop",
            description: "Premium Jewellery Order",
            order_id: response.razorpayOrder.id,
            handler: async function (paymentRes: any) {
              const verifyToast = toast.loading("Verifying payment...");
              try {
                const verifyRes = await api.post("/api/payment/verify-payment", {
                  razorpay_order_id: paymentRes.razorpay_order_id,
                  razorpay_payment_id: paymentRes.razorpay_payment_id,
                  razorpay_signature: paymentRes.razorpay_signature,
                  clearCart: true,
                });

                if (verifyRes.data.success) {
                  toast.success("Payment successful!", { id: verifyToast });
                  setPaymentDetails({
                    razorpay_payment_id: paymentRes.razorpay_payment_id,
                    order_id: response.orders?.[0]?._id || response.order?._id,
                  });
                  setStep(4);
                  dispatch(getCart());
                } else {
                  toast.error("Payment verification failed", { id: verifyToast });
                  setIsProcessing(false);
                }
              } catch (err: any) {
                toast.error(err.response?.data?.message || "Verification failed", { id: verifyToast });
                setIsProcessing(false);
              }
            },
            modal: {
              ondismiss: function () {
                setIsProcessing(false);
                toast.error("Payment cancelled");
              },
            },
            prefill: {
              name: address.fullName,
              contact: address.mobile,
            },
            theme: {
              color: "#cda567",
            },
          };

          const paymentObject = new (window as any).Razorpay(options);
          paymentObject.open();
        } else {
          toast.success("Order placed successfully!", { id: loadingToast });
          setPaymentDetails({
            order_id: response.orders?.[0]?._id || response.order?._id,
          });
          setStep(4);
          dispatch(getCart());
        }
      })
      .catch((err) => {
        toast.error(err, { id: loadingToast });
        setIsProcessing(false);
      });
  };

  const renderStepIndicator = () => (
    <div className="mb-10 px-4">
      <div className="flex items-center justify-between relative max-w-3xl mx-auto">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-800 -z-10 rounded-full" />
        {[
          { icon: ShoppingBag, label: "Cart" },
          { icon: MapPin, label: "Billing" },
          { icon: CreditCard, label: "Payment" },
          { icon: CheckCircle2, label: "Confirm" },
        ].map((s, i) => {
          const isActive = step >= i + 1;
          const isCurrent = step === i + 1;
          return (
            <div key={i} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive ? "bg-[#cda567] text-black" : "bg-gray-800 text-gray-500"
                } ${isCurrent ? "ring-4 ring-[#cda567]/30" : ""}`}
              >
                <s.icon size={18} />
              </div>
              <span
                className={`text-xs mt-2 font-medium ${
                  isActive ? "text-[#cda567]" : "text-gray-500"
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <Toaster position="top-center" toastOptions={{ style: { background: "#333", color: "#fff" } }} />

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-white tracking-wide">
          SECURE CHECKOUT
        </h1>

        {renderStepIndicator()}

        {step === 4 ? (
          /* STEP 4: CONFIRMATION */
          <div className="max-w-2xl mx-auto bg-[#141414] border border-[#cda567]/20 rounded-2xl p-8 text-center shadow-2xl">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={48} className="text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Payment Successful!</h2>
            <p className="text-gray-400 mb-8">Thank you for your purchase. Your premium jewellery is on its way.</p>

            <div className="bg-[#1a1a1a] rounded-xl p-6 text-left border border-gray-800 mb-8">
              <h3 className="text-lg font-medium text-white mb-4 border-b border-gray-800 pb-2">Order Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Order ID</span>
                  <span className="text-white font-mono">{paymentDetails?.order_id || "ORD-XXXX"}</span>
                </div>
                {paymentMethod === "ONLINE" && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment ID</span>
                    <span className="text-white font-mono">{paymentDetails?.razorpay_payment_id || "PAY-XXXX"}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount Paid</span>
                  <span className="text-[#cda567] font-semibold">₹{finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            <Link
              href="/shop"
              className="inline-block bg-[#cda567] text-black font-semibold py-3 px-8 rounded-full hover:bg-[#b58f53] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: MAIN CONTENT */}
            <div className="lg:col-span-8 bg-[#141414] rounded-2xl border border-gray-800 p-6 shadow-xl relative overflow-hidden">
              {/* STEP 1: CART */}
              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-2xl font-semibold text-white mb-6">Your Items</h2>
                  {items.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingBag size={48} className="mx-auto text-gray-700 mb-4" />
                      <p className="text-gray-400 mb-6">Your cart is feeling a bit empty.</p>
                      <Link href="/shop" className="text-[#cda567] hover:underline">
                        Discover our collections
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {items.map((item: any) => {
                        const itemVariant = item.productId?.variants?.find((v: any) => v.variantId === item.variantId);
                        const itemImage = itemVariant?.images?.[0] || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80";

                        return (
                          <div key={item._id} className="flex gap-4 p-4 rounded-xl border border-gray-800 bg-[#1a1a1a] hover:border-gray-700 transition">
                            <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-gray-900 border border-gray-800">
                              <img src={itemImage} alt={item.productId?.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-lg font-medium text-white line-clamp-1">{item.productId?.name}</h3>
                                  <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">SKU: {item.productId?.sku}</p>
                                </div>
                                <button onClick={() => handleRemove(item._id)} className="text-gray-500 hover:text-red-400 transition">
                                  <Trash2 size={18} />
                                </button>
                              </div>
                              <div className="flex justify-between items-end mt-4">
                                <div className="flex items-center gap-3 bg-[#111] rounded-full px-3 py-1 border border-gray-800">
                                  <button onClick={() => handleDecrease(item._id, item.quantity)} className="text-gray-400 hover:text-white px-2">-</button>
                                  <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                  <button onClick={() => handleIncrease(item._id, item.quantity)} className="text-gray-400 hover:text-white px-2">+</button>
                                </div>
                                <div className="text-right">
                                  <div className="text-[#cda567] font-semibold text-lg">₹{(item.price * item.quantity).toLocaleString()}</div>
                                  <div className="text-xs text-gray-500">₹{item.price} each</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div className="flex justify-end pt-4 border-t border-gray-800">
                        <button
                          onClick={nextStep}
                          className="bg-[#cda567] text-black font-semibold py-3 px-8 rounded-full hover:bg-[#b58f53] transition-colors flex items-center gap-2"
                        >
                          Proceed to Billing <ChevronRight size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: BILLING */}
              {step === 2 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-2xl font-semibold text-white mb-6">Shipping Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {[
                      { label: "Full Name", key: "fullName", placeholder: "John Doe" },
                      { label: "Mobile Number", key: "mobile", placeholder: "10-digit mobile number" },
                      { label: "Address Line 1", key: "addressLine1", placeholder: "House/Flat No., Street" },
                      { label: "Address Line 2", key: "addressLine2", placeholder: "Landmark, Area (Optional)", optional: true },
                      { label: "City", key: "city", placeholder: "City" },
                      { label: "State", key: "state", placeholder: "State" },
                      { label: "Country", key: "country", placeholder: "Country" },
                      { label: "Pincode", key: "pincode", placeholder: "6-digit Pincode" },
                    ].map((field) => (
                      <div key={field.key} className={field.key.startsWith("addressLine") ? "md:col-span-2" : ""}>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          {field.label} {!field.optional && <span className="text-red-500">*</span>}
                        </label>
                        <input
                          type="text"
                          placeholder={field.placeholder}
                          value={(address as any)[field.key]}
                          onChange={(e) => setAddress({ ...address, [field.key]: e.target.value })}
                          className={`w-full bg-[#1a1a1a] border ${errors[field.key] ? "border-red-500/50 focus:border-red-500" : "border-gray-800 focus:border-[#cda567]"} rounded-lg px-4 py-3 text-white outline-none transition`}
                        />
                        {errors[field.key] && <p className="text-red-400 text-xs mt-1">{errors[field.key]}</p>}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-800">
                    <button onClick={prevStep} className="text-gray-400 hover:text-white font-medium">
                      ← Back to Cart
                    </button>
                    <button
                      onClick={nextStep}
                      className="bg-[#cda567] text-black font-semibold py-3 px-8 rounded-full hover:bg-[#b58f53] transition-colors flex items-center gap-2"
                    >
                      Continue to Payment <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: PAYMENT */}
              {step === 3 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-2xl font-semibold text-white mb-6">Payment Method</h2>
                  
                  <div className="space-y-4 mb-8">
                    <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition ${paymentMethod === "ONLINE" ? "border-[#cda567] bg-[#cda567]/5" : "border-gray-800 bg-[#1a1a1a] hover:border-gray-700"}`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        value="ONLINE" 
                        checked={paymentMethod === "ONLINE"} 
                        onChange={() => setPaymentMethod("ONLINE")} 
                        className="w-5 h-5 accent-[#cda567]" 
                      />
                      <div className="flex-1">
                        <div className="text-white font-medium flex items-center gap-2">
                          <CreditCard size={18} className="text-[#cda567]" /> Online Payment
                        </div>
                        <p className="text-xs text-gray-500 mt-1">UPI, Cards, Net Banking, Wallets</p>
                      </div>
                      <div className="flex gap-1 opacity-60">
                        <div className="w-8 h-5 bg-gray-800 rounded flex items-center justify-center text-[8px] font-bold">UPI</div>
                        <div className="w-8 h-5 bg-gray-800 rounded flex items-center justify-center text-[8px] font-bold">VISA</div>
                      </div>
                    </label>

                    <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition ${paymentMethod === "COD" ? "border-[#cda567] bg-[#cda567]/5" : "border-gray-800 bg-[#1a1a1a] hover:border-gray-700"}`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        value="COD" 
                        checked={paymentMethod === "COD"} 
                        onChange={() => setPaymentMethod("COD")} 
                        className="w-5 h-5 accent-[#cda567]" 
                      />
                      <div className="flex-1">
                        <div className="text-white font-medium flex items-center gap-2">
                          <Truck size={18} className="text-gray-400" /> Cash on Delivery
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Pay when your order arrives</p>
                      </div>
                    </label>
                  </div>

                  <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-800">
                    <button onClick={prevStep} disabled={isProcessing} className="text-gray-400 hover:text-white font-medium disabled:opacity-50">
                      ← Back to Billing
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="bg-[#cda567] text-black font-semibold py-3 px-8 rounded-full hover:bg-[#b58f53] transition-colors flex items-center gap-2 disabled:opacity-70"
                    >
                      {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
                      {isProcessing ? "Processing..." : `Pay ₹${finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: ORDER SUMMARY */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#141414] rounded-2xl border border-gray-800 p-6 shadow-xl sticky top-6">
                <h3 className="text-lg font-semibold text-white mb-6 border-b border-gray-800 pb-4">Order Summary</h3>
                
                {/* Coupon Code section */}
                {step >= 2 && (
                  <div className="mb-6 border-b border-gray-800 pb-6">
                    <label className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-2 flex items-center gap-2">
                      <Tag size={14} /> Apply Coupon
                    </label>
                    {!appliedCoupon ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="SAVE10 or FLAT200"
                          className="flex-1 bg-[#1a1a1a] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:border-[#cda567] outline-none uppercase"
                        />
                        <button onClick={applyCoupon} className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition">
                          Apply
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
                        <span className="text-green-400 text-sm font-medium flex items-center gap-2">
                          <CheckCircle2 size={14} /> {appliedCoupon} Applied
                        </span>
                        <button onClick={removeCoupon} className="text-gray-400 hover:text-red-400 text-xs underline">Remove</button>
                      </div>
                    )}
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal ({totalQuantity} items)</span>
                    <span className="text-white">₹{subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount ({appliedCoupon})</span>
                      <span>- ₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-400">
                    <span>GST (3%)</span>
                    <span className="text-white">₹{gstAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span className="text-white">Free</span>
                  </div>
                </div>

                <div className="border-t border-gray-800 mt-4 pt-4 flex justify-between items-center">
                  <span className="text-lg font-medium text-white">Total</span>
                  <span className="text-2xl font-bold text-[#cda567]">
                    ₹{finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Trust Badges */}
                <div className="mt-8 pt-6 border-t border-gray-800 grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center text-center text-gray-500">
                    <ShieldCheck size={24} className="mb-2 text-[#cda567]/70" />
                    <span className="text-[10px] uppercase tracking-wider font-semibold">Secure Checkout</span>
                  </div>
                  <div className="flex flex-col items-center text-center text-gray-500">
                    <Lock size={24} className="mb-2 text-[#cda567]/70" />
                    <span className="text-[10px] uppercase tracking-wider font-semibold">SSL Encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
