"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { IoIosArrowRoundBack } from "react-icons/io";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        login(data.user, data.token);
        toast.success("Login successful!");

        if (data.user.role === "admin") {
          router.push("/dashboard/admin");
        } else {
          router.push("/");
        }
      } else {
        setError("Email or Password not match. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again later.");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        router.push("/");
      } else {
        setLoading(false);
      }
    }
  }, [router]);
  

  if (loading) return  <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-solid"></div>
</div>;

  return (
    <div className="flex min-h-[95vh] flex-col items-center justify-center">
      <h1 className="text-[24px] font-bold text-gray-600">
        Log in to your account.
      </h1>
      {error && (
        <p className="text-red-500 text-[12px] text-center mt-3">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="w-full max-w-sm mt-4">
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Enter your Email"
            required
          />
          {!validateEmail(email) && email && (
            <p className="text-red-500 text-[12px]">Invalid email format.</p>
          )}
        </div>
        <div className="mb-4 ">
          <label className="block text-gray-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[45px] px-3 border rounded-lg"
              placeholder="Enter your Password"
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
          {password.length > 0 && password.length < 6 && (
            <p className="text-red-500 text-[12px]">
              Password must be at least 6 characters.
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          disabled={
            !email || !password || !validateEmail(email) || password.length < 6
          }
        >
          Sign in
        </button>
      </form>
      <p className="mt-4">
        Don&apos;t have an account?{" "}
        <a href="/auth/register" className="text-blue-500 hover:underline">
          Sign up
        </a>
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
