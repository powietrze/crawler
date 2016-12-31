import fetch from 'node-fetch';

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

fetchData()
    .then(() => console.info('Done.'))
    .catch((error) => console.error(error));
