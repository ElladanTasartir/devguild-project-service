import { User } from 'src/modules/fetch/interfaces/user.interface';
import { Project } from '../entities/project.entity';

export interface ProjectWithProjectMembers extends Project {
  project_members: User[];
}
