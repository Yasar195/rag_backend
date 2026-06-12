import { Injectable } from '@nestjs/common';
import { CreateBotDto } from '../dtos/bot/types';
import { BotCreateMessage, LoggedInUser } from '../dtos/users/types';
import { ApiResponse } from '../dtos/response/types';
import { botTable } from '../db/schema';
import { db } from '..';

@Injectable()
export class BotService {

    async createBot(data: CreateBotDto, user: LoggedInUser): Promise<ApiResponse<BotCreateMessage>> {
        let response: ApiResponse<BotCreateMessage>;
        try {
            const bot: typeof botTable.$inferInsert = {
                name: data.name,
                description: data.description,
                systemPrompt: data.systemPrompt
            }

            await db.insert(botTable).values(bot);
            response = {
                success: true,
                statusCode: 201,
                data: { message: 'Bot created successfully' },
                message: 'Bot created successfully',
                error: null
            }
        } catch(error) {
            response = {
                success: false,
                statusCode: 500,
                data: null,
                message: 'Failed to register bot',
                error: error.message,
            }
        }
        return response;
    }

}
