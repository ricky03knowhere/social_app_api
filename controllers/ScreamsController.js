const { db } = require("../db");
const Screams = require("../models/Screams");

const addData = (req, res, next) => {
  const data = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString(),
  };

  db.collection("screams")
    .add(data)
    .then((doc) => {
      res.json({ message: `Data with ID ${doc.id} successfully added.` });
    })
    .catch((err) => {
      res.status(400).json({ error: "something error!" });

      console.log(err.message);
    });
};

const getData = (req, res) => {
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

module.exports = {
  addData,
  getData,
};
