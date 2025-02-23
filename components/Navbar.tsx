"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import Image from "next/image";

import userImg from "../public/profile-white.png";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();

  const isActiveLink = (href: string) => {
    return pathname === href;
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setIsMenuOpen(!isMenuOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (pathname === "/auth/login" || pathname === "/auth/register") {
    return null;
  }

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  return (
    <nav ref={dropdownRef} className="shadow bg-[#fafafa] sticky top-0 z-50">
      <div className="px-5 py-3 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
        <div className="relative flex items-center justify-between">
          {user && (
            <div className="relative inline-block lg:hidden">
              <button onClick={toggleDropdown} className="">
                <Image
                  className="flex-shrink-0 object-cover rounded-full w-14 h-14"
                  src={userImg}
                  alt="jane avatar"
                  width={36}
                  height={36}
                />
              </button>

              {isOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute left-0 z-50 w-56 py-2 mt-2 overflow-hidden origin-top-right bg-white rounded-md shadow-xl "
                >
                  <a
                    href="#"
                    className="flex items-center p-3 -mt-2 text-sm transition-colors duration-300 transform  hover:bg-gray-100"
                  >
                    <Image
                      className="flex-shrink-0 object-cover mx-1 rounded-full w-9 h-9"
                      src={userImg}
                      alt="jane avatar"
                      width={36}
                      height={36}
                    />
                    <div className="mx-1">
                      <h1 className="text-sm font-semibold  ">{user.name}</h1>
                      <p className="text-sm ">{user.email}</p>
                    </div>
                  </a>

                  <hr className="border-gray-200" />

                  <Link
                    href={`/user/${token}/my-courses`}
                    className="block px-4 py-3 text-sm capitalize transition-colors duration-300 transform  hover:bg-gray-100  "
                  >
                    My Course
                  </Link>
                  <a
                    href="#"
                    className="block px-4 py-3 text-sm capitalize transition-colors duration-300 transform  hover:bg-gray-100  "
                  >
                    View profile
                  </a>
                  <hr className="border-gray-200 " />
                  <a
                    href="#"
                    className="block px-4 py-3 text-sm capitalize transition-colors duration-300 transform  hover:bg-gray-100  "
                  >
                    Settings
                  </a>

                  <button
                    onClick={logout}
                    className="block w-full text-start px-4 py-3 text-sm  capitalize transition-colors duration-300 transform  hover:bg-red-100  "
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
          <div className="flex items-center gap-x-10">
            <Link href="/">
              <h3 className="flex flex-col justify-center items-center leading-5">
                <span className="font-mono text-[18px]">Learn with</span>
                <span className="font-mono text-[30px] font-semibold uppercase text-blue-600">
                  Musfiq
                </span>
              </h3>
            </Link>
            <ul className="flex items-center hidden space-x-2 lg:flex">
              {user && user.role === "admin" && (
                <li>
                  <span
                    className={`font-medium tracking-wide transition-transform duration-300  hover:bg-gray-100 px-4 py-2 rounded ${
                      isActiveLink("/dashboard/admin")
                        ? "bg-gray-100 px-4 py-2 rounded shadow-sm"
                        : ""
                    }`}
                  >
                    <Link href="/dashboard/admin">Dashboard</Link>
                  </span>
                </li>
              )}
              <li>
                <span
                  className={`font-medium tracking-wide transition-transform duration-300  hover:bg-gray-100 px-4 py-2 rounded ${
                    isActiveLink("/")
                      ? "bg-gray-100 px-4 py-2 rounded shadow-sm"
                      : ""
                  }`}
                >
                  <Link href="/">Home</Link>
                </span>
              </li>
              <li>
                <span
                  className={`font-medium tracking-wide transition-transform duration-300  hover:bg-gray-100 px-4 py-2 rounded ${
                    isActiveLink("/courses")
                      ? "bg-gray-100 px-4 py-2 rounded shadow-sm"
                      : ""
                  }`}
                >
                  <Link href="/courses">Courses</Link>
                </span>
              </li>
              <li>
                <span
                  className={`font-medium tracking-wide transition-transform duration-300  hover:bg-gray-100 px-4 py-2 rounded ${
                    isActiveLink("/contact")
                      ? "bg-gray-100 px-4 py-2 rounded shadow-sm"
                      : ""
                  }`}
                >
                  <Link href="/contact">Contact</Link>
                </span>
              </li>
            </ul>
          </div>
          {user ? (
            <div className="relative lg:inline-block hidden">
              <button
                onClick={toggleDropdown}
                className="relative z-10 inline-flex items-center justify-center h-12 px-6 font-medium tracking-wide transition duration-300 rounded shadow-md bg-blue-600 hover:bg-blue-400 text-white focus:shadow-outline focus:outline-none"
              >
                <span className="mx-1">{user.name}</span>
                <svg
                  className="w-5 h-5 mx-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 15.713L18.01 9.70299L16.597 8.28799L12 12.888L7.40399 8.28799L5.98999 9.70199L12 15.713Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </button>

              {isOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 z-50 w-56 py-2 mt-2 overflow-hidden origin-top-right bg-white rounded-md shadow-xl "
                >
                  <a
                    href="#"
                    className="flex items-center p-3 -mt-2 text-sm transition-colors duration-300 transform  hover:bg-gray-100"
                  >
                    <Image
                      className="flex-shrink-0 object-cover mx-1 rounded-full w-9 h-9"
                      src={userImg}
                      alt="jane avatar"
                      width={36}
                      height={36}
                    />
                    <div className="mx-1">
                      <h1 className="text-sm font-semibold  ">{user.name}</h1>
                      <p className="text-sm ">{user.email}</p>
                    </div>
                  </a>

                  <hr className="border-gray-200" />

                  <Link
                    href={`/user/${token}/my-courses`}
                    className="block px-4 py-3 text-sm capitalize transition-colors duration-300 transform  hover:bg-gray-100  "
                  >
                    My Course
                  </Link>
                  <a
                    href="#"
                    className="block px-4 py-3 text-sm capitalize transition-colors duration-300 transform  hover:bg-gray-100  "
                  >
                    View profile
                  </a>
                  <hr className="border-gray-200 " />
                  <a
                    href="#"
                    className="block px-4 py-3 text-sm capitalize transition-colors duration-300 transform  hover:bg-gray-100  "
                  >
                    Settings
                  </a>

                  <button
                    onClick={logout}
                    className="block w-full text-start px-4 py-3 text-sm  capitalize transition-colors duration-300 transform  hover:bg-red-100  "
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <ul className="flex items-center hidden space-x-2 lg:flex">
              <li>
                <button
                  className={`font-medium tracking-wide transition-transform duration-300 hover:bg-gray-100 px-4 py-2 rounded`}
                >
                  <Link href="/auth/login">Sign in</Link>
                </button>
              </li>
              <li>
                <button className="inline-flex items-center justify-center h-12 px-6 font-medium tracking-wide transition duration-300 rounded shadow-md bg-blue-600 hover:bg-blue-400 text-white focus:shadow-outline focus:outline-none">
                  <Link href="/auth/register">Sign up</Link>
                </button>
              </li>
            </ul>
          )}
          <div className="lg:hidden">
            <button
              aria-label="Open Menu"
              title="Open Menu"
              className="p-2 -mr-1 transition duration-300 rounded focus:outline-none focus:shadow-outline hover:bg-deep-purple-50 focus:bg-deep-purple-50"
              onClick={() => setIsMenuOpen(true)}
            >
              <svg className="w-5 " viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M23,13H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,13,23,13z"
                />
                <path
                  fill="currentColor"
                  d="M23,6H1C0.4,6,0,5.6,0,5s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,6,23,6z"
                />
                <path
                  fill="currentColor"
                  d="M23,20H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,20,23,20z"
                />
              </svg>
            </button>
            {isMenuOpen && (
              <div className="absolute top-0 left-0 w-full">
                <div className="p-5 bg-white border rounded shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-full">
                      <Link href="/">
                        <h3 className="flex flex-col justify-center items-center leading-5">
                          <span className="font-mono text-[18px]">
                            Learn with
                          </span>
                          <span className="font-mono text-[30px] font-semibold uppercase text-blue-600">
                            Musfiq
                          </span>
                        </h3>
                      </Link>
                    </div>
                    <div className="">
                      <button
                        aria-label="Close Menu"
                        title="Close Menu"
                        className="p-2 -mt-2 -mr-2 transition duration-300 rounded hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:shadow-outline"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <svg className="w-5 " viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M19.7,4.3c-0.4-0.4-1-0.4-1.4,0L12,10.6L5.7,4.3c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l6.3,6.3l-6.3,6.3 c-0.4,0.4-0.4,1,0,1.4C4.5,19.9,4.7,20,5,20s0.5-0.1,0.7-0.3l6.3-6.3l6.3,6.3c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3 c0.4-0.4,0.4-1,0-1.4L13.4,12l6.3-6.3C20.1,5.3,20.1,4.7,19.7,4.3z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <nav className="w-full">
                    <ul className="space-y-4">
                      {user && user.role === "admin" && (
                        <li>
                          <span
                            className={`font-medium tracking-wide transition-transform duration-300  hover:bg-gray-100 px-4 py-2 rounded ${
                              isActiveLink("/dashboard/admin")
                                ? "bg-gray-100 rounded shadow-sm"
                                : ""
                            }`}
                          >
                            <Link href="/dashboard/admin">Dashboard</Link>
                          </span>
                        </li>
                      )}
                      <li>
                        <span
                          className={`font-medium transition-transform duration-300  hover:bg-gray-100 px-4 py-2 rounded ${
                            isActiveLink("/")
                              ? "bg-gray-100 rounded shadow-sm w-full"
                              : ""
                          }`}
                        >
                          <Link href="/">Home</Link>
                        </span>
                      </li>
                      <li>
                        <span
                          className={`font-medium tracking-wide transition-transform duration-300  hover:bg-gray-100 px-4 py-2 rounded ${
                            isActiveLink("/courses")
                              ? "bg-gray-100 rounded shadow-sm"
                              : ""
                          }`}
                        >
                          <Link href="/courses">Courses</Link>
                        </span>
                      </li>
                      <li>
                        <span
                          className={`font-medium tracking-wide transition-transform duration-300  hover:bg-gray-100 px-4 py-2 rounded ${
                            isActiveLink("/contact")
                              ? "bg-gray-100 rounded shadow-sm"
                              : ""
                          }`}
                        >
                          <Link href="/contact">Contact</Link>
                        </span>
                      </li>
                      {user ? (
                        <button
                          onClick={logout}
                          className="inline-flex items-center justify-center w-full text-white h-12 px-6 font-medium tracking-wide transition duration-300 rounded shadow-md bg-red-400 hover:bg-red-700 focus:shadow-outline focus:outline-none"
                        >
                          <Link href="/auth/register">Sign out</Link>
                        </button>
                      ) : (
                        <>
                          <li>
                            <button
                              className={`font-medium tracking-wide transition-transform duration-300  hover:bg-gray-100 px-4 py-2 rounded`}
                            >
                              <Link href="/auth/login">Sign in</Link>
                            </button>
                          </li>
                          <li>
                            <button className="inline-flex items-center justify-center w-full text-white h-12 px-6 font-medium tracking-wide transition duration-300 rounded shadow-md bg-blue-400 hover:bg-blue-700 focus:shadow-outline focus:outline-none">
                              <Link href="/auth/register">Sign up</Link>
                            </button>
                          </li>
                        </>
                      )}
                    </ul>
                  </nav>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
