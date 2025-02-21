"use client";
import React, { useEffect, useState } from "react";
import CourseCard from "@/components/CourseCard";

interface Course {
  _id: string;
  title: string;
  thumbnail: string;
  description: string;
  price: number;
}

const Courses = () => {
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
        <h2 className="text-[32px] font-bold text-center text-gray-700 my-4">
          Our Courses
        </h2>
        <div className="course-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.length > 0 ? (
            courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))
          ) : (
            <p className="text-center text-gray-600">No courses available.</p>
          )}
        </div>
      </div>
  );
};

export default Courses;
