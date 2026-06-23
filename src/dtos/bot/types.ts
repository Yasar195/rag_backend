import { botTable } from "../../db/schema";
import { pagination } from "../response/types";

export interface CreateBotDto {
    id?:string;
    name: string;
    description?: string;
    systemPrompt?: string;
}

export interface DeleteBotDto {
    id: string;
}

export interface GetBotDto  extends pagination {
    search?: string;
}

export interface GetBotResponse {
    count: number;
    bots: typeof botTable.$inferInsert[]
}

export interface BotCreateDto {
    text: string;
}

export interface GetBotMemory {
    memory: string[]
}

export interface MessageBot {
    message: string;
}

export interface BotResponse {
    response: string;
}
