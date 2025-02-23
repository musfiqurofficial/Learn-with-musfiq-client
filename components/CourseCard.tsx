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
    <div className="w-auto max-w-[360px] sm:max-w-full mx-auto border rounded-lg shadow-lg overflow-hidden ">
      <img
        src={course.thumbnail}
        alt={course.title}
        className="w-full h-auto sm:max-h-48 object-cover"
      />
      <div className="px-4 py-3">
        <h3 className="text[24px] font-semibold text-blue-500">
          {course.title}
        </h3>
        <div className="flex flex-row sm:flex-col lg:flex-row justify-between items-center mt-4 gap-y-2">
          <p className="text-[14px] text-gray-700 font-normal">
            Course Fee: <span className="text-[16px] font-bold">{course.price.toLocaleString("en-IN")}</span>{" "}
            BDT
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
