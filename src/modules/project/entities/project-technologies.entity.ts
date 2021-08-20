import { Exclude } from 'class-transformer';
import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'project_technologies' })
export class Technology {
  @PrimaryColumn()
  technology_id: number;

  @Exclude()
  @PrimaryColumn()
  project_id: string;
}
