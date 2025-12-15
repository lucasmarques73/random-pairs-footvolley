import { useEffect, useState } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { TeamsView } from "./TeamsView";

export interface Player {
  id: string;
  name: string;
  level: number;
}

interface Team {
  player1: Player;
  player2: Player;
  teamLevel: number;
}

function App() {
  const [players, setPlayers] = useState<Player[]>(() => {
    const savedPlayers = localStorage.getItem("footvolleyPlayers");
    try {
      return savedPlayers ? JSON.parse(savedPlayers) : [];
    } catch (error) {
      console.error("Erro ao carregar jogadores:", error);
      return [];
    }
  });
  const [teams, setTeams] = useState<Team[]>([]);
  const [showTeams, setShowTeams] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isGeneratingTeams, setIsGeneratingTeams] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Salvar jogadores no localStorage sempre que a lista for alterada
  useEffect(() => {
    localStorage.setItem("footvolleyPlayers", JSON.stringify(players));
  }, [players]);

  const [formData, setFormData] = useState<Omit<Player, "id">>({
    name: "",
    level: 1,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "level"
          ? Math.min(10, Math.max(1, parseInt(value) || 1))
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingPlayer) {
      // Update existing player
      setPlayers(
        players.map((p) =>
          p.id === editingPlayer.id ? { ...formData, id: editingPlayer.id } : p
        )
      );
    } else {
      // Add new player
      const newPlayer: Player = {
        ...formData,
        id: Date.now().toString(),
      };
      setPlayers([...players, newPlayer]);
    }

    // Reset form and close modal
    setFormData({ name: "", level: 1 });
    setEditingPlayer(null);
    setIsModalOpen(false);
  };

  const handleEdit = (player: Player) => {
    setFormData({
      name: player.name,
      level: player.level,
    });
    setEditingPlayer(player);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este jogador?")) {
      setPlayers(players.filter((player) => player.id !== id));
    }
  };

  const clearPlayers = () => {
    if (window.confirm("Tem certeza que deseja limpar todos os jogadores?")) {
      setPlayers([]);
    }
  };

  const openNewPlayerModal = () => {
    setFormData({ name: "", level: 1 });
    setEditingPlayer(null);
    setIsModalOpen(true);
  };

  const generateTeams = () => {
    if (players.length < 2) {
      alert("É necessário pelo menos 2 jogadores para formar duplas");
      return;
    }
    // Ativa o estado de carregamento
    setIsGeneratingTeams(true);
    // Adiciona um pequeno atraso para o efeito visual
    setTimeout(() => {
      // Cria uma cópia e embaralha os jogadores
      const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
      const newTeams: Team[] = [];

      // Ordena por nível após o embaralho para garantir combinações diferentes
      const sortedPlayers = [...shuffledPlayers].sort(
        (a, b) => a.level - b.level
      );

      // Restante da lógica de formação de times (mantenha sua lógica existente)
      const hasOddPlayers = sortedPlayers.length % 2 !== 0;
      const lastPlayer = hasOddPlayers ? sortedPlayers.pop() : null;
      while (sortedPlayers.length > 0) {
        const player1 = sortedPlayers.shift()!;
        const player2 = sortedPlayers.pop()!;
        newTeams.push({
          player1,
          player2,
          teamLevel: player1.level + player2.level,
        });
      }
      if (lastPlayer) {
        if (newTeams.length > 0) {
          const bestTeamIndex = newTeams.reduce(
            (bestIndex, team, index, array) => {
              const currentDiff = Math.abs(team.teamLevel - lastPlayer.level);
              const bestDiff = Math.abs(
                array[bestIndex].teamLevel - lastPlayer.level
              );
              return currentDiff < bestDiff ? index : bestIndex;
            },
            0
          );
          const bestTeam = newTeams[bestTeamIndex];
          bestTeam.player2 = lastPlayer;
          bestTeam.teamLevel = bestTeam.player1.level + bestTeam.player2.level;
        } else {
          newTeams.push({
            player1: lastPlayer,
            player2: lastPlayer,
            teamLevel: lastPlayer.level * 2,
          });
        }
      }
      setTeams(newTeams);
      setShowTeams(true);
      setIsGeneratingTeams(false);
    }, 800); // Tempo para a animação de carregamento
  };

  const handleNewDraw = () => {
    generateTeams();
  };

  if (showTeams) {
    return (
      <TeamsView
        teams={teams}
        onBack={() => setShowTeams(false)}
        onNewDraw={handleNewDraw}
        isGeneratingTeams={isGeneratingTeams}
      />
    );
  }

  return (
    <div
      className={`min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 ${
        isModalOpen ? "opacity-100" : ""
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800 whitespace-nowrap">
            Lista de Jogadores
          </h1>
          <div className="w-full sm:w-auto grid grid-cols-2 sm:flex sm:space-x-2 gap-2">
            <button
              onClick={clearPlayers}
              disabled={players.length === 0}
              className={`inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                players.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
            >
              <TrashIcon className="h-5 w-5 sm:mr-2" />
              <span className="sm:inline">Limpar</span>
            </button>
            <button
              onClick={() => {
                setIsAnimating(true);
                generateTeams();
                setTimeout(() => setIsAnimating(false), 1000);
              }}
              disabled={players.length < 2 || isGeneratingTeams}
              className={`inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-all duration-300 ${
                players.length < 2 || isGeneratingTeams
                  ? "bg-gray-400 cursor-not-allowed"
                  : `${
                      isAnimating
                        ? "scale-95 opacity-75"
                        : "scale-100 opacity-100"
                    } bg-green-600 hover:bg-green-700`
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
            >
              {isGeneratingTeams ? (
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <UsersIcon className="h-5 w-5 sm:mr-2" />
              )}
              <span className="sm:inline">
                {isGeneratingTeams ? "Sorteando..." : "Sortear"}
              </span>
            </button>
            <button
              onClick={openNewPlayerModal}
              className="col-span-2 sm:col-auto inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="h-5 w-5 sm:mr-2" />
              <span className="sm:inline">Adicionar Jogador</span>
            </button>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {players.length === 0 ? (
              <li className="px-6 py-4 text-center text-gray-500">
                Nenhum jogador cadastrado ainda.
              </li>
            ) : (
              players
                .sort((a, b) => b.level - a.level)
                .map((player) => (
                  <li key={player.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {player.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Nível: {player.level}/10
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex space-x-2">
                        <button
                          onClick={() => handleEdit(player)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Editar"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(player.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Excluir"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))
            )}
          </ul>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500/30 bg-opacity-30 backdrop-blur-sm transition-opacity"
              aria-hidden="true"
              onClick={() => setIsModalOpen(false)}
            ></div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div
              className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  {editingPlayer ? "Editar Jogador" : "Adicionar Novo Jogador"}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nome do Jogador
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Digite o nome do jogador"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="level"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nível do Jogador (1-10)
                    </label>
                    <input
                      type="number"
                      id="level"
                      name="level"
                      min="1"
                      max="10"
                      value={formData.level}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                    >
                      {editingPlayer ? "Salvar" : "Adicionar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
