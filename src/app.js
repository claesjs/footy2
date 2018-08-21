import minimist from 'minimist';
import TeamRecord from './data/TeamRecord';
import StateRecord from './data/StateRecord';
import * as random from './random.js';
import * as event from './events.js';
import * as foul from './fouls.js';
import * as attack from './attacks.js';
import * as rating from './ratings.js';
import * as team from './teams.js';

let state = new StateRecord();

export const startApp = () => {
  const args = minimist(process.argv.slice(2));

  if (args.s) {
    sim(args.s);
    process.exit();
  }

  if (args.h && args.a) {
    const homeData = team.readTeamSheet(args.h);
    const awayData = team.readTeamSheet(args.a);

    if (homeData.checkResult.valid && awayData.checkResult.valid) {
      const homeTeam = team.createTeam(homeData.sheetJson, homeData.teamJson, awayData.sheetJson.tactic);
      const awayTeam = team.createTeam(awayData.sheetJson, awayData.teamJson, homeData.sheetJson.tactic);

      playMatch(homeTeam, awayTeam, args.b);
      logMatch();
    } else {
      if (!homeData.checkResult.valid) {
        console.error('\x1b[31m%s\x1b[0m', `\nHome team sheet invalid:\n${JSON.stringify(awayData.checkResult)}`);
      }

      if (!awayData.checkResult.valid) {
        console.error('\x1b[31m%s\x1b[0m', `\nAway team sheet invalid:\n${JSON.stringify(awayData.checkResult)}`);
      }
    }
  } else {
    console.error('\x1b[31m%s\x1b[0m', '\nNo team sheets entered. Use -h for home team and -a for away team.\n');
    process.exit(9);
  }
};

const sim = matches => {
  console.log(`Running ${matches} matches...`);

  const tactics = ['N', 'D', 'A', 'C', 'L', 'P'];

  let hWins = 0;
  let aWins = 0;
  let draws = 0;
  let goals = 0;
  let shots = 0;
  let shotsOnTarget = 0;
  let tackles = 0;
  let saves = 0;
  let fouls = 0;
  let yCards = 0;
  let rCards = 0;
  let penalties = 0;

  for (let i = 0; i < matches; i++) {
    const hTactic = tactics[random.getInt(tactics.length - 1)];
    const aTactic = tactics[random.getInt(tactics.length - 1)];

    const homeTeam = new TeamRecord({
      name: 'JON', rating: 800 + random.get(400), tactic: hTactic, oppTactic: aTactic,
      goalkeeper: 'Cajtoft',
      defenders: ['Siwe', 'Karlsson', 'Jallow'],
      midfielders: ['Gwargis', 'Fendrich', 'Svensson', 'Crona', 'Al-Ammari'],
      forwards: ['Thelin*', 'Vihjalmsson']
    });
    const awayTeam = new TeamRecord({
      name: 'HEL', rating: 800 + random.get(400), tactic: aTactic, oppTactic: hTactic,
      goalkeeper: 'Hansson',
      defenders: ['Granqvist*', 'Eriksson', 'Johansson'],
      midfielders: ['Persson', 'Landgren', 'Bojanic', 'Zahui', 'Liverstam'],
      forwards: ['Jönsson', 'Dahlberg']
    });

    playMatch(homeTeam, awayTeam, 400);

    if (state.homeTeam.goals > state.awayTeam.goals) {
      hWins = hWins + 1;
    } else if (state.awayTeam.goals > state.homeTeam.goals) {
      aWins = aWins + 1;
    } else {
      draws = draws + 1;
    }

    goals = goals + state.homeTeam.goals + state.awayTeam.goals;
    shots = shots + state.homeTeam.shots + state.awayTeam.shots;
    shotsOnTarget = shotsOnTarget + state.homeTeam.shotsOnTarget + state.awayTeam.shotsOnTarget;
    saves = saves + state.homeTeam.saves + state.awayTeam.saves;
    tackles = tackles + state.homeTeam.tackles + state.awayTeam.tackles;
    fouls = fouls + state.homeTeam.fouls + state.awayTeam.fouls;
    yCards = yCards + state.homeTeam.yellowCards + state.awayTeam.yellowCards;
    rCards = rCards + state.homeTeam.redCards + state.awayTeam.redCards;
    penalties = penalties + state.homeTeam.penalties + state.awayTeam.penalties;

    state = new StateRecord();
  }

  console.log(hWins/matches, draws/matches, aWins/matches);
  console.log('goals ', goals/matches);
  console.log('shots ', shots/matches);
  console.log('shotsT', shotsOnTarget/matches);
  console.log('saves ', saves/matches);
  console.log('tackles ', tackles/matches);
  console.log('fouls ', fouls/matches);
  console.log('yellow', yCards/matches);
  console.log('red   ', rCards/matches);
  console.log('pen   ', penalties/matches);
};

