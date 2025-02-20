"use client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BsThreeDotsVertical } from "react-icons/bs";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";

interface Course {
  _id: string;
  thumbnail: string;
  title: string;
  price: number;
  description: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  const confirmSingleDelete = (courseId: string) => {
    setIsBulkDelete(false);
    setCourseToDelete(courseId);
    setShowConfirmModal(true);
  };

  const confirmBulkDelete = () => {
    setIsBulkDelete(true);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (isBulkDelete) {
        await Promise.all(
          selectedCourses.map((courseId) =>
            fetch(`/api/courses/${courseId}`, {
              method: "DELETE",
            })
          )
        );
        toast.success("Selected courses deleted successfully!");
        setCourses((prevCourses) =>
          prevCourses.filter((course) => !selectedCourses.includes(course._id))
        );
        setSelectedCourses([]);
        setSelectAll(false);
      } else if (courseToDelete) {
        const response = await fetch(`/api/courses/${courseToDelete}`, {
          method: "DELETE",
        });
        if (response.ok) {
          toast.success("Course deleted successfully!");
          setCourses((prevCourses) =>
            prevCourses.filter((course) => course._id !== courseToDelete)
          );
        } else {
          throw new Error("Failed to delete course");
        }
      }
    } catch {
      toast.error("Error deleting course(s)");
    } finally {
      setShowConfirmModal(false);
      setCourseToDelete(null);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/courses");
        const data = await response.json();
        setCourses(data);
      } catch {
        toast.error("Error fetching courses");
      }
    };
    fetchCourses();
  }, []);

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourses((prevSelected) =>
      prevSelected.includes(courseId)
        ? prevSelected.filter((id) => id !== courseId)
        : [...prevSelected, courseId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedCourses([]);
    } else {
      const allCourseIds = courses.map((course) => course._id);
      setSelectedCourses(allCourseIds);
    }
    setSelectAll(!selectAll);
  };

  return (
    <ProtectedRoute roles={["admin"]}>
      <div className="px-4 py-8 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-10">
        <ToastContainer />
        <div className="flex justify-between relative">
          <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
          <Link
            href="/dashboard/admin/create"
            className="bg-blue-500 text-white px-4 py-2 rounded mb-10 inline-block"
          >
            Create New Course
          </Link>
          {selectedCourses.length > 0 && (
            <div className="absolute -bottom-4 right-0">
              <button
                onClick={confirmBulkDelete}
                className="bg-red-500 text-white px-2 py-1 rounded mb-6 text-[12px]"
              >
                Delete ({selectedCourses.length})
              </button>
            </div>
          )}
        </div>

        <div className="overflow-visible">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr>
                <th className="py-3 px-4 border-b text-start">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="py-3 px-4 border-b text-start">Thumbnail</th>
                <th className="py-3 px-4 border-b text-start">Course Name</th>
                <th className="py-3 px-4 border-b text-start">Publish Date</th>
                <th className="py-3 px-4 border-b text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr
                  key={course._id}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <td className="py-3 px-4 border-b">
                    <input
                      type="checkbox"
                      checked={selectedCourses.includes(course._id)}
                      onChange={() => handleSelectCourse(course._id)}
                    />
                  </td>
                  <td className="py-3 px-4 border-b">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-20 h-14 object-cover rounded-md"
                    />
                  </td>
                  <td className="py-3 px-4 border-b">{course.title}</td>
                  <td className="py-3 px-4 border-b">
                    {new Date(course.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3 px-4 border-b text-right relative">
                    <div className="relative inline-block group">
                      <BsThreeDotsVertical className="cursor-pointer" />
                      <div className="hidden group-hover:block absolute right-0 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                        <Link
                          href={`/dashboard/admin/courses/${course._id}`}
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 text-left"
                        >
                          Manage
                        </Link>
                        <button
                          onClick={() => confirmSingleDelete(course._id)}
                          className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <DeleteConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmDelete}
          message={
            isBulkDelete
              ? "Do you want to delete all selected courses?"
              : "Do you want to delete this course?"
          }
        />
      </div>
    </ProtectedRoute>
  );
}
