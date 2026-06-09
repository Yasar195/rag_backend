import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [UsersModule, FirebaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
