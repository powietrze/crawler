import fetch from 'node-fetch';

import {parseEnvironmentVariables} from './envs';
import {createConnection, disconnect, createDb, createTable, insert} from './db';


async function main() {
  const params = parseEnvironmentVariables();

  const connection = await createConnection(params.dbHost, params.dbPort);

  try {
    await createDb(connection, params.dbName);
  } catch (e) {
    console.error(e);
  }

  try {
    await createTable(connection, params.dbName, 'powietrze_test_table');
  } catch (e) {
    console.error(e);
  }

  try {
    await insert(connection, params.dbName, 'powietrze_test_table', {test: 'data'});
  } catch (e) {
    console.error(e);
  }

  await disconnect(connection);

  await fetchData();
}

main()
  .then(() => console.info('Done.'))
  .catch((error) => console.error(error));

const STATIONS_URL = 'http://powietrze.gios.gov.pl/pjp/rest/station/findAll';
const SENSORS_URL = 'http://powietrze.gios.gov.pl/pjp/rest/station/sensors/';
const READINGS_URL = 'http://powietrze.gios.gov.pl/pjp/rest/data/getData/';

function print(object) {
  console.info(JSON.stringify(object, null, 2));
}

async function fetchData() {
  const stations = await fetchStations();
  for (let station of stations) {
    print(station);
    const sensors = await fetchSensors(station.id);
    for (let sensor of sensors) {
      print(sensor);
      const readings = await fetchReadings(sensor.id);
      print(readings);
    }
  }
}

function fetchStations() {
  return fetch(STATIONS_URL).then((response) => response.json());
}

function fetchSensors(stationId) {
  return fetch(SENSORS_URL + stationId).then((response) => response.json());
}

function fetchReadings(sensorId) {
  return fetch(READINGS_URL + sensorId).then((response) => response.json());
}
