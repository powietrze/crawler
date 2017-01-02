import rethink from 'rethinkdb';


export const createConnection = (dbHost, dbPort) => rethink.connect({host: dbHost, port: dbPort});

export const disconnect = (connection) => connection.close();

export const createDb = (connection, dbName) => rethink.dbCreate(dbName)
  .run(connection)
  .catch(error => {
    if (error.msg !== `Database \`${dbName}\` already exists.`) {
      throw error;
    }
  });


export const createTable = (connection, dbName, tableName) => rethink
  .db(dbName)
  .tableCreate(tableName)
  .run(connection)
  .catch(error => {
    if (error.msg !== `Table \`${dbName}.${tableName}\` already exists.`) {
      throw error;
    }
  });

export const insert = (connection, dbName, tableName, data) => rethink
  .db(dbName)
  .table(tableName)
  .insert(data)
  .run(connection);
