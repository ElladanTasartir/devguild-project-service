import { User } from 'src/modules/fetch/interfaces/user.interface';
import { ProjectWithTechnologies } from './project-with-technologies.interface';

export interface ProjectWithUser extends ProjectWithTechnologies {
  user: User | null;
}
