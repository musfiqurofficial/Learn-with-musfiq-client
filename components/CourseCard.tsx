import { useRouter } from "next/navigation";
import React from "react";

interface CourseCardProps {
  course: {
    _id: string;
    thumbnail: string;
    title: string;
    price: number;
    description: string;
  };
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const router = useRouter();

  return (
    <div className="course-card border rounded-lg shadow-lg overflow-hidden">
      <img
        src={course.thumbnail}
        alt={course.title}
        className="w-full h-auto sm:max-h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold">{course.title}</h3>
        <div className="flex flex-row sm:flex-col lg:flex-row justify-between items-center mt-4 gap-y-4">
          <p className="text-[16px] font-semibold text-gray-700">
            Course Fee: {course.price.toLocaleString("en-IN")} BDT
          </p>

          <button
            onClick={() => router.push(`/courses/${course._id}`)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
