import mysql from "mysql2/promise";

let connectionPool = mysql.createPool({
  host: "host.docker.internal",
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

export const executeQuery = async (query, queryParams = []) => {
  const queryResponse = await connectionPool.query(query, queryParams);
  return queryResponse[0];
};
