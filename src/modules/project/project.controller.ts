import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CreateProjectDTO } from './dtos/create-project.dto';
import { Project } from './entities/project.entity';
import { ProjectService } from './project.service';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  createNewProject(
    @Body(ValidationPipe) createProjectDTO: CreateProjectDTO,
  ): Promise<Project> {
    return this.projectService.createNewProject(createProjectDTO);
  }
}
