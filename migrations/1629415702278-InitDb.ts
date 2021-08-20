import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDb1629415702278 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE projects (id varchar(36) PRIMARY KEY NOT NULL, title varchar NOT NULL, description text NOT NULL, user_id varchar(36) NOT NULL, repository varchar, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now())',
    );

    await queryRunner.query(
      'CREATE TABLE project_technologies (technology_id int NOT NULL, project_id varchar(36) NOT NULL)',
    );

    await queryRunner.query(
      'ALTER TABLE project_technologies ADD CONSTRAINT PK_project_technologies PRIMARY KEY (technology_id, project_id)',
    );

    await queryRunner.query(
      'ALTER TABLE project_technologies ADD CONSTRAINT FK_project_technologies_projects FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE ON UPDATE CASCADE',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE project_technologies DROP CONSTRAINT FK_project_technologies_projects',
    );

    await queryRunner.query('DROP TABLE project_technologies');

    await queryRunner.query('DROP TABLE projects');
  }
}
