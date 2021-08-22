import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FetchUsersService } from '../fetch/fetch-users.service';
import { User } from '../fetch/interfaces/user.interface';
import { CreateProjectDTO } from './dtos/create-project.dto';
import { FindProjectByIdDTO } from './dtos/find-project-by-id.dto';
import { FindProjectDTO } from './dtos/find-project.dto';
import { TechnologyDTO } from './dtos/technology-dto';
import { Technology } from './entities/project-technologies.entity';
import { Project } from './entities/project.entity';
import { ProjectWithProjectMembers } from './interfaces/project-members';
import { ProjectWithUser } from './interfaces/project-with-users';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Technology)
    private readonly technologyRepository: Repository<Technology>,
    private readonly fetchUsersService: FetchUsersService,
  ) {}

  private async mapTechnologiesToProject(
    technologies: TechnologyDTO[],
    id: string,
  ): Promise<Technology[]> {
    const createdTechnologies = this.technologyRepository.create(
      technologies.map((tech) => ({ ...tech, project_id: id })),
    );

    return this.technologyRepository.save(createdTechnologies);
  }

  async createNewProject(createProjectDTO: CreateProjectDTO): Promise<Project> {
    const { technologies, description, repository, title, user_id } =
      createProjectDTO;

    const project = this.projectRepository.create({
      description,
      repository,
      title,
      user_id,
    });

    await this.projectRepository.save(project);

    project.technologies = await this.mapTechnologiesToProject(
      technologies,
      project.id,
    );

    await this.fetchUsersService.insertProjectMember(
      project.id,
      project.user_id,
    );

    return project;
  }

  async findProjectById(
    findProjectByIdDTO: FindProjectByIdDTO,
  ): Promise<ProjectWithProjectMembers> {
    const project = await this.projectRepository.findOne(
      findProjectByIdDTO.id,
      {
        relations: ['technologies'],
      },
    );

    if (!project) {
      throw new NotFoundException(
        `No project with ID "${findProjectByIdDTO.id} found"`,
      );
    }

    const users = await this.fetchUsersService.getProjectMembers(project.id);

    delete project.user_id;

    return {
      ...project,
      project_members: users,
    };
  }

  async findProjects(): Promise<ProjectWithUser[]> {
    const projects = await this.projectRepository.find({
      relations: ['technologies'],
      skip: 0,
      take: 15,
    });

    const userIds = projects.map((project) => project.user_id);

    const users = await this.fetchUsersService.getUsersByUserIds(userIds);

    return this.mapUsersToProjects(projects, users);
  }

  async findProjectsByTechnologyIds(
    findProjectDTO: FindProjectDTO,
  ): Promise<ProjectWithUser[]> {
    const { technology_ids } = findProjectDTO;

    const queryBuilder = this.projectRepository.createQueryBuilder('project');

    const projects = await queryBuilder
      .leftJoinAndSelect('project.technologies', 'technology')
      .where('technology.technology_id IN(:...technology_ids)', {
        technology_ids,
      })
      .limit(15)
      .getMany();

    if (!projects.length) {
      return [];
    }

    const userIds = projects.map((project) => project.user_id);

    const users = await this.fetchUsersService.getUsersByUserIds(userIds);

    return this.mapUsersToProjects(projects, users);
  }

  private mapUsersToProjects(
    projects: Project[],
    users: User[],
  ): ProjectWithUser[] {
    return projects.map((project) => {
      const foundUser = users.find((user) => user.id === project.user_id);

      if (!foundUser) {
        return;
      }

      delete project.user_id;

      return {
        ...project,
        user: foundUser,
      };
    });
  }
}
