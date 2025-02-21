"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { IoIosArrowRoundBack } from "react-icons/io";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const router = useRouter();

  // Email Validation Regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Frontend validation
    if (name.trim().length < 3) {
      setError("Name must be at least 3 characters long.");
      return;
    }
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        login(data.user, data.token);
        router.push("/");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch {
      setError("An error occurred. Please try again later.");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        router.push("/");
      } else {
        console.log(false);
      }
    }
  }, [router]);

//   if (loading) return <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
//   <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-solid"></div>
// </div>;

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center">
      <h1 className="text-[24px] font-bold text-gray-600">
        Create a new account.
      </h1>

      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-2 text-red-600 border border-red-300 bg-red-50 rounded">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div className="mb-4 relative">
          <label className="block text-gray-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          Register
        </button>
      </form>

      <p className="mt-4">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </p>
      <div className="mt-4">
        <Link href="/">
          <div className="flex justify-center items-center gap-1 bg-gray-200 px-3 py-1 rounded-full text-[12px] transform transition-transform duration-300 font-semibold text-[#555] hover:scale-105 leading-none">
            <IoIosArrowRoundBack className="w-5 h-5" /> Back to home
          </div>
        </Link>
      </div>
    </div>
  );
}
