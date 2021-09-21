const admin = require("firebase-admin");
const firebase = require("firebase/app");
require("firebase/auth");
const { firestoreConfig, firebaseConfig } = require("./config");

const app = firebase.default;
admin.initializeApp(firestoreConfig);

app.initializeApp(firebaseConfig);
const auth = app.auth()


const db = admin.firestore();

module.exports = { db, auth };
