export type PlayerSide = "right" | "left" | "both";

export const translateSide = (side: PlayerSide) => {
  const translations = {
    right: "Direito",
    left: "Esquerdo",
    both: "Ambos",
  };
  return translations[side];
};

export interface Player {
  id: string;
  name: string;
  level: number;
  side: PlayerSide;
}

export interface Team {
  player1: Player;
  player2: Player | null;
  teamLevel: number;
}

type RawTeam = {
  player1: Player;
  player2: Player | null;
};

function isInvalidSide(a: Player, b: Player): boolean {
  return (
    (a.side === 'left' && b.side === 'left') ||
    (a.side === 'right' && b.side === 'right')
  );
}

function calculateTeamLevel(team: RawTeam): number {
  return team.player1.level + (team.player2?.level ?? 0);
}

function levelSpread(teams: RawTeam[]): number {
  const levels = teams
    .filter(t => t.player2 !== null)
    .map(calculateTeamLevel);

  if (levels.length === 0) return 0;

  return Math.max(...levels) - Math.min(...levels);
}

export function createBalancedTeams(players: Player[]): Team[] {
  // ---------- CONFIGURAÇÕES ----------
  const MAX_SPREAD_FOR_SHUFFLE = 1;   // quão justo precisa estar para liberar aleatoriedade
  const MAX_LEVEL_DELTA = 2;          // diferença máxima entre jogadores trocados
  const SHUFFLE_ITERATIONS = 20;      // intensidade da variação
  // ----------------------------------

  // FASE 1 — ordena por nível
  const sorted = [...players].sort((a, b) => b.level - a.level);
  const teams: RawTeam[] = [];

  let i = 0;
  let j = sorted.length - 1;

  // High + Low
  while (i < j) {
    teams.push({
      player1: sorted[i],
      player2: sorted[j],
    });
    i++;
    j--;
  }

  // Número ímpar → sobra um jogador
  if (i === j) {
    teams.push({
      player1: sorted[j],
      player2: null,
    });
  }

  // FASE 2 — correção de lados (regra dura)
  let improved = true;

  while (improved) {
    improved = false;
    const currentSpread = levelSpread(teams);

    for (let a = 0; a < teams.length; a++) {
      const teamA = teams[a];
      if (!teamA.player2) continue;
      if (!isInvalidSide(teamA.player1, teamA.player2)) continue;

      for (let b = 0; b < teams.length; b++) {
        if (a === b) continue;

        const teamB = teams[b];
        if (!teamB.player2) continue;

        const swaps: Array<[Player, Player]> = [
          [teamA.player1, teamB.player1],
          [teamA.player1, teamB.player2],
          [teamA.player2, teamB.player1],
          [teamA.player2, teamB.player2],
        ];

        for (const [x, y] of swaps) {
          const newTeamA: [Player, Player] = [
            x === teamA.player1 ? y : teamA.player1,
            x === teamA.player2 ? y : teamA.player2,
          ];

          const newTeamB: [Player, Player] = [
            y === teamB.player1 ? x : teamB.player1,
            y === teamB.player2 ? x : teamB.player2,
          ];

          if (
            isInvalidSide(newTeamA[0], newTeamA[1]) ||
            isInvalidSide(newTeamB[0], newTeamB[1])
          ) {
            continue;
          }

          const simulated = teams.map((t, idx) => {
            if (idx === a) return { player1: newTeamA[0], player2: newTeamA[1] };
            if (idx === b) return { player1: newTeamB[0], player2: newTeamB[1] };
            return t;
          });

          if (levelSpread(simulated) <= currentSpread + 1) {
            teamA.player1 = newTeamA[0];
            teamA.player2 = newTeamA[1];
            teamB.player1 = newTeamB[0];
            teamB.player2 = newTeamB[1];
            improved = true;
            break;
          }
        }

        if (improved) break;
      }

      if (improved) break;
    }
  }

  // FASE 3 — randomização controlada (se cenário permitir)
  const spreadAfterBalance = levelSpread(teams);

  if (spreadAfterBalance <= MAX_SPREAD_FOR_SHUFFLE) {
    for (let i = 0; i < SHUFFLE_ITERATIONS; i++) {
      const a = Math.floor(Math.random() * teams.length);
      const b = Math.floor(Math.random() * teams.length);
      if (a === b) continue;

      const teamA = teams[a];
      const teamB = teams[b];

      if (!teamA.player2 || !teamB.player2) continue;

      const swaps: Array<[Player, Player]> = [
        [teamA.player1, teamB.player1],
        [teamA.player1, teamB.player2],
        [teamA.player2, teamB.player1],
        [teamA.player2, teamB.player2],
      ];

      const [x, y] = swaps[Math.floor(Math.random() * swaps.length)];

      if (Math.abs(x.level - y.level) > MAX_LEVEL_DELTA) continue;

      const newTeamA: [Player, Player] = [
        x === teamA.player1 ? y : teamA.player1,
        x === teamA.player2 ? y : teamA.player2,
      ];

      const newTeamB: [Player, Player] = [
        y === teamB.player1 ? x : teamB.player1,
        y === teamB.player2 ? x : teamB.player2,
      ];

      if (
        isInvalidSide(newTeamA[0], newTeamA[1]) ||
        isInvalidSide(newTeamB[0], newTeamB[1])
      ) {
        continue;
      }

      teamA.player1 = newTeamA[0];
      teamA.player2 = newTeamA[1];
      teamB.player1 = newTeamB[0];
      teamB.player2 = newTeamB[1];
    }
  }

  // FINALIZA
  return teams.map(team => ({
    ...team,
    teamLevel: calculateTeamLevel(team),
  }));
}