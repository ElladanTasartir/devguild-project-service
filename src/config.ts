import { config } from 'dotenv';

const { NODE_ENV } = process.env;

const envFile = `.env.${NODE_ENV}`;
config({ path: envFile });

const REQUIRED_ENV_VARS = [
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USERNAME',
  'POSTGRES_PASSWORD',
  'POSTGRES_DATABASE',
];

REQUIRED_ENV_VARS.forEach((envVar) => {
  const val = process.env[envVar];
  if (!val) {
    throw new Error(`Required ENV VAR not set: ${envVar}`);
  }
});

export const postgres = {
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  synchronize: process.env.SYNC_DB === 'true' || false,
  logging: process.env.ORM_LOG_ENABLED === 'true' || false,
};
