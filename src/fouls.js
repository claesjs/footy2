import * as random from './random.js';

export const checkPenalty = () => {
  const rnd = random.get(10000);
  const penaltyProb = 130;
  return rnd < penaltyProb;
};

export const checkPenaltyKickScored = (teamRating, oppTeamRating) => {
  const rnd = random.get(10000);
  const penaltyScoreProb = 7500 + ((teamRating - 1000) / 10) - ((oppTeamRating - 1000) / 10);
  return rnd < penaltyScoreProb;
};

export const checkPenaltyKickSaved = () => {
  const rnd = random.get(10000);
  const penaltyKickSavedProb = 7500;
  return rnd < penaltyKickSavedProb;
};

export const checkFoul = (teamRating, oppTeamRating) => {
  const rnd = random.get(10000);
  const foulProb = 2500 + ((teamRating - 1000) / 100) - ((oppTeamRating - 1000) / 100);
  return rnd < foulProb;
};

export const checkWarned = () => {
  const rnd = random.get(10000);
  const warningProb = 1250;
  return rnd < warningProb;
};

export const checkSentOff = () => {
  const rnd = random.get(10000);
  const sentOffProb = 50;
  return rnd < sentOffProb;
};
