import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { FirebaseModule } from './firebase/firebase.module';
import { MemoryModule } from './memory/memory.module';
import { BotController } from './bot/bot.controller';
import { BotModule } from './bot/bot.module';
import { BotService } from './bot/bot.service';
import { PineconeModule } from './pinecone/pinecone.module';
import { LLMStrategyContext } from './llm/llm.strategy';

@Module({
  imports: [UsersModule, FirebaseModule, MemoryModule, BotModule, PineconeModule],
  controllers: [BotController],
  providers: [BotService, LLMStrategyContext],
})
export class AppModule {}
