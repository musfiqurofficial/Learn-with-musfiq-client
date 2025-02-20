export const Hero = () => {
    return (
      <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
        <div className="grid gap-5 row-gap-8 lg:grid-cols-2">
          {/* Left Section: Text & Call-to-Action */}
          <div className="flex flex-col justify-center">
            <div className="max-w-xl mb-6">
              <div>
                <p className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-white uppercase rounded-full bg-blue-600">
                  Learn with Musfiq
                </p>
              </div>
              <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none">
                Unlock Your Potential with <br className="hidden md:block" />
                <span className="inline-block text-blue-600">
                  Expert-Led Courses
                </span>
              </h2>
              <p className="text-base text-gray-700 md:text-lg">
                Explore high-quality courses designed to help you master new
                skills in **web development, programming, and more**. Learn at
                your own pace with structured lessons and hands-on projects.
              </p>
            </div>
            <a
              href="/all-courses"
              className="inline-flex items-center font-semibold transition-colors duration-200 text-blue-600 hover:text-blue-800"
            >
              Browse Courses
              <svg
                className="inline-block w-3 ml-2"
                fill="currentColor"
                viewBox="0 0 12 12"
              >
                <path d="M9.707,5.293l-5-5A1,1,0,0,0,3.293,1.707L7.586,6,3.293,10.293a1,1,0,1,0,1.414,1.414l5-5A1,1,0,0,0,9.707,5.293Z" />
              </svg>
            </a>
          </div>
  
          {/* Right Section: Course Statistics */}
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 text-center bg-gray-100 rounded-lg shadow-md">
              <h3 className="text-3xl font-bold text-blue-600">50+</h3>
              <p className="text-gray-600">Courses Available</p>
            </div>
            <div className="p-6 text-center bg-gray-100 rounded-lg shadow-md">
              <h3 className="text-3xl font-bold text-blue-600">10K+</h3>
              <p className="text-gray-600">Enrolled Students</p>
            </div>
            <div className="p-6 text-center bg-gray-100 rounded-lg shadow-md">
              <h3 className="text-3xl font-bold text-blue-600">200+</h3>
              <p className="text-gray-600">Expert Instructors</p>
            </div>
            <div className="p-6 text-center bg-gray-100 rounded-lg shadow-md">
              <h3 className="text-3xl font-bold text-blue-600">95%</h3>
              <p className="text-gray-600">Positive Reviews</p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  