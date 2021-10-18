import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CreateProjectDTO } from './dtos/create-project.dto';
import { FindProjectByIdDTO } from './dtos/find-project-by-id.dto';
import { FindProjectDTO } from './dtos/find-project.dto';
import { InsertTechnologiesInProjectDTO } from './dtos/insert-technologies-in-project.dto';
import { UpdateProjectDTO } from './dtos/update-project.dto';
import { Technology } from './entities/project-technologies.entity';
import { Project } from './entities/project.entity';
import { ProjectWithProjectMembers } from './interfaces/project-members.interface';
import { ProjectService } from './project.service';

@Controller('projects')
@UseInterceptors(ClassSerializerInterceptor)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Put(':id')
  updateProject(
    @Param(ValidationPipe) findProjectByIdDTO: FindProjectByIdDTO,
    @Body(ValidationPipe) updateProjectDTO: UpdateProjectDTO,
  ): Promise<Project> {
    return this.projectService.updateProject(
      findProjectByIdDTO.id,
      updateProjectDTO,
    );
  }

  @Post()
  createNewProject(
    @Body(ValidationPipe) createProjectDTO: CreateProjectDTO,
  ): Promise<Project> {
    return this.projectService.createNewProject(createProjectDTO);
  }

  @Post(':id/techs')
  insertTechnologiesInProject(
    @Param(ValidationPipe)
    findProjectByIdDTO: FindProjectByIdDTO,
    @Body(ValidationPipe)
    insertTechnologiesInProjectDTO: InsertTechnologiesInProjectDTO,
  ): Promise<Technology[]> {
    return this.projectService.insertTechnologiesInProject(
      insertTechnologiesInProjectDTO,
      findProjectByIdDTO.id,
    );
  }

  @Get(':id')
  findProjectById(
    @Param(ValidationPipe) findProjectByIdDTO: FindProjectByIdDTO,
  ): Promise<ProjectWithProjectMembers> {
    return this.projectService.findProjectById(findProjectByIdDTO);
  }

  @Get(':id/user')
  findProjectByUserId(
    @Param(ValidationPipe) findProjectByIdDTO: FindProjectByIdDTO,
  ): Promise<Project[]> {
    return this.projectService.findProjectsByUserId(findProjectByIdDTO.id);
  }

  @Get(':id/project-members')
  findProjectsWhereUserIsAMember(
    @Param(ValidationPipe) findProjectByIdDTO: FindProjectByIdDTO,
  ): Promise<Project[]> {
    return this.projectService.findProjectsWhereUserIsAMember(
      findProjectByIdDTO.id,
    );
  }

  @Get()
  findProjects(
    @Query(new ValidationPipe({ transform: true }))
    findProjectDTO: FindProjectDTO,
  ): Promise<Project[]> {
    if (!!findProjectDTO.technology_ids?.length) {
      return this.projectService.findProjectsByTechnologyIds(findProjectDTO);
    }

    return this.projectService.findProjects(findProjectDTO);
  }
}
