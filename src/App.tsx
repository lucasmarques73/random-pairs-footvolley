import { Routes, Route, Link, useLocation } from "react-router-dom";
import { GenerateTeams } from "./GenerateTeams/GenerateTeams";

function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-900">
                Gymora Campeonatos
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Bem-vindo ao Gymora Campeonatos
          </h1>
          <div className="space-x-4">
            <Link
              to="/teams"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Criar Times
            </Link>
            <Link
              to="/Campeonatos"
              className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Criar Campeonato
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {!isHome && (
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="text-xl font-bold text-gray-900">
                  Gymora Campeonatos
                </Link>
              </div>
            </div>
          </div>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/teams" element={<GenerateTeams />} />
        <Route
          path="/Campeonatos"
          element={<div className="p-8">Página de Campeonato (em breve)</div>}
        />
      </Routes>
    </div>
  );
}
