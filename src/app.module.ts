import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { FirebaseModule } from './firebase/firebase.module';
import { MemoryModule } from './memory/memory.module';
import { BotController } from './bot/bot.controller';
import { BotModule } from './bot/bot.module';

@Module({
  imports: [UsersModule, FirebaseModule, MemoryModule, BotModule],
  controllers: [BotController],
  providers: [],
})
export class AppModule {}
