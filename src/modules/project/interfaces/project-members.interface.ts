import { User } from 'src/modules/fetch/interfaces/user.interface';
import { ProjectWithTechnologies } from './project-with-technologies.interface';

export interface ProjectWithProjectMembers extends ProjectWithTechnologies {
  project_members: User[];
}
