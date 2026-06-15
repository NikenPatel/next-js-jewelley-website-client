"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";

// import TextInput from "@/components/Common/TextInput";
// import { signup } from "@/store/authSlice";
import sideimage from "@/public/images/auth.png";
import { signup } from "@/app/store/slices/authSlice";
import TextInput from "@/app/components/common/Input";

interface FormState {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  adminKey: string;
}

const SignUpPage = () => {
  const dispatch = useDispatch<any>();
  const router = useRouter();

  const { loading, error } = useSelector((state: any) => state.auth);

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    role: "user",
    adminKey: "",
  });

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = { ...form };

    if (payload.role !== "admin") {
      delete (payload as Partial<FormState>).adminKey;
    }

    const result = await dispatch(signup(payload));

    if (signup.fulfilled.match(result)) {
      router.push("/");
    }
  };

  return (
    <div className="w-full h-screen overflow-y-auto bg-[#f3ece7] flex items-center justify-center p-7">
      <div className="w-full max-w-6xl h-full overflow-hidden rounded-[32px] shadow-xl bg-white grid lg:grid-cols-2">
        {/* Left Side */}
        <div className="hidden lg:flex flex-col justify-center relative bg-[#ddd0c8] p-16 overflow-hidden">
          <img
            src={sideimage.src}
            alt="Jewelry"
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />

          <div className="relative z-10">
            <div className="w-16 h-16 rounded-full border border-[#99775c] flex items-center justify-center mb-8">
              ✦
            </div>

            <h2 className="text-5xl font-serif text-[#323232] leading-tight">
              Create Your
              <br />
              Account
            </h2>

            <div className="w-20 h-[2px] bg-[#99775c] my-6"></div>

            <p className="text-[#323232]/70 text-lg max-w-sm">
              Join our premium jewellery platform and explore timeless elegance.
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="bg-white p-8 lg:p-16">
          <div className="max-w-md mx-auto">
            <h1 className="text-5xl font-serif text-[#99775c] mb-6 pb-9">
              Sign Up
            </h1>

            <form className="space-y-5" onSubmit={submit}>
              <TextInput
                label="Full Name"
                value={form.name}
                onChange={(name: string) => setForm({ ...form, name })}
              />

              <TextInput
                label="Email Address"
                type="email"
                value={form.email}
                onChange={(email: string) => setForm({ ...form, email })}
              />

              <TextInput
                label="Password"
                type="password"
                value={form.password}
                onChange={(password: string) => setForm({ ...form, password })}
              />

              <div>
                <label className="block text-sm mb-2 text-[#323232]">
                  Account Type
                </label>

                <select
                  value={form.role}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      role: e.target.value as "user" | "admin",
                    })
                  }
                  className="w-full h-14 rounded-xl border border-[#ddd0c8] px-4 bg-white focus:outline-none focus:border-[#99775c]"
                >
                  <option value="user">User Panel</option>
                  <option value="admin">Admin Panel</option>
                </select>
              </div>

              {form.role === "admin" && (
                <TextInput
                  label="Admin Key"
                  value={form.adminKey}
                  onChange={(adminKey: string) =>
                    setForm({
                      ...form,
                      adminKey,
                    })
                  }
                />
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-xl bg-[#99775c] text-white font-medium transition hover:opacity-90"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/auth/signin"
                  className="text-[#99775c] font-medium hover:underline"
                >
                  Already have an account? Sign In
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
