import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { FetchTechService } from '../fetch/fetch-tech.service';
import { FetchUsersService } from '../fetch/fetch-users.service';
import { User } from '../fetch/interfaces/user.interface';
import { CreateProjectDTO } from './dtos/create-project.dto';
import { FindProjectByIdDTO } from './dtos/find-project-by-id.dto';
import { FindProjectDTO } from './dtos/find-project.dto';
import { InsertTechnologiesInProjectDTO } from './dtos/insert-technologies-in-project.dto';
import { TechnologyDTO } from './dtos/technology-dto';
import { UpdateProjectDTO } from './dtos/update-project.dto';
import { Technology } from './entities/project-technologies.entity';
import { Project } from './entities/project.entity';
import { ProjectWithProjectMembers } from './interfaces/project-members.interface';
import { ProjectsTechnologies } from './interfaces/project-technologies.interface';
import { ProjectWithTechnologies } from './interfaces/project-with-technologies.interface';
import { ProjectWithUser } from './interfaces/project-with-users.interface';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Technology)
    private readonly technologyRepository: Repository<Technology>,
    private readonly fetchUsersService: FetchUsersService,
    private readonly fetchTechService: FetchTechService,
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

  async updateProject(
    id: string,
    updateProjectDTO: UpdateProjectDTO,
  ): Promise<Project> {
    const { user_id } = updateProjectDTO;

    const project = await this.projectRepository.findOne(id);

    if (!project) {
      throw new NotFoundException(`No project with ID "${id} found"`);
    }

    if (user_id !== project.user_id) {
      throw new ForbiddenException(`You can only update your own projects`);
    }

    for (const key in updateProjectDTO) {
      project[key] = updateProjectDTO[key];
    }

    return this.projectRepository.save(project);
  }

  findProjectsByUserId(id: string): Promise<Project[]> {
    return this.projectRepository.find({
      where: {
        user_id: id,
      },
    });
  }

  async findProjectsWhereUserIsAMember(id: string): Promise<Project[]> {
    const projectIds =
      await this.fetchUsersService.getProjectsWhereUserIsAMember(id);

    return this.projectRepository.find({
      where: {
        id: In(projectIds),
        user_id: Not(id),
      },
    });
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

    const [users, technologies] = await Promise.all([
      this.fetchUsersService.getProjectMembers(project.id),
      project.technologies.length
        ? this.fetchTechService.findTechnologiesbyIds(
            project.technologies.map((tech) => tech.technology_id),
          )
        : null,
    ]);

    delete project.technologies;

    return {
      ...project,
      project_technologies: technologies || [],
      project_members: users,
    };
  }

  async findProjects(
    findProjectDTO: FindProjectDTO,
  ): Promise<ProjectWithUser[]> {
    const { page = 1 } = findProjectDTO;

    const pageSize = 15;
    const skipSize = pageSize * (page - 1);

    const projects = await this.projectRepository.find({
      relations: ['technologies'],
      skip: skipSize,
      take: pageSize,
    });

    const userIds = [...new Set(projects.map((project) => project.user_id))];
    const technologiesIds = [
      ...new Set(
        [].concat(
          ...projects.map((project) =>
            project.technologies.map((tech) => tech.technology_id),
          ),
        ),
      ),
    ];

    const [users, technologies] = await Promise.all([
      userIds.length ? this.fetchUsersService.getUsersByUserIds(userIds) : null,
      technologiesIds.length
        ? this.fetchTechService.findTechnologiesbyIds(technologiesIds)
        : null,
    ]);

    const projectsWithTechnologies = this.mapTechsToProjects(
      projects,
      technologies,
    );

    return this.mapUsersToProjects(projectsWithTechnologies, users);
  }

  async findProjectsByTechnologyIds(
    findProjectDTO: FindProjectDTO,
  ): Promise<ProjectWithUser[]> {
    const { technology_ids, page = 1 } = findProjectDTO;

    const pageSize = 15;
    const skipSize = pageSize * (page - 1);
    console.log(skipSize);
    const technologyQueryBuilder =
      this.technologyRepository.createQueryBuilder('technology');

    const technologiesFound = await technologyQueryBuilder
      .select('project_id')
      .where('technology.technology_id IN(:...technology_ids)', {
        technology_ids: [...new Set(technology_ids)],
      })
      .groupBy('technology.project_id')
      .getRawMany();

    if (!technologiesFound.length) {
      return [];
    }

    const projects = await this.projectRepository.find({
      where: {
        id: In(technologiesFound.map((tech) => tech.project_id)),
      },
      relations: ['technologies'],
      skip: skipSize,
      take: pageSize,
    });

    if (!projects.length) {
      return [];
    }

    const userIds = [...new Set(projects.map((project) => project.user_id))];
    const technologiesIds = [
      ...new Set(
        [].concat(
          ...projects.map((project) =>
            project.technologies.map((tech) => tech.technology_id),
          ),
        ),
      ),
    ];

    const [users, technologies] = await Promise.all([
      this.fetchUsersService.getUsersByUserIds(userIds),
      technologiesIds.length
        ? this.fetchTechService.findTechnologiesbyIds(technologiesIds)
        : null,
    ]);

    const projectsWithTechnologies = this.mapTechsToProjects(
      projects,
      technologies,
    );

    return this.mapUsersToProjects(projectsWithTechnologies, users);
  }

  private findProjectByTechnologiesIdAndId(
    technologies: TechnologyDTO[],
    id: string,
  ): Promise<Technology[]> {
    return this.technologyRepository.find({
      where: {
        technology_id: In([
          ...new Set(technologies.map((tech) => tech.technology_id)),
        ]),
        project_id: id,
      },
    });
  }

  async insertTechnologiesInProject(
    insertTechnologiesInProjectDTO: InsertTechnologiesInProjectDTO,
    id: string,
  ): Promise<Technology[]> {
    const { technologies } = insertTechnologiesInProjectDTO;

    const projectAlreadyHasTechnologies =
      await this.findProjectByTechnologiesIdAndId(technologies, id);

    if (projectAlreadyHasTechnologies.length) {
      throw new BadRequestException(
        `Project already has technologies "${projectAlreadyHasTechnologies
          .map((tech) => tech.technology_id)
          .join(',')}"`,
      );
    }

    return this.mapTechnologiesToProject(technologies, id);
  }

  private mapTechsToProjects(
    projects: Project[],
    technologies: ProjectsTechnologies[],
  ): ProjectWithTechnologies[] {
    return projects.map((project) => {
      const technologiesFromProject = technologies.filter(
        (tech) =>
          !!project.technologies.find(
            (technology) => tech.id === technology.technology_id,
          ),
      );

      delete project.technologies;

      return {
        ...project,
        project_technologies: technologiesFromProject,
      };
    });
  }

  private mapUsersToProjects(
    projects: ProjectWithTechnologies[],
    users: User[] = [],
  ): ProjectWithUser[] {
    return projects.map((project) => {
      const foundUser = users.find((user) => user.id === project.user_id);

      if (!foundUser) {
        return {
          ...project,
          user: null,
        };
      }

      delete project.user_id;

      return {
        ...project,
        user: foundUser,
      };
    });
  }
}
