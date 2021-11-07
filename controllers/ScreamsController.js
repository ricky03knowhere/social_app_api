const { db } = require("../db");
// const Screams = require("../models/Screams");

const addData = (req, res, next) => {
  if (req.body.body.trim() === "")
    return res.status(400).json({ error: "Please provide the body value" });

  const data = {
    body: req.body.body,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0,
  };

  db.collection("screams")
    .add(data)
    .then((doc) => {
      const resScream = data;
      resScream.screamId = doc.id;

      res.json(resScream);
    })
    .catch((err) => {
      res.status(400).json({ error: "something went error!" });

      console.log(err.message);
    });
};

const getAllData = (req, res) => {
  db.collection("screams")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let screams = [];
      data.forEach((doc) => {
        screams.push({
          screamId: doc.id,
          ...doc.data(),
        });
      });
      return res.json(screams);
    })
    .catch((err) => res.send(err));
};

const getData = (req, res) => {
  let screamData = {};

  db.doc(`/screams/${req.params.screamId}`)
    .get()
    .then((data) => {
      if (!data.exists) {
        return res.status(400).json({ error: "Scream data not found!" });
      }
      screamData = data.data();
      screamData.screamId = data.id;

      return db
        .collection("/comments")
        .where("screamId", "==", req.params.screamId)
        .orderBy("createdAt", "desc")
        .get();
    })
    .then((comments) => {
      screamData.comments = [];

      comments.forEach((comment) => {
        screamData.comments.push(comment.data());
      });
      return res.json(screamData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ errors: err.code });
    });
};

const addComment = (req, res) => {
  if (req.body.body.trim("") === "")
    return res.status(500).json({ errors: "Must not be empty!" });

  const comment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    screamId: req.params.screamId,
    userImage: req.user.imageUrl,
    userHandle: req.user.handle,
  };

  db.doc(`/screams/${req.params.screamId}`)
    .get()
    .then((data) => {
      if (!data.exists) {
        return res.status(404).json({ error: "Scream not found" });
      }
      return data.ref.update({ commentCount: data.data().commentCount + 1 });
    })
    .then(() => db.collection("comments").add(comment))
    .then(() => {
      res.json(comment);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ errors: "Something went wrong" });
    });
};

const addLike = (req, res) => {
  const likeDoc = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("screamId", "==", req.params.screamId)
    .limit(1);

  const screamDoc = db.doc(`/screams/${req.params.screamId}`);

  let screamData;

  screamDoc
    .get()
    .then((data) => {
      if (data.exists) {
        screamData = data.data();
        screamData.screamId = data.id;
        return likeDoc.get();
      } else {
        return res.status(404).json({ error: "Scream not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return db
          .collection("likes")
          .add({
            screamId: req.params.screamId,
            userHandle: req.user.handle,
          })
          .then(() => {
            screamData.likeCount++;
            return screamDoc.update({ likeCount: screamData.likeCount });
          })
          .then(() => res.json(screamData));
      } else {
        return res.status(400).json({ error: "Scream already liked" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

const unLike = (req, res) => {
  const likeDoc = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("screamId", "==", req.params.screamId)
    .limit(1);

  const screamDoc = db.doc(`/screams/${req.params.screamId}`);

  let screamData;

  screamDoc
    .get()
    .then((data) => {
      if (data.exists) {
        screamData = data.data();
        screamData.screamId = data.id;
        return likeDoc.get();
      } else {
        return res.status(404).json({ error: "Scream not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return res.status(400).json({ error: "Scream not liked" });
      } else {
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            screamData.likeCount--;
            return screamDoc.update({ likeCount: screamData.likeCount });
          })
          .then(() => res.json(screamData));
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

const deleteScream = (req, res) => {
  const document = db.doc(`/screams/${req.params.screamId}`);

  document
    .get()
    .then((data) => {
      if (!data.exists) {
        return res.status(404).json({ error: "Scream not found" });
      }
      if (data.data().userHandle !== req.user.handle) {
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        return document.delete();
      }
    })
    .then(() => res.json({ message: "Scream deleted successfully" }))
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
module.exports = {
  addData,
  getAllData,
  getData,
  addComment,
  addLike,
  unLike,
  deleteScream,
};
