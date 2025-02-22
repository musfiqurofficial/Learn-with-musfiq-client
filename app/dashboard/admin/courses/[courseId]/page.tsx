"use client";
import BackButton from "@/components/BackButton";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { RiDeleteBin2Line } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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


export default function CourseManagement() {
  const { courseId } = useParams();
  const [modules, setModules] = useState<Module[]>([]);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [currentPdfUrls, setCurrentPdfUrls] = useState<string[]>([]);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    moduleId: string | null;
  }>({
    isOpen: false,
    moduleId: null,
  });

  // Edit states
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editingVideoUrl, setEditingVideoUrl] = useState<string | null>(null);
  const [editingLectureId, setEditingLectureId] = useState<string | null>(null);
  const [tempModuleTitle, setTempModuleTitle] = useState<string>("");
  const [tempVideoUrl, setTempVideoUrl] = useState<string>("");
  const [tempLectureTitle, setTempLectureTitle] = useState<string>("");

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch(`/api/courses/${courseId}/modules`);
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
  }, [courseId]);

  // Handle module title edit
  const handleModuleTitleEdit = (moduleId: string, title: string) => {
    setEditingModuleId(moduleId);
    setTempModuleTitle(title);
  };

  const saveModuleTitle = async (moduleId: string) => {
    try {
      const response = await fetch(
        `/api/courses/${courseId}/modules/${moduleId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: tempModuleTitle }),
        }
      );
      if (response.ok) {
        setModules((prevModules) =>
          prevModules.map((module) =>
            module._id === moduleId
              ? { ...module, title: tempModuleTitle }
              : module
          )
        );
        setEditingModuleId(null);
        toast.success("Module title updated successfully!");
      } else {
        throw new Error("Failed to update module title");
      }
    } catch {
      toast.error("Error updating module title");
    }
  };

  // Handle video URL edit
  const handleVideoUrlEdit = (videoUrl: string) => {
    setEditingVideoUrl(videoUrl);
    setTempVideoUrl(videoUrl);
  };

  const saveVideoUrl = async () => {
    try {
      // Find the lecture and its module
      const currentLecture = modules
        .flatMap((module) =>
          module.lectures.map((lecture) => ({
            ...lecture,
            moduleId: module._id,
          }))
        )
        .find((lecture) => lecture.videoUrl === currentVideo);

      if (!currentLecture) {
        throw new Error("Lecture not found");
      }

      const response = await fetch(
        `/api/courses/${courseId}/modules/${currentLecture.moduleId}/lectures/${currentLecture._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ videoUrl: tempVideoUrl }),
        }
      );

      if (response.ok) {
        // Update the video URL in state
        setModules((prevModules) =>
          prevModules.map((module) =>
            module._id === currentLecture.moduleId
              ? {
                  ...module,
                  lectures: module.lectures.map((lecture) =>
                    lecture._id === currentLecture._id
                      ? { ...lecture, videoUrl: tempVideoUrl }
                      : lecture
                  ),
                }
              : module
          )
        );

        setCurrentVideo(tempVideoUrl);
        setEditingVideoUrl(null);
        toast.success("Video URL updated successfully!");
      } else {
        throw new Error("Failed to update video URL");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating video URL");
    }
  };

  const handleLectureEdit = (lecture: Lecture) => {
    setEditingLectureId(lecture._id);
    setTempLectureTitle(lecture.title);
  };

  const saveLecture = async () => {
    try {
      if (!editingLectureId) {
        toast.error("No lecture is being edited!");
        return;
      }

      const lecture = modules
        .flatMap((module) =>
          module.lectures.map((lecture) => ({
            ...lecture,
            moduleId: module._id,
          }))
        )
        .find((lecture) => lecture._id === editingLectureId);

      if (!lecture) {
        toast.error("Lecture not found!");
        return;
      }

      const response = await fetch(
        `/api/courses/${courseId}/modules/${lecture.moduleId}/lectures/${lecture._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: tempLectureTitle,
          }),
        }
      );

      if (response.ok) {
        const updatedLecture = await response.json();
        console.log(updatedLecture);
        setModules((prevModules) =>
          prevModules.map((module) =>
            module._id === lecture.moduleId
              ? {
                  ...module,
                  lectures: module.lectures.map((l) =>
                    l._id === lecture._id ? updatedLecture : l
                  ),
                }
              : module
          )
        );
        setEditingLectureId(null);
        toast.success("Lecture updated successfully!");
      } else {
        throw new Error("Failed to update lecture");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating lecture");
    }
  };

  const toggleModule = (moduleId: string) => {
    setActiveModule(activeModule === moduleId ? null : moduleId);
  };

  const handleVideoChange = (videoUrl: string, pdfUrls: string[]) => {
    setCurrentVideo(videoUrl);
    setCurrentPdfUrls(pdfUrls);
  };

  const handleDeleteModule = async () => {
    try {
      const response = await fetch(
        `/api/courses/${courseId}/modules/${deleteModal.moduleId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setModules((prevModules) =>
          prevModules.filter((module) => module._id !== deleteModal.moduleId)
        );
        toast.success("Module deleted successfully");
      } else {
        toast.error("Error deleting module");
      }
    } catch {
      toast.error("Error deleting module");
    } finally {
      setDeleteModal({ isOpen: false, moduleId: null });
    }
  };

  return (
    <ProtectedRoute roles={["admin"]}>
      <div className="px-4 py-8 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-10 min-h-[70vh]">
        <BackButton />
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="border-2 border-gray-100 rounded-md shadow p-3 pb-4">
            {currentVideo ? (
              <div className="relative group">
                <iframe
                  src={currentVideo}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  className="w-full h-[540px] lg:h-[320px] rounded-md"
                  allowFullScreen
                ></iframe>
                <div
                  className="bg-white rounded-full p-1 absolute bottom-2 right-4 group-hover:opacity-100 cursor-pointer opacity-0 "
                  onClick={() => handleVideoUrlEdit(currentVideo)}
                >
                  <TbEdit className="w-6 h-6 text-green-500 " />
                </div>
              </div>
            ) : (
              <p>No video selected</p>
            )}

            {editingVideoUrl && (
              <div className="mt-4">
                <input
                  type="text"
                  value={tempVideoUrl}
                  onChange={(e) => setTempVideoUrl(e.target.value)}
                  className="border p-2 w-full"
                />
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={saveVideoUrl}
                    className="bg-green-500 text-white px-4 py-[6px] text-[12px] leading-3"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingVideoUrl(null)}
                    className="bg-red-500 text-white px-4 py-[6px] text-[12px] leading-3"
                  >
                    Cancel
                  </button>
                </div>
              </div>
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

          {/* Module List Section */}
          <div className="">
            {modules.map((module) => {
              const isActive = module.lectures.some(
                (lecture) => lecture.videoUrl === currentVideo
              );

              return (
                <div
                  key={module._id}
                  className={`border border-gray-100 mb-1 relative group ${
                    isActive ? "border-blue-200 bg-slate-50 shadow" : ""
                  }`}
                >
                  <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
                    <RiDeleteBin2Line
                      className="w-4 h-4 text-red-600 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                      onClick={() =>
                        setDeleteModal({ isOpen: true, moduleId: module._id })
                      }
                    />
                  </div>
                  <button
                    onClick={() => toggleModule(module._id)}
                    className={`flex items-center justify-between w-full px-4 py-2 focus:outline-none hover:bg-blue-500 hover:text-white group ${
                      isActive ? "bg-blue-500 text-white shadow" : ""
                    }`}
                  >
                    <div className="relative group ">
                      <h1 className="font-semibold text-[18px] text-start">
                        Module {module.moduleNumber}: {module.title}
                      </h1>
                      <TbEdit
                        className="absolute -top-2 -right-8 w-5 h-5 text-green-600 opacity-0 group-hover:opacity-100 cursor-pointer group-hover:text-white transition-opacity"
                        onClick={() =>
                          handleModuleTitleEdit(module._id, module.title)
                        }
                      />
                    </div>
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

                  {editingModuleId === module._id && (
                    <div className="mt-2 px-4 pb-2">
                      <input
                        type="text"
                        value={tempModuleTitle}
                        onChange={(e) => setTempModuleTitle(e.target.value)}
                        className="border p-2 w-auto"
                      />
                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={() => saveModuleTitle(module._id)}
                          className="bg-green-500 text-white px-4 py-[6px] text-[12px] leading-3"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingModuleId(null)}
                          className="bg-red-500 text-white px-4 py-[6px] text-[12px] leading-3"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* lecture section  */}
                  <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                      activeModule === module._id
                        ? "max-h-screen opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {activeModule === module._id && (
                      <div className="text-sm ">
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
                                lecture.videoUrl,
                                lecture.pdfUrls
                              )
                            }
                          >
                            <div className="flex justify-between items-center">
                              <span>
                                {lecture.lectureNumber}. {lecture.title}
                              </span>
                              <TbEdit
                                className="w-4 h-4 text-green-600 cursor-pointer mr-4"
                                onClick={() => handleLectureEdit(lecture)}
                              />
                            </div>
                            {editingLectureId === lecture._id && (
                              <div className="mt-2">
                                <input
                                  type="text"
                                  value={tempLectureTitle}
                                  onChange={(e) =>
                                    setTempLectureTitle(e.target.value)
                                  }
                                  className="border p-2 w-full"
                                />
                                <div className="flex space-x-2 mt-2">
                                  <button
                                    onClick={saveLecture}
                                    className="bg-green-500 text-white px-4 py-[6px] text-[12px] leading-3"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingLectureId(null)}
                                    className="bg-red-500 text-white px-4 py-[6px] text-[12px] leading-3"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="text-end mt-6">
              <Link
                href="/dashboard/admin/create"
                className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
              >
                + Add Module
              </Link>
            </div>
          </div>
        </div>
        <DeleteConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, moduleId: null })}
          onConfirm={handleDeleteModule}
          message="Are you sure you want to delete this module?"
        />
      </div>
    </ProtectedRoute>
  );
}
