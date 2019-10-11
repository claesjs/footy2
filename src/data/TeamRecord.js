import { List, Record } from 'immutable';
import PlayerRecord from './PlayerRecord';
import * as rating from '../ratings.js';
import * as random from '../random.js';

const keys = {
  name: 'noname',
  short: 'non',
  rating: 1000,
  totalRating: 1000,
  formation: undefined,
  tactic: 'N',
  oppTactic: 'N',
  players: List(),
  defenceRating: 0,
  midfieldRating: 0,
  forwardRating: 0,
  goals: 0,
  shots: 0,
  shotsOnTarget: 0,
  saves: 0,
  tackles: 0,
  fouls: 0,
  yellowCards: 0,
  redCards: 0,
  penalties: 0,
  penaltiesScored: 0
};

const getActivePlayers = (players, pos) => players.filter(p => p.redCards === 0 && p.position === pos).map(p => p.name);
const getActiveStarPlayers = players => players.filter(p => p.redCards === 0 && p.isStarPlayer()).map(p => p.name);
const getPlayerIndex = (players, playerName) => players.findIndex(p => p.name === playerName);
const calculateFormation = players => `${players.filter(p => p.position === 'DF').size}-${players.filter(p => p.position === 'MF').size}-${players.filter(p => p.position === 'FW').size}`;

const createPlayerList = (gk, df, mf, fw) => {
  return List.of(new PlayerRecord({ name: gk, position: 'GK' }))
    .concat(List(df.map(p => new PlayerRecord({ name: p, position: 'DF' }))))
    .concat(List(mf.map(p => new PlayerRecord({ name: p, position: 'MF' }))))
    .concat(List(fw.map(p => new PlayerRecord({ name: p, position: 'FW' }))));
};

class TeamRecord extends Record(keys) {
  constructor(data) {
    super(data);

    const players = createPlayerList(data.goalkeeper, data.defenders, data.midfielders, data.forwards);

    const ratings = rating.calculateRatings(
      data.rating,
      players,
      data.tactic,
      data.oppTactic);

    return this.merge({
      totalRating: data.rating,
      players: players,
      formation: calculateFormation(players),
      defenceRating: ratings.defenceRating,
      midfieldRating: ratings.midfieldRating,
      forwardRating: ratings.forwardRating
    });
  }

  addGoal(playerName) {
    return this.merge({
      goals: this.goals + 1,
      players: this.players.update(getPlayerIndex(this.players, playerName), p => p.set('goals', p.goals + 1))
    });
  }

  addGoalAllowed(playerName) {
    return this.set('players', this.players.update(getPlayerIndex(this.players, playerName), p => p.set('goalsAllowed', p.goalsAllowed + 1)))
  }

  addAssist(playerName) {
    if (playerName) {
      return this.merge({
        players: this.players.update(getPlayerIndex(this.players, playerName), p => p.set('assists', p.assists + 1))
      });
    } else {
      return this;
    }
  }

  addShot(playerName) {
    return this.merge({
      shots: this.shots + 1,
      players: this.players.update(getPlayerIndex(this.players, playerName), p => p.set('shots', p.shots + 1))
    });
  }

  addShotOnTarget(playerName) {
    return this.merge({
      shotsOnTarget: this.shotsOnTarget + 1,
      players: this.players.update(getPlayerIndex(this.players, playerName), p => p.set('shotsOnTarget', p.shotsOnTarget + 1))
    });
  }

  addTackle(playerName) {
    return this.merge({
      tackles: this.tackles + 1,
      players: this.players.update(getPlayerIndex(this.players, playerName), p => p.set('tackles', p.tackles + 1))
    });
  }

  addSave(playerName) {
    return this.merge({
      saves: this.saves + 1,
      players: this.players.update(getPlayerIndex(this.players, playerName), p => p.set('saves', p.saves + 1))
    });
  }

  addFoul(playerName) {
    return this.merge({
      fouls: this.fouls + 1,
      players: this.players.update(getPlayerIndex(this.players, playerName), p => p.set('fouls', p.fouls + 1))
    });
  }

  addYellowCard(playerName) {
    return this.merge({
      yellowCards: this.yellowCards + 1,
      players: this.players.update(getPlayerIndex(this.players, playerName), p => p.set('yellowCards', p.yellowCards + 1))
    });
  }

  addRedCard(playerName) {
    const newTotalRating = this.totalRating - this.rating * 0.1;
    const newPlayers = this.players.update(getPlayerIndex(this.players, playerName), p => p.set('redCards', p.redCards + 1));
    const ratings = rating.calculateRatings(newTotalRating, newPlayers, this.tactic, this.oppTactic);

    return this.merge({
      redCards: this.redCards + 1,
      players: newPlayers,
      totalRating: newTotalRating,
      defenceRating: ratings.defenceRating,
      midfieldRating: ratings.midfieldRating,
      forwardRating: ratings.forwardRating
    });
  }

  addPenaltyScored(playerName) {
    return this.merge({
      penalties: this.penalties + 1,
      penaltiesScored: this.penaltiesScored + 1,
      players: this.players.update(getPlayerIndex(this.players, playerName), p => p.set('penaltyKicksScored', p.penaltyKicksScored + 1).set('penaltyKicks', p.penaltyKicks + 1))
    });
  }

  addPenaltyMissed() {
    return this.set('penalties', this.penalties + 1);
  }

  whoShot() {
    const d = getActivePlayers(this.players, 'DF');
    const m = getActivePlayers(this.players, 'MF');
    const f = getActivePlayers(this.players, 'FW');
    const stars = getActiveStarPlayers(this.players);
    const players = d.concat(m).concat(m).concat(f).concat(f).concat(f).concat(stars);
    const index = random.getInt(players.size - 1);
    return players.get(index);
  }

  whoTackled() {
    const d = getActivePlayers(this.players, 'DF');
    const m = getActivePlayers(this.players, 'MF');
    const f = getActivePlayers(this.players, 'FW');
    const stars = getActiveStarPlayers(this.players);
    const players = d.concat(d).concat(d).concat(m).concat(m).concat(f).concat(stars);
    const index = random.getInt(players.size - 1);
    return players.get(index);
  }

  whoFouled() {
    const d = getActivePlayers(this.players, 'DF');
    const m = getActivePlayers(this.players, 'MF');
    const f = getActivePlayers(this.players, 'FW');
    const players = d.concat(m).concat(f);
    const index = random.getInt(players.size - 1);
    return players.get(index);
  }

  whoAssisted(whoShot) {
    const d = getActivePlayers(this.players, 'DF');
    const m = getActivePlayers(this.players, 'MF');
    const f = getActivePlayers(this.players, 'FW');
    const stars = getActiveStarPlayers(this.players);
    const players = d.concat(m).concat(m).concat(f).concat(stars).filter(p => p !== whoShot);
    const index = random.getInt(players.size - 1);
    return players.get(index);
  }

  goalkeeper() {
    return this.players.filter(p => p.position === 'GK').get(0).name;
  }

  penaltyKicker() {
    const stars = getActiveStarPlayers(this.players);
    if (stars.size > 0) {
      const index = random.getInt(stars.size - 1);
      return stars.get(index);
    } else {
      const d = getActivePlayers(this.players, 'DF');
      const m = getActivePlayers(this.players, 'MF');
      const f = getActivePlayers(this.players, 'FW');
      const players = d.concat(m).concat(f);
      const index = random.getInt(players.size - 1);
      return players.get(index);
    }
  }

  hasYellowCard(playerName) {
    return this.players.get(getPlayerIndex(this.players, playerName)).yellowCards > 0;
  }
}

export default TeamRecord;
