const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const path = require("path");
const multer = require("multer");

dotenv.config();
mongoose.set("strictQuery", true); //to surpass the depricated warnings
mongoose.connect(process.env.MONGO_URL, () => console.log("DB Connected..."));

const app = express();

app.use(
  cors({
    origin: "*",
  })
);
//if we give http://localhost:5000/images/ then it will go this directory path.join(__dirname, "public/images")
app.use("/images", express.static(path.join(__dirname, "public/images"))); 

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);

app.listen(process.env.PORT || 5000 , () => console.log("Server is Running..."));
