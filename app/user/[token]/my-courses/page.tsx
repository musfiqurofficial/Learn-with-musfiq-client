"use client";
import React, { useEffect } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCourses } from "@/context/CoursesContext";

const MyCourses = () => {
  const { courses, setCourses } = useCourses();
  const { user, token } = useAuth();
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        if (!token) return;

        const response = await fetch("/api/user-courses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch enrolled courses");

        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
      } finally {
        console.log(false);
      }
    };

    fetchEnrolledCourses();
  }, [setCourses]);

  // if (loading)
  //   return (
  //     <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
  //       <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-solid"></div>
  //     </div>
  //   );

  return (
    <ProtectedRoute roles={["user", "admin"]}>
      <div className="px-4 py-8 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl min-h-[60vh]">
        <h1 className="text-3xl font-bold my-8">
          Welcome back {user?.name ?? "Guest"}, ready for your next lesson?
        </h1>
        {courses.length === 0 ? (
          <p className="text-gray-500">
            You have not enrolled in any courses yet.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {courses.map((course) => (
              <div
                key={course._id}
                className="w-full flex flex-col lg:flex-row items-center gap-4 p-4 bg-gray-300/30"
              >
                <div className="rounded-lg shadow-md">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-auto lg:max-h-[140px] object-cover rounded-lg"
                  />
                </div>
                <div className="">
                  <h3 className="text-[20px] font-semibold text-blue-600 mb-4">
                    {course.title}
                  </h3>
                  <Link
                    href={`/user/${token}/my-courses/${course._id}`}
                    className="px-4 py-3 text-white rounded bg-blue-600 hover:bg-blue-500 flex justify-center lg:flex-none"
                  >
                    Start Course
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default MyCourses;
