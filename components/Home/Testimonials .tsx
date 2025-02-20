import React from "react";
import Image from "next/image";
import userImg from "../../public/profile-white.png";

interface Review {
  name: string;
  feedback: string;
  image: string;
}

export const Testimonials: React.FC = () => {
  const reviews: Review[] = [
    {
      name: "John Doe",
      feedback:
        "The courses are well-structured and easy to follow. I learned React in no time!",
      image: "/images/user1.jpg",
    },
    {
      name: "Jane Smith",
      feedback:
        "Best platform for learning web development. Highly recommended!",
      image: "/images/user2.jpg",
    },
    {
      name: "Michael Lee",
      feedback: "The hands-on projects helped me a lot. I landed my first job!",
      image: "/images/user3.jpg",
    },
  ];

  return (
    <div className="bg-gray-100 py-16 px-4">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
        What Our Students Say
      </h2>
      <div className="grid gap-6 row-gap-8 md:grid-cols-3 max-w-screen-lg mx-auto">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="p-6 bg-white rounded-lg shadow-md text-center"
          >
            <Image
              src={userImg}
              alt={review.name}
              width={64}
              height={64}
              className="w-16 h-16 mx-auto rounded-full mb-4"
            />
            <p className="text-gray-700">{review.feedback}</p>
            <h4 className="mt-4 font-semibold text-blue-600">{review.name}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};
