import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600">MyApp</div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6">
          <a href="/" className="text-gray-700 hover:text-blue-600 transition">Home</a>
          <a href="/about" className="text-gray-700 hover:text-blue-600 transition">About</a>
          <a href="/contact" className="text-gray-700 hover:text-blue-600 transition">Contact</a>
        </nav>

        {/* Action buttons */}
        <div className="hidden md:flex space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Login
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition">
            Sign Up
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
            {isOpen ? (
              <span className="text-2xl">&#10005;</span> // X icon
            ) : (
              <span className="text-2xl">&#9776;</span> // Hamburger
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <nav className="flex flex-col space-y-2 px-4 py-4">
            <a href="/" className="text-gray-700 hover:text-blue-600 transition">Home</a>
            <a href="/about" className="text-gray-700 hover:text-blue-600 transition">About</a>
            <a href="/contact" className="text-gray-700 hover:text-blue-600 transition">Contact</a>
            <div className="flex flex-col mt-2 space-y-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                Login
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition">
                Sign Up
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
