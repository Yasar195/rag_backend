import { LLMMessage, LLMOptions, LLMResponse } from '../dtos/llm/types';

export interface LLMAdapter {
  providerName: string;
  generateCompletion(messages: LLMMessage[], options?: LLMOptions): Promise<LLMResponse>;
}