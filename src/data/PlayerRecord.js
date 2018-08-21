import { List, Record } from 'immutable';

const keys = {
  name: '',
  position: '',
  fouls: 0,
  yellowCards: 0,
  redCards: 0,
  injured: false,
  shots: 0,
  shotsOnTarget: 0,
  goals: 0,
  assists: 0,
  tackles: 0,
  saves: 0,
  goalsAllowed: 0,
  penaltyKicks: 0,
  penaltyKicksScored: 0
};

class PlayerRecord extends Record(keys) {
  isStarPlayer() {
    return this.name.slice(-1) === '*';
  }
};

export default PlayerRecord;
