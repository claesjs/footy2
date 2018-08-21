import { List } from 'immutable';
import * as random from './random.js';

export const checkGoalScored = (teamRating, forwardRating, oppTeamRating) => {
  const rnd = random.get(10000);
  //const goalProb = 3200 + ((teamRating - 1000) / 10 + forwardRating - ((oppTeamRating - 1000) / 10);
  const goalProb = 1500 + teamRating * 0.1 + forwardRating * 8 - oppTeamRating * 0.1;
  return rnd < goalProb;
};

export const checkGoalCancelled = () => {
  const rnd = random.get(10000);
  const goalCancelled = 500;
  return rnd < goalCancelled;
};

export const checkShotOnTarget = teamRating => {
  const rnd = random.get(10000);
  const onTargetProb = 3800 + ((teamRating - 1000) / 10);
  return rnd < onTargetProb;
};

export const checkShotTackled = (forwardRating, midfieldRating, oppDefenceRating) => {
  const rnd = random.get(10000);
  const tackledProb = 2000 * ((oppDefenceRating * 3) / (midfieldRating * 2 + forwardRating));
  return rnd < tackledProb;
};

export const checkChanceAssisted = () => {
  const rnd = random.get(10000);
  const assistProb = 7500;
  return rnd < assistProb;
};

export const checkShotChance = (forwardRating, midfieldRating, oppDefenceRating, minute) => {
  const rnd = random.get(10000);
  const shotProb = Math.pow(((1/3 * forwardRating + 2/3 * midfieldRating) / (oppDefenceRating)), 2) * 1500 * getMinuteMod(minute);
  return rnd < shotProb;
};

export const getMinuteMod = minute => {
  const goalSpread = List.of(1831, 2030, 1099, 2175, 2598, 2536, 2537, 2533, 3532, 3532);
  const average = goalSpread.reduce((accumulator, value) => accumulator + value) / goalSpread.size;
  return parseFloat(goalSpread.get(Math.floor((minute - 1) / 10)) / average);
};
