import { User } from 'src/modules/fetch/interfaces/user.interface';
import { Project } from '../entities/project.entity';

export interface ProjectWithUser extends Project {
  user: User | null;
}
