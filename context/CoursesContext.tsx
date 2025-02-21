"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface Course {
  _id: string;
  title: string;
  thumbnail: string;
  description: string;
  price: number;
  createdAt: string;
}

interface CoursesContextType {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  fetchCourses: () => void;
  token: string | null;
}

const CoursesContext = createContext<CoursesContextType | undefined>(undefined);

export const CoursesProvider = ({ children }: { children: ReactNode }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [token, setToken] = useState<string | null>(null);

  
  const fetchCourses = async () => {
    if (!token) return;

    try {
      const response = await fetch("/api/user-courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) throw new Error("Failed to fetch courses");

      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      console.error("Failed to fetch courses.");
    }
  };
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
      if (storedToken) {
        fetchCourses();
      } else {
        console.log(false);
      }
    }
  }, []);

  return (
    <CoursesContext.Provider
      value={{ courses, setCourses, fetchCourses, token }}
    >
      {children}
    </CoursesContext.Provider>
  );
};

export const useCourses = () => {
  const context = useContext(CoursesContext);
  if (!context)
    throw new Error("useCourses must be used within a CoursesProvider");
  return context;
};
