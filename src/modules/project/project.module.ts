import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FetchModule } from '../fetch/fetch.module';
import { Technology } from './entities/project-technologies.entity';
import { Project } from './entities/project.entity';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Technology]), FetchModule],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
