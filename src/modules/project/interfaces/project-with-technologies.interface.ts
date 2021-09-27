import { Project } from '../entities/project.entity';
import { ProjectsTechnologies } from './project-technologies.interface';

export interface ProjectWithTechnologies extends Project {
  project_technologies: ProjectsTechnologies[];
}
