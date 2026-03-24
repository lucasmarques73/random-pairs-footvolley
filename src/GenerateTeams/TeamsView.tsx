import { formatTeamsForWhatsApp, translateSide, type Team } from "./Domain";

interface TeamsViewProps {
  teams: Team[];
  onBack: () => void;
  onNewDraw: () => void;
  isGeneratingTeams: boolean;
}

export function TeamsView({
  teams,
  onBack,
  onNewDraw,
  isGeneratingTeams,
}: TeamsViewProps) {
  function handleShareOnWhatsApp() {
    const text = formatTeamsForWhatsApp(teams);
    window.location.href = `https://wa.me/?text=${encodeURIComponent(text)}`;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:justify-between sm:items-center">
          <h1 className="text-2xl font-bold text-gray-800">Times Sorteados</h1>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
            <button
              onClick={onBack}
              className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Voltar
            </button>
            <button
              onClick={handleShareOnWhatsApp}
              disabled={isGeneratingTeams}
              className={`inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-all duration-300 ${
                isGeneratingTeams
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#25D366] hover:bg-[#1ebe5d]"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366]`}
            >
              Compartilhar no WhatsApp
            </button>
            <button
              onClick={onNewDraw}
              disabled={isGeneratingTeams}
              className={`inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-all duration-300 ${
                isGeneratingTeams
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
            >
              {isGeneratingTeams ? "Sorteando..." : "Sortear Novamente"}
            </button>
          </div>
        </div>

        <div
          className={`transition-opacity duration-500 ${
            isGeneratingTeams ? "opacity-50" : "opacity-100"
          }`}
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map((team, index) => (
              <div
                key={index}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Time {index + 1} (Nível: {team.teamLevel})
                  </h3>
                  <div className="mt-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-800 font-medium">1</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {team.player1.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Nível: {team.player1.level}
                        </p>
                        <p className="text-sm text-gray-500">
                          Lado: {translateSide(team.player1.side)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-800 font-medium">2</span>
                      </div>
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            team.player2 === null
                              ? "text-gray-400"
                              : "text-gray-900"
                          }`}
                        >
                          {team.player2 === null
                            ? "VAGO"
                            : team.player2.name}
                        </p>
                        {team.player2 !== null && (
                          <p className="text-sm text-gray-500">
                            Nível: {team.player2.level}
                          </p>
                        )}
                        {team.player2 !== null && (
                          <p className="text-sm text-gray-500">
                            Lado: {translateSide(team.player2.side)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
