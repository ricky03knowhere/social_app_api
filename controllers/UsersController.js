const config = require("../config");
const { db, auth, adminStore } = require("../db");
const {
  signupValidator,
  loginValidator,
  reduceUserDetails,
} = require("../utils/validators");

const signup = (req, res) => {
  const newUser = {
    ...req.body,
  };

  const { errors, valid } = signupValidator(newUser);

  if (!valid) return res.status(400).json(errors);

  const noImage = "no-image.png";
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
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.firebaseConfig.storageBucket}/o/${noImage}?alt=media`,
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

const addUserDetails = (req, res) => {
  let userDetails = reduceUserDetails(req.body);

  db.doc(`/users/${req.user.handle}`)
    .update(userDetails)
    .then(() => res.json({ message: "User details successfuly added." }))
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.code });
    });
};

const getUserDetails = (req, res) => {
  let userData = {};

  db.doc(`/users/${req.user.handle}`)
    .get()
    .then((data) => {
      if (data.exists) {
        userData.credentials = data.data();
      }
      return db
        .collection("likes")
        .where("userHandle", "==", req.user.handle)
        .get();
    })
    .then((likes) => {
      userData.likes = [];
      likes.forEach((like) => {
        userData.likes.push(like.data());
      });

      return res.json(userData);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

const uploadImage = (req, res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({ headers: req.headers });

  let imageToBeUploaded = {};
  let imageFileName;
  // String for image token
  // let generatedToken = uuid();

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({ error: "Wrong file type submitted" });
    }
    const imageExtension = filename.split(".")[filename.split(".").length - 1];

    imageFileName = `${Math.round(
      Math.random() * 1000000000000
    ).toString()}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on("finish", () => {
    adminStore
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype,
            //Generate token to be appended to imageUrl
            // firebaseStorageDownloadTokens: generatedToken,
          },
        },
      })
      .then(() => {
        // Append token to url
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;
        return db.doc(`/users/${req.user.handle}`).update({ imageUrl });
      })
      .then(() => {
        return res.json({ message: "image uploaded successfully" });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: "something went wrong" });
      });
  });

  return req.pipe(busboy);
};

module.exports = { signup, login, uploadImage, addUserDetails, getUserDetails };
