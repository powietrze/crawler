import fetch from 'node-fetch';


const STATIONS_URL = 'http://powietrze.gios.gov.pl/pjp/rest/station/findAll';
const SENSORS_URL = 'http://powietrze.gios.gov.pl/pjp/rest/station/sensors/';
const READINGS_URL = 'http://powietrze.gios.gov.pl/pjp/rest/data/getData/';


export async function fetchData() {
  console.time('Data fetch took');
  console.info('Data fetch started.');

  const stationsArray = await fetchStations();
  let sensorsMap = {};
  let readingsMap = {};

  for (let station of stationsArray) {
    const sensors = await fetchSensors(station.id);
    sensorsMap = {...sensorsMap, ...normalize(sensors, 'id')};
    for (let sensor of sensors) {
      const readings = await fetchReadings(sensor.id);
      readingsMap = {...readingsMap, [sensor.id]: readings}
    }
  }
  console.timeEnd('Data fetch took');
  console.info(`Data fetch finished.`);

  return {
    stations: normalize(stationsArray, 'id'),
    sensors: sensorsMap,
    readings: readingsMap,
  }
}

const normalize = (array, key) => array.reduce((acc, prev) => ({...acc, [prev[key]]: prev}), {});


const fetchStations = () => fetch(STATIONS_URL)
  .then((response) => response.json());

const fetchSensors = (stationId) => fetch(SENSORS_URL + stationId)
  .then((response) => response.json());

const fetchReadings = (sensorId) => fetch(READINGS_URL + sensorId)
  .then((response) => response.json());
