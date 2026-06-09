import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { FirebaseAuthGuard } from './firebase/firebase-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  postHello(@Body() body: any): string {
    return `Hello, ${body.name}!`;
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('protected')
  getProtected(@Request() req: any): object {
    return {
      message: 'This is a protected route',
      user: req.user,
    };
  }
}
