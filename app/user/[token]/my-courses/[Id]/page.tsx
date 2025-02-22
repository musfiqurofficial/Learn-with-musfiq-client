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
  const { courses, fetchCourses, token } = useCourses();
  const [modules, setModules] = useState<Module[]>([]);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [currentPdfUrls, setCurrentPdfUrls] = useState<string[]>([]);
  const [watchedVideos, setWatchedVideos] = useState<string[]>([]);

  const course = courses.find((course) => course._id === Id);

  useEffect(() => {
    if (token) {
      fetchCourses();
    }
  }, [token, fetchCourses]);

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

  useEffect(() => {
    const fetchWatchedVideos = async () => {
      try {
        const response = await fetch("/api/watched-videos", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (!response.ok) throw new Error("Failed to fetch watched videos");
  
        const data = await response.json();
        if (Array.isArray(data.watchedVideos)) {
          setWatchedVideos(data.watchedVideos);
        } else {
          console.error("Invalid watched videos data:", data);
          setWatchedVideos([]); 
        }
      } catch (error) {
        console.error("Error fetching watched videos:", error);
        setWatchedVideos([]); 
      }
    };
  
    if (token) {
      fetchWatchedVideos();
    }
  }, [token]);

  const toggleModule = (moduleId: string) => {
    setActiveModule(activeModule === moduleId ? null : moduleId);
  };

  const markVideoAsWatched = async (lectureId: string) => {
    try {
      const response = await fetch(
        `/api/courses/${Id}/modules/${activeModule}/lectures/${lectureId}/watch`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message === "Video already watched") {
          console.log("Video already watched:", lectureId);
          setWatchedVideos((prev) => [...prev, lectureId]); 
          return;
        }
        throw new Error(errorData.message || "Failed to mark video as watched");
      }
  
      const data = await response.json();
      console.log("Video marked as watched:", data);
      setWatchedVideos((prev) => [...prev, lectureId]); 
      toast.success(data.message);
    } catch (error) {
      console.error("Error marking video as watched:", error);
      toast.error("Failed to mark video as watched");
    }
  };

  const handleVideoChange = async (
    lectureId: string,
    videoUrl: string,
    pdfUrls: string[]
  ) => {
    setCurrentVideo(videoUrl);
    setCurrentPdfUrls(pdfUrls);
  
    if (!activeModule) {
      console.error("No active module selected");
      toast.error("Please select a module first");
      return;
    }
  
    if (!watchedVideos.includes(lectureId)) {
      await markVideoAsWatched(lectureId); 
    }
  };

  const calculateProgress = () => {
    if (!course || !modules.length || !Array.isArray(watchedVideos)) return 0;
  
    const totalVideos = modules.flatMap((module) => module.lectures).length;
  
    const watchedCount = modules
      .flatMap((module) => module.lectures)
      .filter((lecture) => watchedVideos.includes(lecture._id)).length;
  
    return (watchedCount / totalVideos) * 100;
  };

  const isModuleCompleted = (moduleId: string) => {
    const moduleC = modules.find((module) => module._id === moduleId);
    if (!moduleC || !Array.isArray(watchedVideos)) return false;
  
    return moduleC.lectures.every((lecture) =>
      watchedVideos.includes(lecture._id)
    );
  };

  return (
    <ProtectedRoute roles={["user", "admin"]}>
      <div className="px-4 py-6 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-10">
        <BackButton />
        <h1 className="text-2xl font-bold text-gray-800 my-4">
          {course && course.title}
        </h1>

        <div className="grid lg:grid-cols-2 gap-4">
          <div className="border-2 border-gray-100 bg-slate-50 rounded-lg p-4">
            {currentVideo ? (
              <iframe
                width="auto"
                height="315"
                src={currentVideo}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                className="w-full"
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
              <div className="">
                <div className="bg-gray-200 relative h-2.5 w-full rounded-2xl">
                  <div
                    className="bg-blue-600 absolute top-0 left-0 h-full rounded-2xl"
                    style={{ width: `${calculateProgress()}%` }} // Dynamic progress bar
                  ></div>
                </div>
              </div>
              <span className="text-sm text-gray-600">
                {modules.length} modules, {watchedVideos.length} videos watched
              </span>
            </div>
            {modules.map((module) => {
              const isActive = module.lectures.some(
                (lecture) => lecture.videoUrl === currentVideo
              );
              const isCompleted = isModuleCompleted(module._id); // Check if module is completed

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
                    <h1 className="font-semibold text-[18px] text-start">
                    Module {module.moduleNumber}: {module.title} {isCompleted && "✅"}{" "}
                      {/* Module completion indicator */}
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
                  {/* Lecture section */}
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
                            handleVideoChange(
                              lecture._id,
                              lecture.videoUrl,
                              lecture.pdfUrls
                            )
                          }
                        >
                          <h2 className="font-semibold text-gray-600">
                            {lecture.lectureNumber}. {lecture.title}{" "}
                            {watchedVideos.includes(lecture._id) && "✅"}{" "}
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
