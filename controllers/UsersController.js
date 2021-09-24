const { db, auth } = require("../db");
const { signupValidator, loginValidator } = require("../utils/validators");

const signup = (req, res) => {
  const newUser = {
    ...req.body,
  };

  const { errors, valid } = signupValidator(newUser);

  if (!valid) return res.status(400).json(errors);

  let token, userId;

  db.doc(`/users/${newUser.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res
          .status(400)
          .json({ handle: "this handle is already taken!" });
      } else {
        return auth.createUserWithEmailAndPassword(
          newUser.email,
          newUser.password
        );
      }
    })
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((idToken) => {
      token = idToken;

      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId,
      };
      return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ email: "email is already used" });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
};

const login = (req, res) => {
  const userAuth = {
    ...req.body,
  };

  const { errors, valid } = loginValidator(userAuth);

  if (!valid) return res.status(400).json(errors);

  auth
    .signInWithEmailAndPassword(userAuth.email, userAuth.password)
    .then((data) => data.user.getIdToken())
    .then((token) => res.json({ token }))
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/wrong-password" || "auth/user-not-found") {
        return res
          .status(403)
          .json({ general: "Invalid credentials, please try again." });
      } else {
        return res.status(400).json({ error: err.code });
      }
    });
};

module.exports = { signup, login };
