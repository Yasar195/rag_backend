export interface CreateBotDto {
    name: string;
    description?: string;
    systemPrompt?: string;
}

export interface DeleteBotDto {
    id: string;
}