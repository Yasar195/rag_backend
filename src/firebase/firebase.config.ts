import * as admin from 'firebase-admin';

let app: admin.app.App;

export function initializeFirebase(): admin.app.App {
  if (!app) {
    app = admin.initializeApp({
      credential: admin.credential.cert('./serviceAccountKey.json'),
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