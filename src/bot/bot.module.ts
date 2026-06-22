import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
import { PineconeModule } from '../pinecone/pinecone.module';
import { LLMStrategyContext } from '../llm/llm.strategy';

@Module({
  imports: [PineconeModule],
  controllers: [BotController],
  providers: [BotService, LLMStrategyContext]
})
export class BotModule {}