import {fromJS} from 'immutable';

import {parseEnvironmentVariables} from './envs';
import {createConnection, disconnect, createDb, createTable} from './db';
import {fetchData} from './api';
import {processData} from './data';
import {
  storeRawStationsInDb,
  storeRawSensorsInDb,
  storeRawReadingsInDb,
  storeProcessedData,
} from './store';


async function main() {
  const crawlTime = Date.now();
  const params = parseEnvironmentVariables();

  const connection = await createConnection(params.dbHost, params.dbPort);

  try {
    await createDb(connection, params.dbName);
  } catch (e) {
    console.error(e);
  }

  try {
    await createTable(connection, params.dbName, 'raw_stations');
    await createTable(connection, params.dbName, 'raw_sensors');
    await createTable(connection, params.dbName, 'raw_readings');

    await createTable(connection, params.dbName, 'stations');
    await createTable(connection, params.dbName, 'cities');
    await createTable(connection, params.dbName, 'sensors');
    await createTable(connection, params.dbName, 'readings');
  } catch (e) {
    console.error(e);
  }

  let stations, sensors, readings;
  try {
    ({stations, sensors, readings} = await fetchData());
  } catch (e) {
    console.error(e);
  }

  try {
    await storeRawStationsInDb(connection, params.dbName, crawlTime, Object.values(stations));
    await storeRawSensorsInDb(connection, params.dbName, crawlTime, Object.values(sensors));
    await storeRawReadingsInDb(connection, params.dbName, crawlTime, readings);
  } catch (e) {
    console.error(e);
  }

  const processedData = processData(fromJS(stations), fromJS(sensors), fromJS(readings));

  try {
    await storeProcessedData(connection, params.dbName, processedData);
  } catch (e) {
    console.error(e);
  }

  await disconnect(connection);
}

main()
  .then(() => console.info('Done.'))
  .catch((error) => console.error(error));
