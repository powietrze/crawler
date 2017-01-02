export function parseEnvironmentVariables() {
  const requiredVariables = ['DB_HOST', 'DB_PORT', 'DB_NAME'];
  const givenVariables = process.env;
  const missingVariables = requiredVariables.filter(v => !(v in givenVariables));
  if (missingVariables.length > 0) {
    throw new Error(`Missing environment variables: ${missingVariables.join(', ')}`);
  }
  return {
    dbHost: givenVariables.DB_HOST,
    dbPort: givenVariables.DB_PORT,
    dbName: givenVariables.DB_NAME,
  };
}
