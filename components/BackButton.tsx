import { useRouter } from "next/navigation";
import { IoIosArrowRoundBack } from "react-icons/io";

const BackButton = () => {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return (
    <button
      onClick={handleBackClick}
      className="flex justify-center items-center gap-1 bg-gray-200 px-2 py-1 rounded-full text-[12px] transform transition-transform duration-300 font-semibold text-[#555] hover:scale-105 leading-none mb-2"
    >
      <IoIosArrowRoundBack className="w-4 h-4" /> Go Back
    </button>
  );
};

export default BackButton;
