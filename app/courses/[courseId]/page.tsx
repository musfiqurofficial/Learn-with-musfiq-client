"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Star,
  Video,
  Calendar,
  Users,
  Clock,
  FileCode,
  Youtube,
} from "lucide-react";
import Loading from "@/app/loading";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";

interface Course {
  _id: string;
  title: string;
  thumbnail: string;
  description: string;
  price: number;
}

const CourseDetails: React.FC = () => {
  const [course, setCourse] = useState<Course | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!courseId) return;

    const fetchCourseDetails = async () => {
      try {
        const response = await fetch(`/api/courses/${courseId}`);
        if (!response.ok) throw new Error("Failed to fetch course details");

        const data: Course = await response.json();
        setCourse(data);
        if (user && user.enrolledCourses.includes(courseId)) {
          setIsEnrolled(true);
        }
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };

    fetchCourseDetails();
  }, [courseId, user]);

  const handleAdmission = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication required! Please log in.");
      return;
    }

    try {
      const response = await fetch(`/api/courses/${courseId}/enroll`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to enroll in course");

      toast.success("Successfully enrolled in the course!");
      setIsEnrolled(true);
      router.push(`/user/${token}/my-courses`);
    } catch (error) {
      console.error("Error enrolling in course:", error);
      toast.error("Failed to enroll in the course. Please try again.");
    }
  };

  if (!course) return <Loading />;

  return (
    <ProtectedRoute roles={["user", "admin"]}>
      <div className="px-4 py-8 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-10">
        <div className="container px-4 py-8 mx-auto">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Live Course Badge */}
              <div className="flex items-center gap-2">
                <div className="text-[14px] font-medium bg-gray-200 px-3 py-1 rounded-full">
                  <span className="mr-1">📻</span> Live Course
                </div>
              </div>

              {/* Course Title & Rating */}
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight">
                  {course.title}
                </h1>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <span className="text-lg font-bold text-green-500">
                      4.9
                    </span>
                    <Star className="w-5 h-5 ml-1 fill-yellow-400 text-yellow-400" />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    (293 Ratings)
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground">{course.description}</p>

              {/* Price & CTA */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleAdmission}
                  disabled={isEnrolled}
                  className={`bg-blue-400 hover:bg-blue-500 px-4 py-2 text-white rounded-lg ${
                    isEnrolled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Admission <span className="ml-2">→</span>
                </button>
                <div>
                  <span className="text-2xl font-bold">
                    ৳{course.price.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Course Stats */}
              <div className="flex justify-evenly ">
                <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
                  <Video className="w-4 h-4 text-muted-foreground" />
                  <span className="text-[12px]">84 Live Class</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
                  <FileCode className="w-4 h-4 text-muted-foreground" />
                  <span className="text-[12px]">18 Projects</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-[12px]">9 Days Left</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
                  <Video className="w-4 h-4 text-muted-foreground" />
                  <span className="text-[12px]">193 Pre Recorded videos</span>
                </div>
              </div>
            </div>

            {/* Right Column - Video Preview */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-blue-100 shadow-lg">
              <div className="absolute inset-0">
                <img
                  src={course.thumbnail}
                  alt="DART MasterClass Preview"
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="bg-white p-3 rounded-full shadow-xl transform transition-transform duration-300 hover:scale-105">
                    <Youtube className="text-blue-500 w-8 h-8 " />
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Features */}
          <div className="grid gap-4 sm:grid-cols-2 my-4">
            <div className="flex items-center gap-2 p-4 bg-green-50 rounded-lg">
              <Users className="w-5 h-5 text-green-500" />
              <span className="text-sm text-green-700">
                Job placement support
              </span>
            </div>
            <div className="flex items-center gap-2 p-4 bg-green-50 rounded-lg">
              <Clock className="w-5 h-5 text-green-500" />
              <span className="text-sm text-green-700">
                Lifetime Access to Class Recordings
              </span>
            </div>
          </div>

          {/* Schedule Info */}
          <div className="grid gap-6 p-6 border rounded-lg">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  স্টার্ট ডেট
                </h3>
                <p className="mt-1">Friday 28 February</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Live Class
                </h3>
                <p className="mt-1">
                  09:00 PM- 10:30 PM (Wednesday,Saturday,Monday)
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  ইন্টারভিউ সাপোর্ট
                </h3>
                <p className="mt-1">দিনে ১৬ ঘন্টা সপ্তাহে ৬ দিন সাপোর্ট</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Seat Left
                </h3>
                <p className="mt-1">32</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CourseDetails;
