"use strict";
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config");
const userRoutes = require("./routes/users-routes");
const productRoutes = require("./routes/products-routes");
const orderRoutes = require("./routes/orders-routes");
const favoriteRoutes = require("./routes/favorites-routes");
const waitListRoutes = require("./routes/waitList-routes");
const { format } = require("util");
const app = express();
const Multer = require("multer");
const passport = require("passport");
const auth = require("./auth");
const session = require("express-session");
const firebase = require('./db');
const firestore = firebase.firestore();
const { Storage } = require("@google-cloud/storage");
const storage = new Storage();

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
});

const bucket = storage.bucket(process.env.STORAGE_BUCKET);

const corsOptions = {
  origin: "http://localhost:4200",
  credentials: true, 
  optionSuccessStatus: 200,
};
app.use(express.json());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(cookieParser());

app.post("/upload", multer.single("filename"), (req, res, next) => {
  if (!req.file) {
    res.status(400).json({ message: "No file uploaded." });
    return;
  }

  // Create a new blob in the bucket and upload the file data.
  const blob = bucket.file(`files/${req.file.originalname}`);
  const blobStream = blob.createWriteStream();

  blobStream.on("error", (err) => {
    next(err);
  });

  blobStream.on("finish", () => {
    // The public URL can be used to directly access the file via HTTP.
    const publicUrl = format(
      `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    );
    res.status(200).json(publicUrl);
  });

  blobStream.end(req.file.buffer);
});

app.get("/files/:filename", (req, res, next) => {
  const filename = req.params.filename;
  const file = bucket.file(`files/${filename}`);

  // Dosya adı null veya boş ise 404 hatası döndür
  if (!filename) {
    return res.status(404).json({ error: "Dosya bulunamadı." });
  }

  file
    .createReadStream()
    .on("error", (err) => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    })
    .on("response", (response) => {
      // Set appropriate headers for the response (content-type, content-length, etc.)
      res.set({
        "Content-Type": response.headers["content-type"],
        "Content-Length": response.headers["content-length"],
        // Add more headers if needed
      });
    })
    .on("end", () => {
      // Do any cleanup if needed
    })
    .pipe(res);
});

app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:4200/notfound",
  }),
  async (req, res) => {
    try {
      console.log("Google ile giriş başarılı. Kullanıcı bilgileri:", req.user);
      const userRole = "USER";
      const userEmail = req.user.email;
      
      // Firestore kullanarak kullanıcıyı kaydet
      const userRef = firestore.collection("users").doc(req.user.id);

      await userRef.set({
        name: req.user.given_name,
        surname: req.user.family_name,
        email: userEmail,
        role: userRole
      });

      console.log("Kullanıcı Firestore'a eklendi.");

     
      const token = generateToken(userEmail);

      console.log(token)
      res.redirect(`http://localhost:4200/pages?token=${token}`);
    } catch (error) {
      console.error("Kullanıcı kaydedilirken hata:", error);
      res.redirect("http://localhost:4200/notfound");
    }
  }
);


function generateToken(email) {
  const jwt = require('jsonwebtoken');
  const secretKey = process.env.JWT_SECRET; 
  const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
  return token;
}

app.use("auth/logout", (req, res) => {
  req.session.destroy();
  res.send("logout");
});

app.use("/api", waitListRoutes.routes);
app.use("/api", userRoutes.routes);
app.use("/api", productRoutes.routes);
app.use("/api", orderRoutes.routes);
app.use("/api", favoriteRoutes.routes);

// app.use('/api' ,uploadFile.routes);

app.listen(config.port, () =>
  console.log("App is listening on url http://localhost:" + config.port)
);
