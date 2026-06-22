import { Body, Controller, Get, Param, Post, Query, Res, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from '../firebase/firebase-auth.guard';
import { BotCreateDto, CreateBotDto, GetBotDto, MessageBot } from '../dtos/bot/types';
import { CurrentUser } from '../firebase/current.user.decorator';
import { response, Response } from 'express';
import { BotCreateMessage, LoggedInUser } from '../dtos/users/types';
import { BotService } from './bot.service';

@Controller('bot')
export class BotController {

    constructor(private readonly botService: BotService) {}

    @UseGuards(FirebaseAuthGuard)
    @Post("create")
    async createBot(@Body() body:CreateBotDto, @CurrentUser() user: LoggedInUser, @Res() res: Response) {
        const response = await this.botService.createBot(body, user);
        return res.status(response.statusCode).json(response);
    }

    @UseGuards(FirebaseAuthGuard)
    @Get("get")
    async getBot(@Query() query: GetBotDto, @CurrentUser() user: LoggedInUser, @Res() res: Response) {
        const response = await this.botService.getBot(query, user);
        return res.status(response.statusCode).json(response);
    }

    @UseGuards(FirebaseAuthGuard)
    @Post(":id/memory/create")
    async createBotMemory(@Param('id') id: string, @Body() data: BotCreateDto, @CurrentUser() user: LoggedInUser, @Res() res: Response) {
        const response = await this.botService.createBotMemory(data, id, user);
        return res.status(response.statusCode).json(response);
    }

    @UseGuards(FirebaseAuthGuard)
    @Post(":id/memory/ask")
    async askBot(@Param('id') id: string, @Body() data: MessageBot, @CurrentUser() user: LoggedInUser, @Res() res: Response) {
        const response = await this.botService.MessageBot(data, id, user)
        return res.status(response.statusCode).json(response);
    }

}
