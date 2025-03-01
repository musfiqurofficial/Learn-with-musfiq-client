"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { IoIosArrowRoundBack } from "react-icons/io";
import { BadgeCheck } from "lucide-react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  // const [role, setRole] = useState("");
  const { login } = useAuth();

  const router = useRouter();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation checks
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
    if (!verificationCode) {
      setError("Please verify your email address.");
      return;
    }
    // if (!role) {
    //   setError("Please select a role (user or admin).");
    //   return;
    // }

    // Log the payload
    console.log("Registration Payload:", {
      name,
      email,
      password,
      verificationCode,
      // role,
    });

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, verificationCode }),
      });
      const data = await response.json();
      if (response.ok) {
        login(data.user, data.token);
        router.push("/");
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch {
      setError("An error occurred. Please try again later.");
    }
  };

  const handleSendCode = async () => {
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    toast.promise(
      fetch("/api/auth/send-verification-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }).then(async (response) => {
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Failed to send code");
        setIsEmailSent(true);
        setVerificationCode(data.code);
        return "Verification code sent successfully!";
      }),
      {
        pending: "Sending verification code...",
        success: "Verification code sent!",
        error: "Failed to send verification code. Please try again.",
      }
    );
  };

  const handleVerifyCode = async () => {
    try {
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: verificationCode }),
      });
      const data = await response.json();
      if (response.ok) {
        setIsVerified(true);
        setIsEmailVerified(true);
      } else {
        setError(
          data.message || "Invalid verification code. Please try again."
        );
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

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center">
      <h1 className="text-[24px] font-bold text-gray-600">
        Create a new account.
      </h1>

      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        {error && (
          <div className="mb-4 p-2 text-red-600 border border-red-300 bg-red-50 rounded">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            value={name || ""}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
            placeholder="Enter your name"
          />
        </div>

        <div className="mb-4">
          <div className="w-full flex justify-start items-center">
            <label className="block text-gray-700">Email</label>
            {isVerified && (
              <div className="text-green-500">
                <BadgeCheck className="w-4 h-4 ml-2" />
              </div>
            )}
          </div>
          <div className="flex items-center relative">
            <input
              type="email"
              value={email || ""}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-3 pr-[70px] py-2 border rounded-lg"
              required
              disabled={isEmailSent}
              placeholder="Enter your email address"
            />
            {isEmailSent ? (
              <button
                type="button"
                onClick={() => setIsEmailSent(false)}
                className="ml-2 text-blue-500 hover:underline text-[12px] absolute right-3 -top-5"
              >
                Edit
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSendCode}
                className="ml-2 text-blue-500 hover:underline text-[12px] absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                Get Code
              </button>
            )}
          </div>
        </div>

        {isEmailSent && !isVerified && (
          <div className="mb-4">
            <label className="block text-gray-700">Verification Code</label>
            <div className="flex items-center relative">
              <input
                type="text"
                value={verificationCode || ""}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full pl-3 pr-[70px] py-2 border rounded-lg"
                required
                placeholder="Enter 5-digit code"
              />
              <button
                type="button"
                onClick={handleVerifyCode}
                className="ml-2 text-green-500 hover:underline text-[12px] absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                Verify
              </button>
            </div>
          </div>
        )}

        <div className="mb-4 relative">
          <label className="block text-gray-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
              placeholder="Enter your password"
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

        {/* <div className="mb-4">
          <label className="block text-gray-700">Role</label>
          <div className="flex items-center">
            <label className="inline-flex items-center mr-4">
              <input
                type="radio"
                value="user"
                checked={role === "user"}
                onChange={(e) => setRole(e.target.value)}
                className="form-radio"
                required
              />
              <span className="ml-2">User</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="admin"
                checked={role === "admin"}
                onChange={(e) => setRole(e.target.value)}
                className="form-radio"
                required
              />
              <span className="ml-2">Admin</span>
            </label>
          </div>
          {!role && ( // Show error if role is not selected
            <p className="text-red-500 text-sm mt-1">Please select a role.</p>
          )}
        </div> */}

        <button
          type="submit"
          className={`w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 ${
            !isEmailVerified && "opacity-50 cursor-not-allowed"
          }`}
          disabled={!isEmailVerified}
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
