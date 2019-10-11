import fs from 'fs';
import { tactics } from './ratings.js';
import TeamRecord from './data/TeamRecord.js';

export const readTeamSheet = teamSheetName => {
  let sheetJson = undefined;
  let teamJson = undefined;

  try {
    sheetJson = JSON.parse(fs.readFileSync(`./input/${teamSheetName}`));
    teamJson = JSON.parse(fs.readFileSync(`./input/${sheetJson.team.toLowerCase()}.json`));
  } catch (e) {
    console.error('\x1b[31m%s\x1b[0m', `\nError reading file:\n${e.message}\n`);
  }

  return {
    checkResult: checkTeamSheet(sheetJson),
    sheetJson,
    teamJson
  }
};

export const createTeam = (sheetJson, teamJson, oppTactic) => {
  return new TeamRecord({
    name: teamJson.name,
    short: sheetJson.team,
    tactic: sheetJson.tactic,
    rating: teamJson.rating,
    oppTactic: oppTactic,
    goalkeeper: sheetJson.goalkeeper,
    defenders: sheetJson.defenders,
    midfielders: sheetJson.midfielders,
    forwards: sheetJson.forwards
  });
};

export const updateTeamFile = (team, oppTeam, newRating) => {
  let json;

  try {
    json = JSON.parse(fs.readFileSync(`./input/${team.short.toLowerCase()}.json`));
  } catch (e) {
    console.error('\x1b[31m%s\x1b[0m', `\nError reading file:\n${e.message}\n`);
  }

  json.rating = newRating;

  const isWin = team.goals > oppTeam.goals;
  const isDraw = team.goals === oppTeam.goals;

  const stats = json.stats ? json.stats : getNewStats();
  stats.matches = stats.matches + 1;
  stats.wins = isWin ? stats.wins + 1 : stats.wins;
  stats.draws = isDraw ? stats.draws + 1 : stats.draws;
  stats.losses = !isWin && !isDraw ? stats.losses + 1 : stats.losses;
  stats.goals = stats.goals + team.goals;
  stats.goalsAgainst = stats.goalsAgainst + oppTeam.goals;
  stats.shots = stats.shots + team.shots;
  stats.shotsAgainst = stats.shotsAgainst + oppTeam.shots;
  stats.shotsOnTarget = stats.shotsOnTarget + team.shotsOnTarget;
  stats.saves = stats.saves + team.saves;
  stats.tackles = stats.tackles + team.tackles;
  stats.fouls = stats.fouls + team.fouls;
  stats.yellowCards = stats.yellowCards + team.yellowCards;
  stats.redCards = stats.redCards + team.redCards;
  stats.penalties = stats.penalties + team.penalties;
  stats.penaltiesScored = stats.penaltiesScored + team.penaltiesScored;
  stats.penaltiesAgainst = stats.penaltiesAgainst + oppTeam.penalties;

  json.stats = stats;

  const players = json.players ? json.players : [];
  const updatedPlayers = [];

  team.players.forEach(p => {
    let isPlayerInTeam = false;

    players.forEach(teamP => {
      if (p.name === teamP.name) {
        updatedPlayers.push(updatePlayer(p, teamP));
        isPlayerInTeam = true;
      }
    })

    if (!isPlayerInTeam) {
      updatedPlayers.push(updatePlayer(p, undefined));
    }
  });

  json.players = updatedPlayers;

  fs.writeFileSync(`./input/${team.short.toLowerCase()}.json`, JSON.stringify(json, null, 2), e => {
    if (e) {
      console.error('\x1b[31m%s\x1b[0m', `\nError writing file:\n${e.message}\n`);
    } else {
      console.log(`File ${team.short.toLowerCase()}.json updated`);
    }
  });
};

const updatePlayer = (p, teamP) => {
  return {
    name: teamP ? teamP.name : p.name,
    matches: teamP ? teamP.matches + 1 : 1,
    fouls: teamP ? teamP.fouls + p.fouls : p.fouls,
    yellowCards: teamP ? teamP.yellowCards + p.yellowCards : p.yellowCards,
    redCards: teamP ? teamP.redCards + p.redCards : p.redCards,
    injured: false,
    shots: teamP ? teamP.shots + p.shots : p.shots,
    shotsOnTarget: teamP ? teamP.shotsOnTarget + p.shotsOnTarget : p.shotsOnTarget,
    goals: teamP ? teamP.goals + p.goals : p.goals,
    assists: teamP ? teamP.assists + p.assists : p.assists,
    tackles: teamP ? teamP.tackles + p.tackles : p.tackles,
    saves: teamP ? teamP.saves + p.saves : p.saves,
    goalsAllowed: teamP ? teamP.goalsAllowed + p.goalsAllowed : p.goalsAllowed,
    penaltyKicks: teamP ? teamP.penaltyKicks + p.penaltyKicks : p.penaltyKicks,
    penaltyKicksScored: teamP ? teamP.penaltyKicksScored + p.penaltyKicksScored : p.penaltyKicksScored,
  };
};

const getNewStats = () => {
  return {
    matches: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goals: 0,
    goalsAgainst: 0,
    shots: 0,
    shotsAgainst: 0,
    shotsOnTarget: 0,
    saves: 0,
    tackles: 0,
    fouls: 0,
    yellowCards: 0,
    redCards: 0,
    penalties: 0,
    penaltiesScored: 0,
    penaltiesAgainst: 0
  };
};

const checkTeamSheet = json => {
  const team = json.team && typeof json.team === 'string';
  const tactic = json.tactic && typeof json.tactic === 'string' && tactics[json.tactic] !== undefined;
  const goalkeeper = json.goalkeeper && typeof json.goalkeeper === 'string';
  const defenders = json.defenders && Array.isArray(json.defenders) && json.defenders.length > 0;
  const midfielders = json.midfielders && Array.isArray(json.midfielders) && json.midfielders.length > 0;
  const forwards = json.forwards && Array.isArray(json.forwards) && json.forwards.length > 0;
  const noOfPlayers = goalkeeper && defenders && midfielders && forwards
    ? json.defenders.length + json.midfielders.length + json.forwards.length + 1 === 11 : false;

  return {
    team,
    tactic,
    goalkeeper,
    defenders,
    midfielders,
    forwards,
    noOfPlayers,
    valid: team && tactic && goalkeeper && defenders && midfielders && forwards && noOfPlayers
  };
};
