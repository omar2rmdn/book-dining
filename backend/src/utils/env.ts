export function getEnv() {
  return {
    port: process.env.PORT,
    dbUrl: process.env.DB_URL,
    refreshKey: process.env.JWT_REFRESH_KEY,
    accessKey: process.env.JWT_ACCESS_KEY,
  };
}
