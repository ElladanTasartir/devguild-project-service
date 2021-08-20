import { Exclude } from 'class-transformer';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Project } from './project.entity';

@Entity({ name: 'project_technologies' })
export class Technology {
  @PrimaryColumn()
  technology_id: number;

  @Exclude()
  @PrimaryColumn()
  project_id: string;

  @ManyToOne(() => Project, (project) => project.technologies)
  @JoinColumn({ name: 'project_id' })
  readonly project: Project;
}
