const admin = require("firebase-admin");
const firebase = require("firebase/app");
require("firebase/auth");

const { firestoreConfig, firebaseConfig } = require("./config");

const app = firebase.default;

app.initializeApp(firebaseConfig);
admin.initializeApp(firestoreConfig);

const auth = app.auth();
const db = admin.firestore();
const userAuth = admin.auth();
const adminStore = admin.storage().bucket();

module.exports = { db, auth, userAuth, adminStore };
