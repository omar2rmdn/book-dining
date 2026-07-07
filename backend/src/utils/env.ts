export function getEnv() {
  return {
    port: process.env.PORT,
    dbUrl: process.env.DB_URL,
  };
}
