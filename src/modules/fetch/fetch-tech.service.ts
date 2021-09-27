import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { techServiceURL } from '../../config';
import { ProjectsTechnologies } from '../project/interfaces/project-technologies.interface';

@Injectable()
export class FetchTechService {
  private httpService: AxiosInstance;

  constructor() {
    this.httpService = axios.create({
      baseURL: techServiceURL,
    });
  }

  async findTechnologiesbyIds(ids: number[]): Promise<ProjectsTechnologies[]> {
    const {
      data: {
        data: { technologies },
      },
    } = await this.httpService.post('', {
      query: `query GetTechnologiesByIds($ids: [Int!]){
          technologies(ids: $ids) {
            id,
            name
          }
        }`,
      variables: {
        ids,
      },
    });

    return technologies;
  }
}
