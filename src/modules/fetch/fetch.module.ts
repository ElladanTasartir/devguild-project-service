import { Module } from '@nestjs/common';
import { FetchUsersService } from './fetch-users.service';

@Module({
  providers: [FetchUsersService],
  exports: [FetchUsersService],
})
export class FetchModule {}
