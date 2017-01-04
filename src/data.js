import {Map, List} from 'immutable';


export function processData(stations, sensors, readings) {
  const stationsList = stations.toList();
  const sensorsList = sensors.toList();
  return Map({
    stations: stationsList.map(processStation),
    cities: stationsList.map(processCity).filter(c => c),
    sensors: sensorsList.map(processSensor),
    readings: processReadings(readings),
  });
}

const processStation = (station) => Map({
  id: String(station.get('id')),
  name: station.get('stationName'),
  lat: station.get('gegrLat'),
  lon: station.get('gegrLon'),
  cityId: station.get('city') ? String(station.getIn(['city', 'id'])) : null,
  street: station.get('addressStreet'),
});

const processCity = (station) => {
  const city = station.get('city');
  if (!city) {
    return null;
  }

  return Map({
    id: String(city.get('id')),
    name: city.get('name'),
  });
};

const processSensor = (sensor) => Map({
  id: String(sensor.get('id')),
  stationId: String(sensor.get('stationId')),
  paramName: sensor.getIn(['param', 'paramName']),
  paramFormula: sensor.getIn(['param', 'paramFormula']),
});

const processReadings = (readings) =>
  readings.map(
    (reading, sensorId) => reading
      .get('values')
      .filter(v => v.get('value') !== null)
      .map(v => {
        const dateTime = Math.floor(v.get('date') / 1000) * 1000;
        return Map({
          id: `${sensorId}:${dateTime}`,
          sensorId: String(sensorId),
          value: v.get('value'),
          dateTime,
        });
      })
  ).reduce((acc, prev) => acc.concat(prev), List());
