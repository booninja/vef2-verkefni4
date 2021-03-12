import redis from 'redis';
import { promisify } from 'util';
import dotenv from 'dotenv';

dotenv.config();

export let getEarthquakes; // eslint-disable-line import/no-mutable-exports
export let setEarthquakes; // eslint-disable-line import/no-mutable-exports

const {
  REDIS_URL: redisURL,
} = process.env;

try {
  if (!redisURL) {
    throw Error('Redis url not found');
  }
  const client = redis.createClient({
    url: redisURL,
  });

  const asyncGet = promisify(client.get).bind(client);
  const asyncSet = promisify(client.set).bind(client);

  /**
   * Get earthquakes from the cache
   * @param {*} key
   * @returns
   */
  getEarthquakes = async (key) => {
    const earthquakes = await asyncGet(key);
    return earthquakes;
  };

  /**
   * Add earthquakes to cache
   * @param {*} key
   * @param {*} earthquakes
   */
  setEarthquakes = async (key, earthquakes) => {
    await asyncSet(key, earthquakes);
  };
} catch (e) {
  console.error('Error setting up redis redisURL, running without cache', e);
  getEarthquakes = async (key) => false; // eslint-disable-line no-unused-vars
  setEarthquakes = async (key, value) => { }; // eslint-disable-line no-unused-vars
}
