import { ormConfig } from './ormconfig';

export default {
  ...ormConfig,
  migrations: ['migrations/*.ts'],
  cli: {
    migrationsDir: 'migrations',
  },
};
