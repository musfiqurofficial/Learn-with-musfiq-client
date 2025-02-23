"use client";
import Link from "next/link";
import { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation"; 

export default function ForgetEmail() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        toast.success("Check your email for a password reset link.");
        setTimeout(() => {
          router.push("/"); 
        }, 2000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full h-full">
      <div className="container flex flex-col items-center justify-center min-h-screen px-6 py-12 mx-auto">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <h2 className="text-xl font-bold">Forgot Password?</h2>
          <p className="text-gray-500">Enter your email to reset your password.</p>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2 border rounded mt-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full mt-4 bg-blue-500 text-white py-2 rounded"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        <div className="mt-4">
          <Link href="/">
            <div className="flex justify-center items-center gap-1 bg-gray-200 px-3 py-1 rounded-full text-[12px] transform transition-transform duration-300 font-semibold text-[#555] hover:scale-105 leading-none">
              <IoIosArrowRoundBack className="w-5 h-5" /> Back to home
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
