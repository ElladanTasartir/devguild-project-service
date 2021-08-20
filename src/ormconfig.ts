import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { postgres } from './config';
import { Technology } from './modules/project/entities/project-technologies.entity';
import { Project } from './modules/project/entities/project.entity';

const { host, username, password, database, port, logging, synchronize } =
  postgres;

export const ormConfig = {
  type: 'postgres',
  entities: [Project, Technology],
  host,
  port,
  username,
  password,
  database,
  logging,
  synchronize,
} as TypeOrmModuleOptions;
