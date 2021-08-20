import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CreateProjectDTO } from './dtos/create-project.dto';
import { FindProjectByIdDTO } from './dtos/find-project-by-id.dto';
import { FindProjectDTO } from './dtos/find-project.dto';
import { Project } from './entities/project.entity';
import { ProjectService } from './project.service';

@Controller('projects')
@UseInterceptors(ClassSerializerInterceptor)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  createNewProject(
    @Body(ValidationPipe) createProjectDTO: CreateProjectDTO,
  ): Promise<Project> {
    return this.projectService.createNewProject(createProjectDTO);
  }

  @Get(':id')
  findProjectById(
    @Param(ValidationPipe) findProjectByIdDTO: FindProjectByIdDTO,
  ): Promise<Project> {
    return this.projectService.findProjectById(findProjectByIdDTO);
  }

  @Get()
  findProjects(
    @Query(new ValidationPipe({ transform: true }))
    findProjectDTO: FindProjectDTO,
  ): Promise<Project[]> {
    if (!!findProjectDTO.technology_ids?.length) {
      return this.projectService.findProjectsByTechnologyIds(findProjectDTO);
    }

    return this.projectService.findProjects();
  }
}
