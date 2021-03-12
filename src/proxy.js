// TODO útfæra proxy virkni
import express from 'express';
import fetch from 'node-fetch';

import { getEarthquakes, setEarthquakes } from './cache.js';
import { timerEnd, timerStart } from './time.js';

export const router = express.Router();

router.get('/proxy', async (req, res) => {
  const {
    period, type,
  } = req.query;
  const URL = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${period}_${type}.geojson`;

  let result;
  const start = timerStart();
  // TODO skoða fyrst cachið

  try {
    result = await getEarthquakes(`${period}_${type}`);
    // console.info(result);
  } catch (e) {
    console.error('Villa við að ná gögn úr cache', e);
  }
  let end = timerEnd(start);
  if (result) {
    const data = {
      data: JSON.parse(result),
      info: {
        cached: true,
        elapsed: end,
      },
    };
    res.json(data);
    return;
  }

  try {
    result = await fetch(URL);
    // console.info(result);
  } catch (e) {
    console.error('Villa við að sækja gögn frá vefþjónustu', e);
    res.status(500).send('Villa við að sækja gögn frá vefþónustu');
    return;
  }

  if (!result.ok) {
    console.error('Villa frá vefþjónustu', await result.text());
    res.status(500).send('Villa við að sækja gögn frá vefþjónustu');
    return;
  }

  // TODO setja gögn í cache
  const cacheResults = await result.text();
  await setEarthquakes(`${period}_${type}`, cacheResults);

  end = timerEnd(start);
  const cachedData = {
    data: JSON.parse(cacheResults),
    info: {
      cached: false,
      elapsed: end,
    },
  };

  res.json(cachedData);
});
