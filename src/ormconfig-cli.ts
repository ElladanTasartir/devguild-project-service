import { ormConfig } from './ormconfig';

export default {
  ...ormConfig,
  entities: [],
  migrations: ['migrations/*.ts'],
  cli: {
    migrationsDir: 'migrations',
  },
};
