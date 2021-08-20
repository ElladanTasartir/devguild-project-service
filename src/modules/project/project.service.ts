import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectDTO } from './dtos/create-project.dto';
import { TechnologyDTO } from './dtos/technology-dto';
import { Technology } from './entities/project-technologies.entity';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Technology)
    private readonly technologyRepository: Repository<Technology>,
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

    return project;
  }

  findProjects(): Promise<Project[]> {
    return this.projectRepository.find({ relations: ['technologies'] });
  }
}
