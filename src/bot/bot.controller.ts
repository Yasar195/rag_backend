import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from '../firebase/firebase-auth.guard';
import { CreateBotDto } from '../dtos/bot/types';
import { CurrentUser } from '../firebase/current.user.decorator';
import { Response } from 'express';
import { LoggedInUser } from '../dtos/users/types';

@Controller('bot')
export class BotController {

    @UseGuards(FirebaseAuthGuard)
    @Post("create")
    async createBot(@Body() body:CreateBotDto, @CurrentUser() user: LoggedInUser, @Res() res: Response) {
        console.log(user);
        return res.status(201).json({ message: 'Bot created successfully' });
    }

}
