import { MersenneTwister19937, Random } from 'random-js';

const seed = Date.now();
const mt = MersenneTwister19937.seed(seed);
const random = new Random(mt);

export const getSeed = () => seed;

export const get = max => {
  return random.real(0, max);
};

export const getInt = max => {
  return random.integer(0, max);
};
