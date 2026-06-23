import { Injectable } from '@nestjs/common';
import { BotCreateDto, BotResponse, CreateBotDto, GetBotDto, GetBotMemory, GetBotResponse, MessageBot } from '../dtos/bot/types';
import { BotCreateMessage, LoggedInUser } from '../dtos/users/types';
import { ApiResponse, MessageResponse } from '../dtos/response/types';
import { botTable } from '../db/schema';
import { db } from '..';
import { count, desc, eq } from 'drizzle-orm';
import { PineconeService } from '../pinecone/pinecone.service';
import { LLMStrategyContext } from '../llm/llm.strategy';
import { GroqAIAdapter } from '../llm/groq/groq.adapter';
import { LLMMessage, LLMResponse } from '../dtos/llm/types';

@Injectable()
export class BotService {

    constructor(private readonly pineconeService: PineconeService, private llmContext: LLMStrategyContext) {
        this.llmContext.setStrategy(new GroqAIAdapter(process.env.GROQ_API_KEY));
    }

    async createBot(data: CreateBotDto, user: LoggedInUser): Promise<ApiResponse<BotCreateMessage>> {
        let response: ApiResponse<BotCreateMessage>;
        try {
            const bot: typeof botTable.$inferInsert = {
                name: data.name,
                description: data.description,
                systemPrompt: data.systemPrompt,
                userId: user.uid
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

    async getBot(query: GetBotDto, user: LoggedInUser): Promise<ApiResponse<GetBotResponse>> {
        let response: ApiResponse<GetBotResponse>;
        try {
            const [bots, [{ total }]] = await Promise.all([
                db
                    .select()
                    .from(botTable)
                    .where(eq(botTable.userId, user.uid))
                    .limit(query.limit)
                    .offset((query.page - 1) * query.limit),

                db
                    .select({ total: count() })
                    .from(botTable)
                    .where(eq(botTable.userId, user.uid))
            ]);
            response = {
                success: true,
                statusCode: 200,
                data: { count: total, bots },
                message: 'Bots retrieved successfully',
                error: null
            }
        } catch(error) {
            response = {
                success: false,
                statusCode: 500,
                data: null,
                message: 'Failed to retrieve bots',
                error: error.message,
            }
        }
        return response;
    }

    async createBotMemory(data: BotCreateDto, botId: string, user: LoggedInUser): Promise<ApiResponse<MessageResponse>> {
        let response: ApiResponse<MessageResponse>;

        try {
            const isOwner = await this.checkBotOwnership(botId, user.uid);
            if(!isOwner) {
                response = {
                    success: false,
                    statusCode: 403,
                    data: null,
                    message: 'You do not have permission to add memory to this bot',
                    error: null
                }

                return response;
            }

            await this.pineconeService.createMemory(botId, data.text);

          
            response = {
                success: true,
                statusCode: 201,
                data: { message: 'Memory added to bot successfully' },
                message: 'Memory added to bot successfully',
                error: null
            }

        } catch(error) {
            response = {
                success: false,
                statusCode: 500,
                data: null,
                message: 'Failed to add memory to bot',
                error: error.message,
            }
        }
        return response;
    }

    async MessageBot(data: MessageBot, botId: string, user: LoggedInUser): Promise<ApiResponse<LLMResponse>> {
        let response: ApiResponse<LLMResponse>;

        try {
            const isOwner = await this.checkBotOwnership(botId, user.uid);
            if(!isOwner) {
                response = {
                    success: false,
                    statusCode: 403,
                    data: null,
                    message: 'You do not have permission to add memory to this bot',
                    error: null
                }

                return response;
            }

            const bot = await db.select({ systemPrompt: botTable.systemPrompt }).from(botTable).where(eq(botTable.id, botId)).limit(1);


            const results = await this.pineconeService.queryMemory(botId, data.message);

            const systemPrompt = `
                ${bot[0].systemPrompt}
                STRICT RESPONSE RULES:
                - ONLY answer using the information provided in the "Retrieved Context Memories" section below.
                - If the answer is NOT found in the retrieved context, respond with: "I don't have enough information to answer that."
                - Do NOT make up, infer, or hallucinate any information beyond what is explicitly stated in the context.
                - Do NOT use your general training knowledge to fill in gaps — stick strictly to the provided context.
                - If the user's question is partially answered by the context, answer only the part that is supported and acknowledge the rest is unavailable.
                Retrieved Context Memories:
                ${results || 'No historical memories found for this specific query.'}
                `.trim();

            const messages: LLMMessage[] = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: data.message }
            ];

            const llmResponse = await this.llmContext.executeCompletion(messages, {
                temperature: 0.3, // Low temperature forces adherence to provided text
            });

            response = {
                success: true,
                statusCode: 200,
                data: llmResponse,
                message: 'Bot responded successfully',
                error: null
            }


        } catch(error) {
            response = {
                success: false,
                statusCode: 500,
                data: null,
                message: 'Failed to respond.',
                error: error.message,
            }
        }
        return response;
    }

    async getMemoryOfBot(botId: string, userId: string): Promise<ApiResponse<GetBotMemory>> {
        let response: ApiResponse<GetBotMemory>;
        try {
            const isOwner = await this.checkBotOwnership(botId, userId);
            if(!isOwner) {
                response = {
                    success: false,
                    statusCode: 403,
                    data: null,
                    message: 'You do not have permission to add memory to this bot',
                    error: null
                }

                return response;
            }

            const records = await this.pineconeService.getMemory(botId);
            const texts = Object.values(records)
                .map(item => item.metadata?.text)
                .filter(Boolean);

            response = {
                data: {
                    memory: texts
                },
                message: "Bot memory fetched",
                statusCode: 200,
                success: true,
                error: null
            }
        } catch(error) {
            response = {
                success: false,
                statusCode: 500,
                data: null,
                message: 'Failed to fetch memory.',
                error: error.message,
            }
        }

        return response;
    }

    async updateBot(data: CreateBotDto, user: LoggedInUser): Promise<ApiResponse<BotCreateMessage>>{
        let response: ApiResponse<BotCreateMessage>;

        try {

            const isOwner = await this.checkBotOwnership(data.id, user.uid);
            if(!isOwner) {
                response = {
                    success: false,
                    statusCode: 403,
                    data: null,
                    message: 'You do not have permission to add memory to this bot',
                    error: null
                }

                return response;
            }

            await db.update(botTable).set({ systemPrompt: data.systemPrompt, description: data.description, name: data.name }).where(eq(botTable.id, data.id)).returning();

            response = {
                data: {
                    message: "Bot updated"
                },
                message: "Bot update success.",
                statusCode: 200,
                success: true,
                error: null
            }
            
        } catch(error) {
            response = {
                data: null,
                message: "Bot update failed.",
                statusCode: 500,
                success: true,
                error: error.message
            }
        }

        return response;
    }
 
    // private methods
    
    private async checkBotOwnership(botId: string, userId: string): Promise<boolean> {
        const bot = await db.select().from(botTable).where(eq(botTable.id, botId)).limit(1);
        if (bot.length === 0) {
            return false; // Bot not found
        }
        return bot[0].userId === userId; // Check ownership
    }

}
