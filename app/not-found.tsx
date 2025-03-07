"use client";

import Link from "next/link";
import BackButton from "@/components/BackButton";

export default function NotFound() {
  return (
    <section className="bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full h-full">
      <div className="container flex items-center min-h-screen px-6 py-12 mx-auto">
        <div className="flex flex-col items-center max-w-sm mx-auto text-center">
          <p className="p-3 text-sm font-medium text-blue-500 rounded-full bg-blue-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-gray-800 md:text-3xl">
            Page not found
          </h1>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            The page you are looking for doesn&apos;t exist. Here are some
            helpful links:
          </p>

          <div className="flex items-center w-full mt-6 gap-x-3 shrink-0 sm:w-auto">
            <BackButton />

            <Link href="/">
              <button className="flex justify-center items-center gap-1 bg-blue-600 px-2 py-2 rounded-full text-[12px] transform transition-transform duration-300 font-semibold text-[#fff] hover:scale-105 leading-none mb-2">
                Take me home
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
{
  /* <Link href="/">Return Home</Link> */
}
