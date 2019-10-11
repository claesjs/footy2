import { List, Record } from 'immutable';

const keys = {
  rndseed: undefined,
  homeTeam: undefined,
  awayTeam: undefined,
  matchLog: List()
};

class StateRecord extends Record(keys) {
  log(event) {
    return this.set('matchLog', this.matchLog.push(event));
  }
}

export default StateRecord;
