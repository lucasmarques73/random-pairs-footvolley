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
    .filter(t => t.player2 !== null) // ignora time incompleto
    .map(calculateTeamLevel);

  return Math.max(...levels) - Math.min(...levels);
}

export function createBalancedTeams(players: Player[]): Team[] {
  const sorted = [...players].sort((a, b) => b.level - a.level);
  const teams: RawTeam[] = [];

  let i = 0;
  let j = sorted.length - 1;

  // FASE 1 — high + low
  while (i < j) {
    teams.push({
      player1: sorted[i],
      player2: sorted[j],
    });
    i++;
    j--;
  }

  // Se sobrar 1 jogador (ímpar)
  if (i === j) {
    teams.push({
      player1: sorted[j], // geralmente o mais fraco
      player2: null,
    });
  }

  // FASE 2 — ajustes de lado (somente times completos)
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

        const swapCandidates: Array<[Player, Player]> = [
          [teamA.player1, teamB.player1],
          [teamA.player1, teamB.player2],
          [teamA.player2, teamB.player1],
          [teamA.player2, teamB.player2],
        ];

        for (const [x, y] of swapCandidates) {
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

          const newSpread = levelSpread(simulated);

          if (newSpread <= currentSpread + 1) {
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

  // Finaliza
  return teams.map(team => ({
    ...team,
    teamLevel: calculateTeamLevel(team),
  }));
}