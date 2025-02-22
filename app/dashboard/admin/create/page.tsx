"use client";

import BackButton from "@/components/BackButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import React, { useState, useEffect } from "react";
import { MdAddBox } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";

interface Course {
  _id: string;
  title: string;
  price: number;
  thumbnail: string;
  description: string;
}

interface Module {
  _id: string;
  title: string;
  moduleNumber: string;
  lectures: {
    lectureNumber: string;
    title: string;
    videoUrl: string;
    pdfUrls: string[];
  }[];
}

function Create() {
  const [urls, setUrls] = useState<string[]>([""]);
  const [thumbnail, setThumbnail] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [moduleTitle, setModuleTitle] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [lectureTitle, setLectureTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [selectedModule, setSelectedModule] = useState("");

  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);

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

  useEffect(() => {
    const fetchModules = async () => {
      if (selectedCourse) {
        try {
          const response = await fetch(
            `/api/courses/${selectedCourse}/modules`
          );
          const data = await response.json();
          setModules(data);
        } catch {
          toast.error("Error fetching modules");
        }
      }
    };
    fetchModules();
  }, [selectedCourse]);

  const handleUrlChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newUrls = [...urls];
    newUrls[index] = event.target.value;
    setUrls(newUrls);
  };

  const addUrlField = () => {
    setUrls([...urls, ""]);
  };

  const removeUrlField = (index: number) => {
    const newUrls = [...urls];
    newUrls.splice(index, 1);
    setUrls(newUrls);
  };

  const handleCourseSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const courseData = { thumbnail, title, price, description };
    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseData),
      });
      if (response.ok) {
        toast.success("Course created successfully!");
        setThumbnail("");
        setTitle("");
        setPrice("");
        setDescription("");
        const updatedCourses = await fetch("/api/courses").then((res) =>
          res.json()
        );
        setCourses(updatedCourses);
      } else {
        throw new Error("Failed to create course");
      }
    } catch {
      toast.error("Error creating course");
    }
  };

  const handleModuleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const moduleData = { title: moduleTitle };
    try {
      const response = await fetch(`/api/courses/${selectedCourse}/modules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(moduleData),
      });
      if (response.ok) {
        toast.success("Module added successfully!");
        setModuleTitle("");
        const updatedModules = await fetch(
          `/api/courses/${selectedCourse}/modules`
        ).then((res) => res.json());
        setModules(updatedModules);
      } else {
        throw new Error("Failed to add module");
      }
    } catch {
      toast.error("Error adding module");
    }
  };

  const handleLectureSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const lectureData = { title: lectureTitle, videoUrl, pdfUrls: urls };
    try {
      const response = await fetch(
        `/api/courses/${selectedCourse}/modules/${selectedModule}/lectures`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(lectureData),
        }
      );
      if (response.ok) {
        toast.success("Lecture added successfully!");
        setLectureTitle("");
        setVideoUrl("");
        setUrls([""]);
        const updatedModules = await fetch(
          `/api/courses/${selectedCourse}/modules`
        ).then((res) => res.json());
        setModules(updatedModules);
      } else {
        throw new Error("Failed to add lecture");
      }
    } catch {
      toast.error("Error adding lecture");
    }
  };

  return (
    <ProtectedRoute roles={["admin"]}>
      <div className="px-4 py-6 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-10">
        <BackButton />
        <h1 className="text-2xl font-bold mb-10 text-center">
          Course Management
        </h1>

        <div className="grid grid-cols-2 gap-10">
          {/* Course Upload Form */}
          <form onSubmit={handleCourseSubmit} className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Create Course</h2>
            <input
              type="text"
              placeholder="Thumbnail URL"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              required
              className="mb-2 border outline-amber-500 p-2 w-full"
            />
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="border outline-amber-500 p-2 mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="border outline-amber-500 p-2 mb-2 w-full"
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="border outline-amber-500 p-2 mb-2 w-full field-sizing-fixed"
              rows={2}
            />
            <button type="submit" className="bg-blue-500 text-white p-2 w-full">
              Create Course
            </button>
          </form>

          {/* Module Management Form */}
          <form className="mb-6" onSubmit={handleModuleSubmit}>
            <h2 className="text-xl font-semibold mb-2">Add Module</h2>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              required
              className="border outline-amber-500 p-2 mb-2 w-full"
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Module Title"
              value={moduleTitle}
              onChange={(e) => setModuleTitle(e.target.value)}
              required
              className="border outline-amber-500 p-2 mb-2 w-full"
            />
            <button
              type="submit"
              className="bg-green-500 text-white p-2 w-full"
            >
              Add Module
            </button>
          </form>

          {/* Lecture Management Form */}
          <form className="mb-6" onSubmit={handleLectureSubmit}>
            <h2 className="text-xl font-semibold mb-2">Add Lecture</h2>
            <span className="text-red-500 text-[12px]">Select your right module first</span>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              required
              className="border outline-amber-500 p-2 mb-2 w-full"
            >
              <option value="">Select Module</option>
              {modules.map((module) => (
                <option key={module._id} value={module._id}>
                  {module.title} (Module {module.moduleNumber})
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Lecture Title"
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
              required
              className="border outline-amber-500 p-2 mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Video URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              required
              className="border outline-amber-500 p-2 mb-2 w-full"
            />

            {/* Multiple URL Upload Input Fields */}
            {urls.map((url, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  placeholder="PDF URL"
                  value={url}
                  onChange={(event) => handleUrlChange(index, event)}
                  className="border outline-amber-500 p-2 w-full"
                  required
                />
                {urls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeUrlField(index)}
                    className="ml-2 bg-red-500 text-white p-2"
                  >
                    -
                  </button>
                )}
              </div>
            ))}
            <div className="w-full inline-flex justify-end">
              <button
                type="button"
                onClick={addUrlField}
                className="bg-red-600 text-white p-[1px] rounded-sm mb-2 "
              >
                <MdAddBox className="w-5 h-5" />
              </button>
            </div>

            <button
              type="submit"
              className="bg-purple-500 text-white p-2 w-full "
            >
              Add Lecture
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </ProtectedRoute>
  );
}

export default Create;
