import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { User } from './interfaces/user.interface';
import { userServiceURL } from '../../config';

@Injectable()
export class FetchUsersService {
  private httpService: AxiosInstance;

  constructor() {
    this.httpService = axios.create({
      baseURL: userServiceURL,
    });
  }

  async getUserById(user_id: string): Promise<User> {
    const { data } = await this.httpService.get(`/users/${user_id}`);

    return data;
  }

  async getUsersByUserIds(user_ids: string[]): Promise<User[]> {
    const { data } = await this.httpService.get(`/users`, {
      params: {
        ids: user_ids.join(','),
      },
    });

    return data;
  }

  async getProjectMembers(project_id: string): Promise<User[]> {
    const { data } = await this.httpService.get(
      `/projects/${project_id}/members`,
    );

    return data;
  }

  async getProjectsWhereUserIsAMember(user_id: string): Promise<string[]> {
    const { data } = await this.httpService.get<string[]>(
      `/projects/${user_id}/project-members`,
    );

    return data;
  }

  async insertProjectMember(
    project_id: string,
    user_id: string,
  ): Promise<void> {
    await this.httpService.post(`/projects/${project_id}/members`, {
      user_id,
    });
  }
}
