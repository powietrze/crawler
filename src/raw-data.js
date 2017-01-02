import {insert} from './db';


async function insertRawData(connection, dbName, tableName, data, length, entityName) {
  await insert(connection, dbName, tableName, data);
  console.info(`${length} ${entityName} successfully stored in ${tableName}`);
}

export async function storeRawStationsInDb(connection, dbName, crawlDateTime, stations) {
  const data = stations.map(s => ({crawlDateTime, rawData: s}));
  await insertRawData(connection, dbName, 'raw_stations', data, stations.length, 'stations');
}

export async function storeRawSensorsInDb(connection, dbName, crawlDateTime, sensors) {
  const data = sensors.map(s => ({crawlDateTime, rawData: s}));
  await insertRawData(connection, dbName, 'raw_sensors', data, sensors.length, 'sensors');
}

export async function storeRawReadingsInDb(connection, dbName, crawlDateTime, readings) {
  const sensorsIds = Object.keys(readings);
  const data = sensorsIds.map(id => ({crawlDateTime, sensorId: id, rawData: readings[id]}));
  await insertRawData(connection, dbName, 'raw_readings', data, sensorsIds.length, 'readings');
}
