import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-900">
              Sorteia Duplas
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
