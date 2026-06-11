"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import sideimage from "@/public/images/auth.png";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import TextInput from "@/app/components/ui/Input";
import { signin } from "@/app/store/slices/authSlice";

interface LoginForm {
  email: string;
  password: string;
}

export default function SignInPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { loading, error } = useAppSelector((state) => state.auth as any);

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await dispatch(signin(form));

    if (signin.fulfilled.match(result)) {
      router.push("/");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f3ece7] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl min-h-[750px] overflow-hidden rounded-[32px] shadow-xl bg-white grid lg:grid-cols-2">
        {/* Left Side */}
        <div className="hidden lg:flex relative bg-[#ddd0c8] overflow-hidden">
          <Image
            src={sideimage}
            alt="Jewelry"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover opacity-20"
            priority
          />

          <div className="relative z-10 flex flex-col justify-center px-16">
            <div className="w-16 h-16 rounded-full border border-[#99775c] flex items-center justify-center mb-8">
              ✦
            </div>

            <h2 className="text-5xl font-serif text-[#323232] leading-tight">
              Welcome
              <br />
              Back
            </h2>

            <div className="w-20 h-[2px] bg-[#99775c] my-6" />

            <p className="text-[#323232]/70 text-lg max-w-sm">
              Sign in to access your jewellery dashboard and manage your
              account.
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center justify-center p-8 lg:p-16">
          <div className="w-full max-w-md">
            <h1 className="text-5xl font-serif text-[#99775c] mb-3 pb-9">
              Sign In
            </h1>

            <form onSubmit={submit} className="space-y-5">
              <TextInput
                label="Email Address"
                type="email"
                value={form.email}
                onChange={(email: string) =>
                  setForm((prev) => ({
                    ...prev,
                    email,
                  }))
                }
              />

              <TextInput
                label="Password"
                type="password"
                value={form.password}
                onChange={(password: string) =>
                  setForm((prev) => ({
                    ...prev,
                    password,
                  }))
                }
              />

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-xl bg-[#99775c] text-white font-medium hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>

              <div className="flex justify-end">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-[#99775c] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="text-center pt-2">
                <Link
                  href="/auth/signup"
                  className="text-[#99775c] font-medium hover:underline"
                >
                  Don't have an account? Create Account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
