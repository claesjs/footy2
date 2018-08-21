export const calculateRatings = (rating, players, tactic, oppTactic) => {
  const dMod = tactics[tactic].defence;
  const mMod = tactics[tactic].midfield;
  const aMod = tactics[tactic].forward;

  const dBonus = tactics[tactic].bonus && tactics[tactic].bonus[oppTactic] && tactics[tactic].bonus[oppTactic].defence || 0;
  const mBonus = tactics[tactic].bonus && tactics[tactic].bonus[oppTactic] && tactics[tactic].bonus[oppTactic].midfield || 0;
  const aBonus = tactics[tactic].bonus && tactics[tactic].bonus[oppTactic] && tactics[tactic].bonus[oppTactic].forward || 0;

  const starBonus = players.filter(p => p.isStarPlayer()).size * 0.04;
  const dStarBonus = players.filter(p => p.isStarPlayer() && p.position === 'DF').size * 0.02 + starBonus;
  const mStarBonus = players.filter(p => p.isStarPlayer() && p.position === 'MF').size * 0.02 + starBonus;
  const fStarBonus = players.filter(p => p.isStarPlayer() && p.position === 'FW').size * 0.02 + starBonus;

  const defenceRating = (rating / 10 * players.filter(p => p.position === 'DF' && p.redCards === 0).size) * (dMod + dBonus + dStarBonus);
  const midfieldRating = (rating / 10 * players.filter(p => p.position === 'MF' && p.redCards === 0).size) * (mMod + mBonus + mStarBonus);
  const forwardRating = (rating / 10 * players.filter(p => p.position === 'FW' && p.redCards === 0).size) * (aMod + aBonus + fStarBonus);

  return {
    defenceRating: defenceRating > 0 ? defenceRating : rating * 0.05,
    midfieldRating: midfieldRating > 0 ? midfieldRating : rating * 0.05,
    forwardRating: forwardRating > 0 ? forwardRating : rating * 0.05
  }
};

export const calculateNewTeamRating = (teamRating, oppTeamRating, goalDifference, isHomeTeam) => {
  const K = 5;

  let gd = 0;
  if (goalDifference === 2) {
    gd = K * 0.5;
  } else if (goalDifference === 3) {
    gd = K * 0.75;
  } else if (goalDifference >= 4) {
    gd = K * 0.75 + (goalDifference - 3) / 8;
  }

  let W = 0;
  if (goalDifference > 0) {
    W = 1;
  } else if (goalDifference === 0) {
    W = 0.5;
  }

  const dr = Math.abs(teamRating - oppTeamRating) + isHomeTeam ? 100 : 0;
  const We = 1 / (Math.pow(10, (-dr/400)) + 1);

  const Rn = teamRating + (K + gd) * (W - We);
  return Math.round(Rn);
};

export const tactics = {
  N: {
    defence: 1.0,
    midfield: 1.0,
    forward: 1.0
  },
  D: {
    defence: 1.25,
    midfield: 0.75,
    forward: 0.75
  },
  A: {
    defence: 0.75,
    midfield: 1.0,
    forward: 1.5
  },
  C: {
    defence: 1.1,
    midfield: 1.0,
    forward: 0.75,
    bonus: {
      A: {
        defence: 0.15,
        midfield: 0.25,
        forward: 0
      },
      P: {
        defence: 0.15,
        midfield: 0.25,
        forward: 0
      }
    }
  },
  L: {
    defence: 1,
    midfield: 0.75,
    forward: 1.3,
    bonus: {
      C: {
        defence: 0.25,
        midfield: 0,
        forward: 0
      }
    }
  },
  P: {
    defence: 1.0,
    midfield: 1.0,
    forward: 1.0,
    bonus: {
      L: {
        defence: 0,
        midfield: 0.25,
        forward: 0.25
      }
    }
  }
};
