import { Module } from '@nestjs/common';
import { FetchTechService } from './fetch-tech.service';
import { FetchUsersService } from './fetch-users.service';

@Module({
  providers: [FetchUsersService, FetchTechService],
  exports: [FetchUsersService, FetchTechService],
})
export class FetchModule {}