const playMatch = (homeTeam, awayTeam, homeFieldBonus) => {
  updateState(state.merge({
    rndseed: random.getSeed(),
    homeTeam: homeTeam,
    awayTeam: awayTeam
  }));

  playHalf(true, homeFieldBonus);
  playHalf(false, homeFieldBonus);
};

const logMatch = () => {
  console.log(state.rndseed);

  state.matchLog.forEach(e => console.log(e));

  console.log('\nSTATISTICS');
  console.log(state.homeTeam.name + ' - ' + state.awayTeam.name);
  console.log('Result    ' + state.homeTeam.goals + ' - ' + state.awayTeam.goals);
  console.log('Shots     ' + state.homeTeam.shots + ' - ' + state.awayTeam.shots);
  console.log('On target ' + state.homeTeam.shotsOnTarget + ' - ' + state.awayTeam.shotsOnTarget);
  console.log('Penalties ' + state.homeTeam.penalties + ' - ' + state.awayTeam.penalties);
  console.log('P. scored ' + state.homeTeam.penaltiesScored + ' - ' + state.awayTeam.penaltiesScored);
  console.log('Saves     ' + state.homeTeam.saves + ' - ' + state.awayTeam.saves);
  console.log('Tackles   ' + state.homeTeam.tackles + ' - ' + state.awayTeam.tackles);
  console.log('Fouls     ' + state.homeTeam.fouls + ' - ' + state.awayTeam.fouls);
  console.log('Yellow    ' + state.homeTeam.yellowCards + ' - ' + state.awayTeam.yellowCards);
  console.log('Red       ' + state.homeTeam.redCards + ' - ' + state.awayTeam.redCards);
  console.log(state.homeTeam.defenceRating, state.homeTeam.midfieldRating, state.homeTeam.forwardRating);
  console.log(state.awayTeam.defenceRating, state.awayTeam.midfieldRating, state.awayTeam.forwardRating);

  const homeNewTR = rating.calculateNewTeamRating(
    state.homeTeam.rating,
    state.awayTeam.rating,
    state.homeTeam.goals - state.awayTeam.goals,
    true
  );

  const awayNewTR = rating.calculateNewTeamRating(
    state.awayTeam.rating,
    state.homeTeam.rating,
    state.awayTeam.goals - state.homeTeam.goals,
    false
  );

  console.log('home TR =', homeNewTR);
  console.log('away TR =', awayNewTR);

  team.updateTeamFile(state.homeTeam, state.awayTeam, homeNewTR);
  team.updateTeamFile(state.awayTeam, state.homeTeam, awayNewTR);
};

