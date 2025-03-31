import { Sequelize, Dialect } from "sequelize";
import * as dotenv from "dotenv";
import { MySQLDBConfig } from "./environment"
dotenv.config();

const hosts = MySQLDBConfig.MYSQL_HOST;
const sslhost =
  hosts !== "localhost"
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {};

// Database configuration interface for type safety
interface DBConfig {
  HOST: string;
  PORT: number;
  USER: string;
  DB: string;
  PASSWORD: string;
  pool: {
    max: number;
    min: number;
    acquire: number;
    idle: number;
  };
}

// Database configuration with environment variables
const dbConfig: DBConfig = {
  HOST: MySQLDBConfig.MYSQL_HOST || "localhost",
  PORT: parseInt(MySQLDBConfig.MYSQL_PORT || "3306"),
  USER: MySQLDBConfig.MYSQL_USER || "root",
  DB: MySQLDBConfig.MYSQL_DB_NAME || "trynow",
  PASSWORD: MySQLDBConfig.MYSQL_PASS || "12345",
  pool: {
    max: 150,
    min: 0,
    acquire: 90000,
    idle: 50000,
  },
};

// Initialize Sequelize with typed configuration
const sequelize = new Sequelize({
  database: dbConfig.DB,
  username: dbConfig.USER,
  password: dbConfig.PASSWORD,
  host: dbConfig.HOST,
  dialect: "mysql" as Dialect,
  logging: false,
  port: dbConfig.PORT,
  dialectOptions: {
    connectTimeout: 150000,
    ...sslhost, // Conditionally add SSL settings
  },
  pool: dbConfig.pool,
  retry: {
    max: 5,
    match: [
      /SequelizeConnectionAcquireTimeoutError/,
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
      /SequelizeHostNotFoundError/,
      /SequelizeHostNotReachableError/,
      /SequelizeInvalidConnectionError/,
      /SequelizeConnectionTimedOutError/,
    ],
    backoffBase: 1000, // Initial retry delay in ms
    backoffExponent: 1.5, // Exponential backoff multiplier
  },
});

// Authenticate and log connection status
sequelize
  .authenticate()
  .then(() => {
    console.log("|--:DB Connection has been established successfully:--|.");
  })
  .catch((error: Error) => {
    console.error("|--:Unable to connect to the Database:--|", error.message);
  });

export default sequelize;