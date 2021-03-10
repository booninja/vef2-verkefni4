/* eslint-disable no-undef */
export async function fetchEarthquakes(type, period) {
  // TODO sækja gögn frá proxy þjónustu
  let result;
  const URL = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${period}_${type}.geojson`;

  try {
    // result = await fetch(URL);
    // result = await fetch(`http://localhost:3001/proxy?period=${period}&type=${type}`);
    result = await fetch(URL);
  } catch (e) {
    console.error('Villa við að sækja', e);
    return null;
  }

  if (!result.ok) {
    console.error('Ekki 200 svar', await result.text());
    return null;
  }

  const data = await result.json();

  return data;
}
