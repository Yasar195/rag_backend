import { LLMAdapter } from '../llm.adapter';
import { LLMMessage, LLMOptions, LLMResponse } from '../../dtos/llm/types';
import Groq from "groq-sdk";

export class GroqAIAdapter implements LLMAdapter {
  readonly providerName = 'groq';
  private groq: Groq;

  constructor(apiKey: string) {
    this.groq = new Groq({ apiKey });
  }

  async generateCompletion(messages: LLMMessage[], options?: LLMOptions): Promise<LLMResponse> {
    const response = await this.groq.chat.completions.create({
      model: options?.model || 'llama-3.1-8b-instant',
      messages: messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens,
    });

    return {
      content: response.choices[0].message.content || '',
      usage: {
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0,
        totalTokens: response.usage?.total_tokens || 0,
      },
    };
  }
}
