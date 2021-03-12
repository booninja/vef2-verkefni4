import redis from 'redis';
import { promisify } from 'util';

export let getEarthquakes; // eslint-disable-line import/no-mutable-exports
export let setEarthquakes; // eslint-disable-line import/no-mutable-exports

const client = redis.createClient({
  url: 'redis://127.0.0.1:6379/0',
});

try {
  if(!client) {
    throw Error('Redis url not found');
  }

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
  }

  /**
   * Add earthquakes to cache
   * @param {*} key
   * @param {*} earthquakes
   */
  setEarthquakes = async (key, earthquakes) => {
    await asyncSet(key, earthquakes);
  }
} catch (e) {
  console.error('Error setting up redis client, running without cache', e);
  getEarthquakes = async (key) => false; // eslint-disable-line no-unused-vars  
  setEarthquakes = async (key, value) => { }; // eslint-disable-line no-unused-vars
}
