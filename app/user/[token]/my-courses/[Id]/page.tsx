"use client";
import BackButton from "@/components/BackButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useCourses } from "@/context/CoursesContext";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Lecture {
  _id: string;
  lectureNumber: string;
  title: string;
  videoUrl: string;
  pdfUrls: string[];
}

interface Module {
  _id: string;
  moduleNumber: string;
  title: string;
  lectures: Lecture[];
}

export default function LearnCourse() {
  const { Id } = useParams();
  const { courses } = useCourses();
  const [modules, setModules] = useState<Module[]>([]);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [currentPdfUrls, setCurrentPdfUrls] = useState<string[]>([]);

  const course = courses.find((course) => course._id === Id);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch(`/api/courses/${Id}/modules`);
        const data = await response.json();
        setModules(data);

        if (data.length > 0) {
          setActiveModule(data[0]._id);
          if (data[0].lectures.length > 0) {
            setCurrentVideo(data[0].lectures[0].videoUrl);
            setCurrentPdfUrls(data[0].lectures[0].pdfUrls);
          }
        }
      } catch {
        toast.error("Error fetching modules");
      }
    };
    fetchModules();
  }, [Id]);

  const toggleModule = (moduleId: string) => {
    setActiveModule(activeModule === moduleId ? null : moduleId);
  };

  const handleVideoChange = (videoUrl: string, pdfUrls: string[]) => {
    setCurrentVideo(videoUrl);
    setCurrentPdfUrls(pdfUrls);
  };

  return (
    <ProtectedRoute roles={["user", "admin"]}>
      <div className="px-4 py-6 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-10">
        <BackButton />
        <h1 className="text-2xl font-bold text-gray-800 my-4">
          {course ? course.title : "..."}
        </h1>

        <div className="grid grid-cols-2 gap-4">
          <div className="border-2 border-gray-100 bg-slate-50 rounded-lg p-4">
            {currentVideo ? (
              <iframe
                width="560"
                height="315"
                src={currentVideo}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            ) : (
              <p>No video selected</p>
            )}

            {currentPdfUrls.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold text-gray-700">PDF Resources:</h3>
                <ul className="list-disc list-inside text-gray-600">
                  {currentPdfUrls.map((url, index) => (
                    <li key={index}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Download PDF {index + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="bg-slate-50 p-2 rounded-lg border-2 border-gray-100">
            <div className="">
              <span className="">Running Progress: </span>
              <progress
                value="50"
                max="100"
                className="w-full h-2 bg-gray-200 rounded-lg"
              ></progress>
              module: 0/5
            </div>
            {modules.map((module) => {
              const isActive = module.lectures.some(
                (lecture) => lecture.videoUrl === currentVideo
              );

              return (
                <div
                  key={module._id}
                  className="border-2 border-gray-100 rounded-lg mb-4"
                >
                  <button
                    onClick={() => toggleModule(module._id)}
                    className={`flex items-center justify-between w-full px-4 py-2 focus:outline-none hover:bg-blue-500 hover:text-white group ${
                      isActive ? "bg-blue-500 text-white shadow" : ""
                    }`}
                  >
                    <h1 className="font-semibold text-[18px]">
                      {module.title}
                    </h1>
                    <span className=" bg-gray-200 rounded-full p-2">
                      {activeModule === module._id ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`w-5 h-5 group-hover:text-red-500 ${
                            isActive ? "text-red-500" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M18 12H6"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`w-5 h-5 group-hover:text-blue-500 ${
                            isActive ? "text-blue-500" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      )}
                    </span>
                  </button>
                  {/* lecture section  */}
                  <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                      activeModule === module._id
                        ? "max-h-screen opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="text-sm text-gray-500">
                      {module.lectures.map((lecture) => (
                        <div
                         key={lecture._id}
                            className={`pl-8 py-2 cursor-pointer border border-stone-200/50 ${
                              lecture.videoUrl === currentVideo
                                ? "bg-blue-300/40"
                                : "hover:bg-gray-100"
                            }`}
                          onClick={() =>
                            handleVideoChange(lecture.videoUrl, lecture.pdfUrls)
                          }
                        >
                          <h2 className="font-semibold text-gray-600">
                            {lecture.lectureNumber}. {lecture.title}
                          </h2>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
