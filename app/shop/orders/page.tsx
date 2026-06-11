"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectOrdersToProfile() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/shop/profile?tab=orders");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fcfaf9]">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#ddd0c8] border-t-[#99775c]" />
    </div>
  );
}
