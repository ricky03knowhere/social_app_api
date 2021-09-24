"use strict";

const admin = require("firebase-admin");
const dotenv = require("dotenv");
const assert = require("assert");

const serviceAccount = require("./utils/social-app-bcd64-firebase-adminsdk-opb5s-1b8a3047f0.json");

dotenv.config();

const {
  PORT,
  HOST,
  HOST_URL,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
  MEASSUREMENT_ID,
} = process.env;

assert(PORT, "provide the server port");
assert(HOST, "provide the server host");

module.exports = {
  port: PORT,
  host: HOST,
  url: HOST_URL,
  firebaseConfig: {
    apiKey: 'AIzaSyAgqJKvJ9viHhxeitGRWb6X3ubFpEf74SU',
    authDomain: AUTH_DOMAIN,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID,
    appId: APP_ID,
    measurementId: MEASSUREMENT_ID
  },
  firestoreConfig: {
    credential: admin.credential.cert(serviceAccount),
  },
};