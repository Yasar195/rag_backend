import * as admin from 'firebase-admin';

let app: admin.app.App;

export function initializeFirebase(): admin.app.App {
  if (!app) {
    // Initialize Firebase Admin SDK
    // Uses GOOGLE_APPLICATION_CREDENTIALS environment variable by default
    app = admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  }
  return app;
}

export function getFirebaseAuth(): admin.auth.Auth {
  if (!app) {
    initializeFirebase();
  }
  return admin.auth(app);
}

export function getFirebaseApp(): admin.app.App {
  if (!app) {
    initializeFirebase();
  }
  return app;
}