const playHalf = (isFirstHalf, homeFieldBonus) => {
  updateState(state
    .log(event.halfTitle(isFirstHalf))
  );

  let minute = isFirstHalf ? 1 : 45;
  const endMin = isFirstHalf ? 45 : 90;

  while (minute <= endMin) {
    const goalScored = playMinute(minute, homeFieldBonus);
    minute = minute + (goalScored ? 2 : 1);
  }

  const stMins = getStoppageTime(isFirstHalf);

  updateState(state
    .log(event.stoppageTime(stMins))
  );

  while (minute <= stMins + endMin) {
    const goalScored = playMinute(minute, homeFieldBonus);
    minute = minute + (goalScored ? 2 : 1);
  }
};

const getStoppageTime = isFirstHalf => {
  const goals = state.homeTeam.goals + state.awayTeam.goals;
  const fouls = state.homeTeam.fouls + state.awayTeam.fouls;

  let minutes = Math.ceil(goals * 0.12 + fouls * 0.18);
  minutes = minutes > 6 ? 6 : minutes;
  minutes = minutes < 1 ? 1 : minutes;
  return minutes;
};

const playMinute = (minute, homeFieldBonus = 400) => {
  const rnd = random.get(state.homeTeam.totalRating + state.awayTeam.totalRating + homeFieldBonus);
  let goalScored = false;

  const homeTeamName = state.homeTeam.name;
  const awayTeamName = state.awayTeam.name;

  if (rnd < state.homeTeam.totalRating + homeFieldBonus) {
    checkTeamFoul(awayTeamName, homeTeamName, minute);
    goalScored = checkTeamGoal(homeTeamName, awayTeamName, minute);
  } else if (!goalScored) {
    checkTeamFoul(homeTeamName, awayTeamName, minute);
    goalScored = checkTeamGoal(awayTeamName, homeTeamName, minute);
  }

  return goalScored;
};

const getTeamKey = teamName => state.homeTeam.name === teamName ? 'homeTeam' : 'awayTeam';
const getTeam = teamName => state.homeTeam.name === teamName ? state.homeTeam : state.awayTeam;

const checkTeamFoul = (teamName, oppTeamName, minute) => {
  if (foul.checkFoul(getTeam(teamName).totalRating, getTeam(oppTeamName).totalRating)) {
    const teamKey = getTeamKey(teamName);
    const whoFouled = getTeam(teamName).whoFouled();

    if (foul.checkSentOff()) {
      const team = getTeam(teamName);

      updateState(state
        .set(teamKey, team.addFoul(whoFouled).addRedCard(whoFouled))
        .log(event.foul(minute, whoFouled, teamName))
        .log(event.redCard())
      );
    } else if (foul.checkWarned()) {
      const team = getTeam(teamName);

      if (team.hasYellowCard(whoFouled)) {
        updateState(state
          .set(teamKey, team.addFoul(whoFouled).addYellowCard(whoFouled).addRedCard(whoFouled))
          .log(event.foul(minute, whoFouled, teamName))
          .log(event.yellowCard())
          .log(event.secondYellowCard())
        );
      } else {
        updateState(state
          .set(teamKey, team.addFoul(whoFouled).addYellowCard(whoFouled))
          .log(event.foul(minute, whoFouled, teamName))
          .log(event.yellowCard())
        );
      }
    }  else {
      const team = getTeam(teamName);
      updateState(state
        .set(teamKey, team.addFoul(whoFouled))
      );
    }

    if (foul.checkPenalty()) {
      const oppTeamKey = getTeamKey(oppTeamName);
      const oppTeam = getTeam(oppTeamName);
      const penaltyKicker = oppTeam.penaltyKicker();

      updateState(state
        .log(event.foul(minute, whoFouled, teamName))
        .log(event.penalty())
        .log(event.penaltyKicker(penaltyKicker))
      );

      if (foul.checkPenaltyKickScored(getTeam(teamName).totalRating, getTeam(oppTeamName).totalRating)) {
        const oppTeam = getTeam(oppTeamName);
        updateState(state
          .set(oppTeamKey, oppTeam.addShot(penaltyKicker).addShotOnTarget(penaltyKicker).addPenaltyScored(penaltyKicker).addGoal(penaltyKicker))
        );
        updateState(state
          .log(event.goal(state.homeTeam.goals, state.awayTeam.goals))
        );
      } else if (foul.checkPenaltyKickSaved()) {
        const team = getTeam(teamName);
        const oppTeam = getTeam(oppTeamName);
        const goalkeeperName = team.goalkeeper();
        updateState(state
          .set(oppTeamKey, oppTeam.addShot(penaltyKicker).addShotOnTarget(penaltyKicker).addPenaltyMissed(penaltyKicker))
          .set(teamKey, team.addSave(goalkeeperName))
          .log(event.savedPenalty(goalkeeperName))
        );
      } else {
        const oppTeam = getTeam(oppTeamName);
        updateState(state
          .set(oppTeamKey, oppTeam.addShot(penaltyKicker).addPenaltyMissed(penaltyKicker))
          .log(event.missedPenalty())
        );
      }
    }
  }
};

