import { Module } from '@nestjs/common';
import { initializeFirebase } from './firebase.config';
import { FirebaseAuthGuard } from './firebase-auth.guard';

@Module({
  providers: [FirebaseAuthGuard],
  exports: [FirebaseAuthGuard],
})
export class FirebaseModule {
  constructor() {
    initializeFirebase();
  }
}
