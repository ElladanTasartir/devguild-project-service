import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  healthCheck(): Record<string, string> {
    return {
      status: 'Working!',
    };
  }
}