const checkTeamGoal = (teamName, oppTeamName, minute) => {
  const attackingTeam = getTeam(teamName);
  const defendingTeam = getTeam(oppTeamName);
  const hasShotChance = attack.checkShotChance(attackingTeam.forwardRating, attackingTeam.midfieldRating, defendingTeam.defenceRating, minute);
  let goalScored = false;

  if (hasShotChance) {
    const teamKey = getTeamKey(teamName);
    const oppTeamKey = getTeamKey(oppTeamName);
    const whoShot = attackingTeam.whoShot();
    let whoAssisted = undefined;

    if (attack.checkChanceAssisted()) {
      whoAssisted = attackingTeam.whoAssisted(whoShot);

      updateState(state
        .log(event.assistedChance(minute, whoAssisted, whoShot, teamName))
      );
    } else {
      updateState(state
        .log(event.chance(minute, whoShot, teamName))
      );
    }

    if (attack.checkShotTackled(attackingTeam.forwardRating, attackingTeam.midfieldRating, defendingTeam.defenceRating)) {
      const oppTeam = getTeam(oppTeamName);
      const whoTackled = oppTeam.whoTackled();

      updateState(state
        .set(oppTeamKey, oppTeam.addTackle(whoTackled))
        .log(event.chanceTackled(whoTackled))
      );
    } else if (attack.checkShotOnTarget(attackingTeam.totalRating)) {
      updateState(state
        .log(event.shot(whoShot))
      );

      if (attack.checkGoalScored(getTeam(teamName).totalRating, getTeam(teamName).forwardRating, getTeam(oppTeamName).totalRating)) {
        if (attack.checkGoalCancelled()) {
          updateState(state
            .log(event.disallowedGoal())
          );
        } else {
          const team = getTeam(teamName);
          const oppTeam = getTeam(oppTeamName);
          const goalkeeperName = oppTeam.goalkeeper();
          updateState(state
            .set(teamKey, team.addShot(whoShot).addShotOnTarget(whoShot).addGoal(whoShot).addAssist(whoAssisted))
            .set(oppTeamKey, oppTeam.addGoalAllowed(goalkeeperName))
          );
          updateState(state
            .log(event.goal(state.homeTeam.goals, state.awayTeam.goals))
          );
          goalScored = true;
        }
      } else {
        const team = getTeam(teamName);
        const oppTeam = getTeam(oppTeamName);
        const goalkeeperName = oppTeam.goalkeeper();
        updateState(state
          .set(teamKey, team.addShot(whoShot).addShotOnTarget(whoShot))
          .set(oppTeamKey, oppTeam.addSave(goalkeeperName))
          .log(event.save(goalkeeperName))
        );
      }
    } else {
      const team = getTeam(teamName);
      updateState(state
        .set(teamKey, team.addShot(whoShot))
        .log(event.shot(whoShot))
        .log(event.shotOffTarget())
      );
    }
  }

  return goalScored;
};

const updateState = newState => {
  state = newState;
};

startApp();
