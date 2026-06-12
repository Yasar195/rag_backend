import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { RegisterUserDto, RegisterUserResponse, RegisterUserSchema } from '../dtos/users/types';
import { ApiResponse } from '../dtos/response/types';
import { UsersService } from './users.service';
import { Response } from 'express';
import { FirebaseAuthGuard } from '../firebase/firebase-auth.guard';
import { ZodValidationPipe } from '../pipeline/zod.pipeline';

@Controller('users')
export class UsersController {
    
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(FirebaseAuthGuard)
    @Post('/register')
    async registerUser(@Body(new ZodValidationPipe(RegisterUserSchema)) body: RegisterUserDto, @Res() res: Response): Promise<Response<any, Record<string, any>>> {
        const response = await this.usersService.registerUser(body);  
        return res.status(response.statusCode).json(response);
    }

}
