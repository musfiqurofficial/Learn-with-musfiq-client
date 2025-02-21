"use client";
import React, { useEffect, useState } from "react";
import CourseCard from "@/components/CourseCard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Hero } from "@/components/Home/Hero";
import { WhyChooseUs } from "@/components/Home/WhyChooseUs";
import { CallToAction } from "@/components/Home/CallToAction";
import { Testimonials } from "@/components/Home/Testimonials ";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface Course {
  _id: string;
  title: string;
  thumbnail: string;
  description: string;
  price: number;
}

const Home: React.FC = () => {
  const { user } = useAuth(); // Get user state from AuthContext
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/courses");
        if (!response.ok) throw new Error("Failed to fetch courses");

        const data: Course[] = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="px-4 py-8 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-10">
      <Hero />

      <h2 className="text-[32px] font-bold text-center text-gray-700 my-4">
        Our Courses
      </h2>
      <div className="course-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.slice(0, 3).map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
      {courses.length > 3 && (
        <center>
          <button className="mt-8 px-6 py-3 bg-blue-600 text-white rounded mb-10">
            <Link href="/courses">All Courses</Link>
          </button>
        </center>
      )}

      {!user ? (
        <p className="text-center text-red-500 font-semibold my-4">
          Login to access full features.
        </p>
      ) : (
        <ProtectedRoute roles={["user", "admin"]}>
          <p className="text-center text-green-500 font-semibold">
            Welcome, {user.name}!
          </p>
        </ProtectedRoute>
      )}

      <Testimonials />
      <WhyChooseUs />
      <CallToAction />
    </div>
  );
};

export default Home;
