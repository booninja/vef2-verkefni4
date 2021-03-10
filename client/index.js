/* eslint-disable no-undef */
import { fetchEarthquakes } from './lib/earthquakes';
import { el, element, formatDate } from './lib/utils';
import { init, createPopup } from './lib/map';

function displayEarthquakes(earthquakes, type, period) {
  const ul = document.querySelector('.earthquakes');
  const h1 = document.querySelector('.type');
  const cache = document.querySelector('.cache');
  const map = document.querySelector('.map');
  init(map);
  const cachedEarthquakes = earthquakes.info.cached ? 'Gögn eru í cache.' : 'Gögn eru ekki í cache.';
  const elapsedTime = earthquakes.info.elapsed;
  earthquakes.data.features.forEach((quake) => {
    const {
      title, mag, time, url,
    } = quake.properties;

    const link = element('a', { href: url, target: '_blank' }, null, 'Skoða nánar');

    const markerContent = el('div',
      el('h3', title),
      el('p', formatDate(time)),
      el('p', link));
    const marker = createPopup(quake.geometry, markerContent.outerHTML);

    const onClick = () => {
      marker.openPopup();
    };

    const li = el('li');

    li.appendChild(
      el('div',
        el('h2', title),
        el('dl',
          el('dt', 'Tími'),
          el('dd', formatDate(time)),
          el('dt', 'Styrkur'),
          el('dd', `${mag} á richter`),
          el('dt', 'Nánar'),
          el('dd', url.toString())),
        element('div', { class: 'buttons' }, null,
          element('button', null, { click: onClick }, 'Sjá á korti'),
          link)),
    );

    h1.innerHTML = `${type}, ${period.toLowerCase()}`;
    cache.innerHTML = `${cachedEarthquakes} Fyrirspurn tók ${elapsedTime} sek.`;
    ul.appendChild(li);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const queryString = window.location.search;
  const queryType = document.querySelectorAll(`a[href='/${window.location.search}'`);
  const urlParams = new URLSearchParams(queryString);
  const type = urlParams.has('type') ? urlParams.get('type') : 'all';
  const period = urlParams.has('period') ? urlParams.get('period') : 'hour';
  const earthquakes = await fetchEarthquakes(period, type);

  // Fjarlægjum loading skilaboð eftir að við höfum sótt gögn
  const loading = document.querySelector('.loading');
  const parent = loading.parentNode;
  parent.removeChild(loading);
  console.info(earthquakes.data.features.length);
  if (earthquakes.data.features.length <= 0) {
    parent.appendChild(
      el('p', 'Engir jarðskjálftar fundnir'),
    );
  } else {
    displayEarthquakes(earthquakes, queryType[0].innerHTML, queryType[0].name);
  }
});
