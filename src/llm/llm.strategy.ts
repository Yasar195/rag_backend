import { Injectable } from '@nestjs/common';
import { LLMAdapter } from './llm.adapter';
import { LLMMessage, LLMOptions, LLMResponse } from '../dtos/llm/types';

@Injectable()
export class LLMStrategyContext {
  private activeStrategy: LLMAdapter;

  setStrategy(strategy: LLMAdapter) {
    this.activeStrategy = strategy;
  }
  
  async executeCompletion(messages: LLMMessage[], options?: LLMOptions): Promise<LLMResponse> {
    if (!this.activeStrategy) {
      throw new Error('LLM strategy has not been initialized.');
    }
    return this.activeStrategy.generateCompletion(messages, options);
  }
}
