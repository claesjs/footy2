import Random from 'random-js';

const mt = Random.engines.mt19937();
const rndseed = Date.now();
const random = new Random(mt);

mt.seed(rndseed);

export const getSeed = () => rndseed;

export const get = max => {
  return random.real(0, max);
};

export const getInt = max => {
  return random.integer(0, max);
};
