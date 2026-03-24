import { Routes, Route, Link } from "react-router-dom";
import { GenerateTeams } from "./GenerateTeams/GenerateTeams";
import { GenerateChampionship } from "./GenerateChampionship/GenerateChampionship";
import { Layout } from "./Layout";

function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Bem-vindo ao Sorteia Duplas
          </h1>
          <div className="space-x-4">
            <Link
              to="/teams"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Criar Times
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/teams" element={<GenerateTeams />} />
          <Route path="/championships" element={<GenerateChampionship />} />
        </Route>
      </Routes>
    </div>
  );
}
