import Header from "../components/Header";

export default function HomePage() {
  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gradient-to-r from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
        <div className="bg-white shadow-xl rounded-2xl p-10 max-w-3xl text-center">
          <h1 className="text-5xl font-extrabold text-gray-800 mb-6">
            Welcome to the Home Page
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            This is the main landing page of the application. Explore and enjoy a modern, clean UI built with React and TailwindCSS.
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition">
              Get Started
            </button>
            <button className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow hover:bg-gray-300 transition">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
