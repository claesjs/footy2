import * as random from './random.js';

const indent = '        ';
const line = '-------------------------';

export const halfTitle = isFirstHalf => `\n${line} ${isFirstHalf ? 'FIRST' : 'SECOND'} HALF ${line}`;
export const stoppageTime = mins => `\n${mins} minute(s) of stoppage time`;
export const foul = (min, playerName, teamName) => `Min ${min}: ${fouls[random.getInt(4)].replace('%', `${playerName} (${teamName})`)} ...`;
export const redCard = () => `${indent}... ${redCards[random.getInt(2)]}`;
export const yellowCard = () => `${indent}... ${yellowCards[random.getInt(2)]}`;
export const secondYellowCard = () => `${indent}... ${secondYellowCards[random.getInt(2)]}`;
export const penalty = () => `${indent}... PENALTY!`;
export const penaltyKicker = playerName => `${indent}... ${penalties[random.getInt(2)].replace('%', playerName)} ...`;
export const goal = (homeGoals, awayGoals) => `${indent}... GOAL! (${homeGoals} - ${awayGoals})`;
export const missedPenalty = () => `${indent}... He misses the goal!`;
export const savedPenalty = playerName => `${indent}... Saved by ${playerName}!`;
export const chanceTackled = playerName => `${indent}... ${tackles[random.getInt(9)].replace('%', playerName)}`;
export const disallowedGoal = () => `${indent}... GOAL!\n${indent}... ${disallowedGoals[random.getInt(2)]}`;
export const save = playerName => `${indent}... ${saves[random.getInt(9)].replace('%', playerName)}`;
export const shot = playerName => `${indent}... ${shots[random.getInt(9)].replace('%', playerName)}`;
export const shotOffTarget = () => `${indent}... ${offTargetShots[random.getInt(9)]}`;
export const chance = (min, playerName, teamName) => `Min ${min}: ${chances[random.getInt(11)].replace('%', `${playerName} (${teamName})`)} ...`;
export const assistedChance = (min, assister, playerName, teamName) => `Min ${min}: ${assistedChances[random.getInt(9)].replace('%1', `${assister} (${teamName})`).replace('%2', playerName)} ...`;

const chances = {
  0: '% with the dribble',
  1: '% takes possession',
  2: '% cuts through the defense',
  3: '% finds a hole in the defense',
  4: '% takes advantage of a defensive mistake',
  5: '% finds a way through',
  6: '% sidesteps his marker',
  7: '% with a flashy move',
  8: '% beats his marker',
  9: '% with a real burst of pace',
  10: '% bursts forward',
  11: '% in a good position'
};

const assistedChances = {
  0: '%1 passes the ball to %2',
  1: '%1 with a smart pass to %2',
  2: '%1 finds %2 in the box',
  3: '%1 with a precise pass to %2',
  4: '%1 heads the ball down to %2',
  5: '%1 slides the ball across to %2',
  6: '%1 cuts the ball back to %2',
  7: '%1 with the heel pass to %2',
  8: '%1 plays a long ball to %2',
  9: '%1 with a glorious long pass to %2'
};

const tackles = {
  0: 'Cleared by %',
  1: 'Blocked by %',
  2: ' % wins the ball with a clear tackle',
  3: 'Intercepted by %',
  4: '% gets in the way and wins the ball',
  5: 'But % clears the danger',
  6: 'But % clears the ball to safety',
  7: 'But % wins the ball with a sliding challenge',
  8: 'But % wins the tackle',
  9: 'But % reads the situation well and wins the ball'
};

const saves = {
  0: 'Saved by %',
  1: '% gathers it comfortably',
  2: '% makes a comfortable save',
  3: 'But % makes a fine save',
  4: '% makes a good save',
  5: '% parries it',
  6: '% makes a difficult save',
  7: 'But % with the difficult save',
  8: 'But % reaches the ball, good save',
  9: 'But % punches it away'
};

const shots = {
  0: 'A powerful shot by %!',
  1: '% tries to beat the keeper!',
  2: '% with the strike!',
  3: '% shoots towards goal!',
  4: '% tries to chip the ball over the keeper!',
  5: '% with the shot!',
  6: '% chases it through, he must score!',
  7: '% is one of one with the keeper, he shoots!',
  8: '% goes for goal!',
  9: 'A vicious shot by %!'
};

const offTargetShots = {
  0: 'But it goes wide',
  1: 'But it goes wide of the post',
  2: 'Over the bar',
  3: 'It goes wide for a goal kick',
  4: 'But it clips the post and goes wide',
  5: 'But it whistles just past the post',
  6: 'But it goes just over',
  7: 'But he puts it wide',
  8: 'But he puts it into the crowd',
  9: 'Wide of goal'
};

const disallowedGoals = {
  0: 'But it\'s been disallowed, the linesman raised his flag',
  1: 'But it\'s been disallowed, the referee spotted something',
  2: 'But it\s been disallowed, the linesman flags for offside'
};

const fouls = {
  0: '% with the foul',
  1: '% with a nasty foul',
  2: '% fouls badly',
  3: '% with a bad challenge',
  4: '% with an ugly foul'
};

const yellowCards = {
  0: 'He gets a yellow card',
  1: 'Shown a yellow card',
  2: 'He is booked for that one'
};

const secondYellowCards = {
  0: 'It\'s his second! Sent off!',
  1: 'His 2nd yellow this game! Sent off!',
  2: 'His 2nd yellow this game! Sent off!'
};

const redCards = {
  0: 'The ref sends him off the pitch!',
  1: 'It\'s a red card, end of the game for him!',
  2: 'Shown a red card!'
};

const penalties = {
  0: '% will take it',
  1: '% takes it',
  2: '% with the spot kick'
};
