const functions = require("firebase-functions");
const { db } = require("./db");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const config = require("./config.js");
// const Busboy = require("busboy");

const { screamsRoutes, usersRoutes } = require("./routes");
// const busboy = new Busboy();
const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
// app.use(busboy);

app.use("/api", screamsRoutes.routes);
app.use("/api", usersRoutes.routes);

app.listen(config.port, () =>
  console.log("Server running...\nOn port: " + config.port)
);

// exports.createNotificationOnLike = functions
//   .region("asia-southeast1")
//   .firestore.document("/likes/{id}")
//   .onCreate((snapshot) => {
//     return db
//       .doc(`/screams/${snapshot.data().screamId}`)
//       .get()
//       .then((doc) => {
//         if (doc.exists && doc.data().userHandle !== doc.data().userHandle) {
//           return db.doc(`/notifications/${snapshot.id}`).set({
//             createdAt: new Date().toISOString(),
//             recepient: doc.data().userHandle,
//             sender: snapshot.data().userHandle,
//             type: "like",
//             read: false,
//             screamId: doc.id,
//           });
//         }
//       })
//       .catch((err) => {
//         console.error(err);
//         return;
//       });
//   });

// exports.deleteNotificationOnUnlike = functions
//   .region("asia-southeast1")
//   .firestore.document("/likes/{id}")
//   .onDelete((snapshot) => {
//     return db
//       .doc(`/notifications/${snapshot.id}`)
//       .delete()
//       .catch((err) => {
//         console.error(err);
//         return;
//       });
//   });

// exports.createNotificationOnComment = functions
//   .region("asia-southeast1")
//   .firestore.document("/likes/{id}")
//   .onCreate((snapshot) => {
//     return db
//       .doc(`/screams/${snapshot.data().screamId}`)
//       .get()
//       .then((doc) => {
//         if (doc.exists && doc.data().userHandle !== doc.data().userHandle) {
//           return db.doc(`/notifications/${snapshot.id}`).set({
//             createdAt: new Date().toISOString(),
//             recepient: doc.data().userHandle,
//             sender: snapshot.data().userHandle,
//             type: "comment",
//             read: false,
//             screamId: doc.id,
//           });
//         }
//       })
//       .catch((err) => {
//         console.error(err);
//         return;
//       });
//   });
